package pe.edu.upc.ecopest.clients;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import pe.edu.upc.ecopest.exceptions.ExternalServiceException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class OpenMeteoClient {

    public record CurrentWeather(double temperature, double humidity, String source) {}

    public record DailyForecast(LocalDate date, double temperatureMax, double temperatureMin, double precipitation, double humidity) {}

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

    @SuppressWarnings("unchecked")
    public List<DailyForecast> fetchForecast(double latitude, double longitude, int days) {
        try {
            Map<String, Object> body = restClient.get()
                    .uri(uri -> uri.path("/v1/forecast")
                            .queryParam("latitude", latitude)
                            .queryParam("longitude", longitude)
                            .queryParam("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean")
                            .queryParam("forecast_days", days)
                            .queryParam("timezone", "auto")
                            .build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});
            Map<String, List<Object>> daily = (Map<String, List<Object>>) body.get("daily");
            List<DailyForecast> items = new ArrayList<>();
            for (int i = 0; i < daily.get("time").size(); i++) {
                items.add(new DailyForecast(
                        LocalDate.parse((String) daily.get("time").get(i)),
                        ((Number) daily.get("temperature_2m_max").get(i)).doubleValue(),
                        ((Number) daily.get("temperature_2m_min").get(i)).doubleValue(),
                        ((Number) daily.get("precipitation_sum").get(i)).doubleValue(),
                        ((Number) daily.get("relative_humidity_2m_mean").get(i)).doubleValue()));
            }
            return items;
        } catch (Exception e) {
            throw new ExternalServiceException("No se pudo obtener el pronostico de Open-Meteo", e);
        }
    }
}
