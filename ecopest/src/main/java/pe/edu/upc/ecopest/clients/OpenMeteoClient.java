package pe.edu.upc.ecopest.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
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

    public record CurrentWeather(double temperature, double humidity) {}

    private final RestClient restClient;

    public OpenMeteoClient(@Value("${openmeteo.base-url:https://api.open-meteo.com}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @SuppressWarnings("unchecked")
    public CurrentWeather fetchCurrent(double latitude, double longitude) {
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
                    ((Number) current.get("relative_humidity_2m")).doubleValue());
        } catch (ExternalServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ExternalServiceException("Could not get the weather from Open-Meteo", e);
        }
    }
}
