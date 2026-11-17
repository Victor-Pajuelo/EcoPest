package pe.edu.upc.ecopest.dtos;

import java.time.LocalDate;

public class ForecastDayDTO {
    private LocalDate date;
    private double temperatureMax;
    private double temperatureMin;
    private double precipitation;
    private double humidity;
    private String pestRisk;

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public double getTemperatureMax() { return temperatureMax; }
    public void setTemperatureMax(double temperatureMax) { this.temperatureMax = temperatureMax; }
    public double getTemperatureMin() { return temperatureMin; }
    public void setTemperatureMin(double temperatureMin) { this.temperatureMin = temperatureMin; }
    public double getPrecipitation() { return precipitation; }
    public void setPrecipitation(double precipitation) { this.precipitation = precipitation; }
    public double getHumidity() { return humidity; }
    public void setHumidity(double humidity) { this.humidity = humidity; }
    public String getPestRisk() { return pestRisk; }
    public void setPestRisk(String pestRisk) { this.pestRisk = pestRisk; }
}
