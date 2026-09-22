package pe.edu.upc.ecopest.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "weather_data", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_business_entity", "date"})
})
public class WeatherData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_weather_data")
    private Long idWeatherData;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "humidity")
    private Double humidity;

    @Column(name = "source", length = 50)
    private String source;

    @ManyToOne
    @JoinColumn(name = "id_business_entity", nullable = false)
    private BusinessEntity businessEntity;

    public WeatherData() {}

    @PrePersist
    public void prePersist() {
        if (source == null || source.isBlank()) source = "OpenWeather";
    }

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
    public BusinessEntity getBusinessEntity() { return businessEntity; }
    public void setBusinessEntity(BusinessEntity businessEntity) { this.businessEntity = businessEntity; }
}
