package pe.edu.upc.ecopest.clients;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import pe.edu.upc.ecopest.exceptions.ExternalServiceException;

import java.util.Map;

/**
 * Cliente de la API externa Open-Meteo (https://open-meteo.com), gratuita y sin API key.
 * Devuelve el clima actual (temperatura y humedad relativa) para unas coordenadas.
 */
@Component
public class OpenMeteoClient {

    public record CurrentWeather(double temperature, double humidity, String source) {}

    private static final Logger log = LoggerFactory.getLogger(OpenMeteoClient.class);
    private static final int MAX_ATTEMPTS = 3;

    private final RestClient restClient;
    private final RestClient fallbackClient;

    public OpenMeteoClient(@Value("${openmeteo.base-url:https://api.open-meteo.com}") String baseUrl) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(8000);
        factory.setReadTimeout(12000);
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(factory)
                .defaultHeader("User-Agent", "EcoPest/1.0 (academic project; UPC)")
                .defaultHeader("Accept", "application/json")
                .build();
        this.fallbackClient = RestClient.builder()
                .baseUrl("https://api.met.no")
                .requestFactory(factory)
                .defaultHeader("User-Agent", "EcoPest/1.0 github.com/Victor-Pajuelo/EcoPest")
                .build();
    }

    @SuppressWarnings("unchecked")
    public CurrentWeather fetchCurrent(double latitude, double longitude) {
        Exception last = null;
        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                Map<String, Object> body = restClient.get()
                        .uri(uri -> uri.path("/v1/forecast")
                                .queryParam("latitude", latitude)
                                .queryParam("longitude", longitude)
                                .queryParam("current", "temperature_2m,relative_humidity_2m")
                                .build())
                        .retrieve()
                        .body(new ParameterizedTypeReference<Map<String, Object>>() {});
                Map<String, Object> current = body == null ? null : (Map<String, Object>) body.get("current");
                if (current == null || current.get("temperature_2m") == null || current.get("relative_humidity_2m") == null) {
                    throw new ExternalServiceException("Open-Meteo returned an unexpected response");
                }
                return new CurrentWeather(
                        ((Number) current.get("temperature_2m")).doubleValue(),
                        ((Number) current.get("relative_humidity_2m")).doubleValue(),
                        "OPEN-METEO");
            } catch (ExternalServiceException e) {
                log.warn("Open-Meteo unexpected response (lat={}, lon={}): {}", latitude, longitude, e.getMessage());
                throw e;
            } catch (Exception e) {
                last = e;
                if (e instanceof org.springframework.web.client.HttpClientErrorException) {
                    log.warn("Open-Meteo rejected the request ({}), skipping retries", e.getMessage());
                    break;
                }
                log.warn("Open-Meteo attempt {}/{} failed (lat={}, lon={}): {}: {}",
                        attempt, MAX_ATTEMPTS, latitude, longitude, e.getClass().getSimpleName(), e.getMessage());
                if (attempt < MAX_ATTEMPTS) {
                    try {
                        Thread.sleep(600L * attempt);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
        }
        log.error("Open-Meteo unavailable after {} attempts, using fallback provider", MAX_ATTEMPTS, last);
        return fetchFallback(latitude, longitude, last);
    }

    /**
     * Respaldo gratuito (MET Norway, sin API key) por si Open-Meteo limita las peticiones
     * (p. ej. 429 por IP compartida en hosting gratuito). Se registra con source MET-NORWAY.
     */
    @SuppressWarnings("unchecked")
    private CurrentWeather fetchFallback(double latitude, double longitude, Exception primaryError) {
        try {
            Map<String, Object> body = fallbackClient.get()
                    .uri(uri -> uri.path("/weatherapi/locationforecast/2.0/compact")
                            .queryParam("lat", Math.round(latitude * 10000d) / 10000d)
                            .queryParam("lon", Math.round(longitude * 10000d) / 10000d)
                            .build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});
            Map<String, Object> props = (Map<String, Object>) body.get("properties");
            java.util.List<Map<String, Object>> series = (java.util.List<Map<String, Object>>) props.get("timeseries");
            Map<String, Object> data = (Map<String, Object>) series.get(0).get("data");
            Map<String, Object> details = (Map<String, Object>) ((Map<String, Object>) data.get("instant")).get("details");
            return new CurrentWeather(
                    ((Number) details.get("air_temperature")).doubleValue(),
                    ((Number) details.get("relative_humidity")).doubleValue(),
                    "MET-NORWAY");
        } catch (Exception e) {
            log.error("Fallback weather provider failed too: {}: {}", e.getClass().getSimpleName(), e.getMessage());
            throw new ExternalServiceException("Could not get the weather from Open-Meteo (the service is limiting requests); try again later", primaryError != null ? primaryError : e);
        }
    }
}
