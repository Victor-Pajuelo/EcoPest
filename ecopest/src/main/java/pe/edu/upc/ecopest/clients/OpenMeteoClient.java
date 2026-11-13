package pe.edu.upc.ecopest.clients;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import pe.edu.upc.ecopest.exceptions.ExternalServiceException;

import java.util.Map;

@Component
public class OpenMeteoClient {

    public record CurrentWeather(double temperature, double humidity, String source) {}

    private final RestClient restClient;

    public OpenMeteoClient() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.open-meteo.com")
                .build();
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
            Map<String, Object> current = (Map<String, Object>) body.get("current");
            double temperature = ((Number) current.get("temperature_2m")).doubleValue();
            double humidity = ((Number) current.get("relative_humidity_2m")).doubleValue();
            return new CurrentWeather(temperature, humidity, "OPEN-METEO");
        } catch (Exception e) {
            throw new ExternalServiceException("No se pudo obtener el clima de Open-Meteo", e);
        }
    }
}
