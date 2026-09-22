package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.WeatherData;
import pe.edu.upc.ecopest.repositories.IWeatherDataRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IWeatherDataService;
import java.util.List;
import java.util.Optional;

@Service
public class WeatherDataServiceImplement implements IWeatherDataService {
    private final IWeatherDataRepository repository;
    public WeatherDataServiceImplement(IWeatherDataRepository repository) { this.repository = repository; }
    @Override public void insert(WeatherData weatherData) { repository.save(weatherData); }
    @Override public List<WeatherData> list() { return repository.findAll(); }
    @Override public List<WeatherData> listByBusinessEntity(Long businessEntityId) { return repository.findByBusinessEntity_IdBusinessEntity(businessEntityId); }
    @Override public Optional<WeatherData> findById(Long id) { return repository.findById(id); }
}
