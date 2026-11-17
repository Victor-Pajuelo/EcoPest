package pe.edu.upc.ecopest.clients;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import pe.edu.upc.ecopest.clients.OpenMeteoClient.CurrentWeather;
import pe.edu.upc.ecopest.clients.OpenMeteoClient.DailyForecast;
import pe.edu.upc.ecopest.exceptions.ExternalServiceException;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// API gratuita del instituto meteorologico de Noruega (MET Norway), sin clave.
// Se usa de respaldo cuando Open-Meteo no responde (por ejemplo, por su limite diario).
@Component
public class MetNoClient {

    private final RestClient restClient;

    public MetNoClient() {
        // MET Norway exige identificar la aplicacion en el User-Agent
        this.restClient = RestClient.builder()
                .baseUrl("https://api.met.no")
                .defaultHeader("User-Agent", "EcoPest/1.0 github.com/Victor-Pajuelo/EcoPest")
                .build();
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchTimeseries(double latitude, double longitude) {
        Map<String, Object> body = restClient.get()
                .uri(uri -> uri.path("/weatherapi/locationforecast/2.0/compact")
                        .queryParam("lat", Math.round(latitude * 10000) / 10000.0)
                        .queryParam("lon", Math.round(longitude * 10000) / 10000.0)
                        .build())
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});
        Map<String, Object> properties = (Map<String, Object>) body.get("properties");
        return (List<Map<String, Object>>) properties.get("timeseries");
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> instant(Map<String, Object> entry) {
        Map<String, Object> data = (Map<String, Object>) entry.get("data");
        Map<String, Object> instant = (Map<String, Object>) data.get("instant");
        return (Map<String, Object>) instant.get("details");
    }

    @SuppressWarnings("unchecked")
    private double precipitation(Map<String, Object> entry) {
        Map<String, Object> data = (Map<String, Object>) entry.get("data");
        for (String period : new String[]{"next_1_hours", "next_6_hours"}) {
            Map<String, Object> next = (Map<String, Object>) data.get(period);
            if (next != null) {
                Map<String, Object> details = (Map<String, Object>) next.get("details");
                if (details != null && details.get("precipitation_amount") != null) {
                    return ((Number) details.get("precipitation_amount")).doubleValue();
                }
            }
        }
        return 0;
    }

    public CurrentWeather fetchCurrent(double latitude, double longitude) {
        try {
            Map<String, Object> details = instant(fetchTimeseries(latitude, longitude).get(0));
            double temperature = ((Number) details.get("air_temperature")).doubleValue();
            double humidity = ((Number) details.get("relative_humidity")).doubleValue();
            return new CurrentWeather(temperature, humidity, "MET-NORWAY");
        } catch (Exception e) {
            throw new ExternalServiceException("No se pudo obtener el clima de MET Norway", e);
        }
    }

    // Agrupa las horas por dia local (la hora local se calcula con la longitud: 15 grados = 1 hora)
    public List<DailyForecast> fetchForecast(double latitude, double longitude, int days) {
        try {
            ZoneOffset offset = ZoneOffset.ofHours((int) Math.round(longitude / 15));
            Map<LocalDate, List<Map<String, Object>>> byDay = new LinkedHashMap<>();
            for (Map<String, Object> entry : fetchTimeseries(latitude, longitude)) {
                OffsetDateTime time = OffsetDateTime.parse((String) entry.get("time")).withOffsetSameInstant(offset);
                byDay.computeIfAbsent(time.toLocalDate(), d -> new ArrayList<>()).add(entry);
            }
            List<DailyForecast> items = new ArrayList<>();
            for (Map.Entry<LocalDate, List<Map<String, Object>>> day : byDay.entrySet()) {
                if (items.size() >= days) {
                    break;
                }
                double max = -100;
                double min = 100;
                double humiditySum = 0;
                double rain = 0;
                for (Map<String, Object> entry : day.getValue()) {
                    Map<String, Object> details = instant(entry);
                    double temperature = ((Number) details.get("air_temperature")).doubleValue();
                    max = Math.max(max, temperature);
                    min = Math.min(min, temperature);
                    humiditySum += ((Number) details.get("relative_humidity")).doubleValue();
                    rain += precipitation(entry);
                }
                items.add(new DailyForecast(day.getKey(), max, min,
                        Math.round(rain * 10) / 10.0,
                        Math.round(humiditySum / day.getValue().size())));
            }
            return items;
        } catch (Exception e) {
            throw new ExternalServiceException("No se pudo obtener el pronostico de MET Norway", e);
        }
    }
}
