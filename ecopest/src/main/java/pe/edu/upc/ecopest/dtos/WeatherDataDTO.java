package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class WeatherDataDTO {
    private Long idWeatherData;
    @NotNull(message = "The date is required")
    private LocalDate date;
    private Double temperature;
    private Double humidity;
    private String source;
    @NotNull(message = "The business entity id is required")
    private Long businessEntityId;

    public Long getIdWeatherData() { return idWeatherData; }
    public void setIdWeatherData(Long idWeatherData) { this.idWeatherData = idWeatherData; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
    public Double getHumidity() { return humidity; }
    public void setHumidity(Double humidity) { this.humidity = humidity; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Long getBusinessEntityId() { return businessEntityId; }
    public void setBusinessEntityId(Long businessEntityId) { this.businessEntityId = businessEntityId; }
}
