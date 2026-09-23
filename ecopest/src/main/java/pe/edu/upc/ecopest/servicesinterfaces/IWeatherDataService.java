package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.WeatherData;
import java.util.List;
import java.util.Optional;

public interface IWeatherDataService {
    void insert(WeatherData weatherData);
    List<WeatherData> list();
    List<WeatherData> listByBusinessEntity(Long businessEntityId);
    Optional<WeatherData> findById(Long id);

    // Nuevos métodos para JOIN y DeleteBy
    List<WeatherData> findWeatherByPestType(String pestName);
    void deleteByBusinessEntity(Long businessEntityId);
}