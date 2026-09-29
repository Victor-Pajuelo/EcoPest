package pe.edu.upc.ecopest.dtos;

public class AverageWeatherDTO {
    private String name;
    private double avgTemperature;
    private double avgHumidity;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getAvgTemperature() { return avgTemperature; }
    public void setAvgTemperature(double avgTemperature) { this.avgTemperature = avgTemperature; }
    public double getAvgHumidity() { return avgHumidity; }
    public void setAvgHumidity(double avgHumidity) { this.avgHumidity = avgHumidity; }
}
