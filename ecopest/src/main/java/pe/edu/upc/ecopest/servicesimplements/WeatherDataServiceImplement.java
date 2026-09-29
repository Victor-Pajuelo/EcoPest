package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upc.ecopest.entities.BusinessEntity;
import pe.edu.upc.ecopest.entities.WeatherData;
import pe.edu.upc.ecopest.repositories.IWeatherDataRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IWeatherDataService;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class WeatherDataServiceImplement implements IWeatherDataService {

    private final IWeatherDataRepository repository;

    public WeatherDataServiceImplement(IWeatherDataRepository repository) {
        this.repository = repository;
    }

    @Override
    public void insert(WeatherData weatherData) {
        repository.save(weatherData);
    }

    @Override
    public List<WeatherData> list() {
        return repository.findAll();
    }

    @Override
    public List<WeatherData> listByBusinessEntity(Long businessEntityId) {
        return repository.findByBusinessEntity_IdBusinessEntity(businessEntityId);
    }

    @Override
    public Optional<WeatherData> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<WeatherData> findWeatherByPestType(String pestName) {
        return repository.findWeatherByPestType(pestName);
    }

    @Override
    public List<Object[]> averageWeatherByBusinessEntity() {
        return repository.averageWeatherByBusinessEntity();
    }

    @Override
    @Transactional
    public void deleteByBusinessEntity(Long businessEntityId) {
        repository.deleteByBusinessEntity_IdBusinessEntity(businessEntityId);
    }

    @Override
    public void update(WeatherData weatherData) {
        repository.save(weatherData);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public WeatherData simulate(BusinessEntity businessEntity, LocalDate date) {
        WeatherData weatherData = new WeatherData();
        weatherData.setDate(date);
        weatherData.setTemperature(randomValue(14.0, 30.0));
        weatherData.setHumidity(randomValue(60.0, 95.0));
        weatherData.setSource("SIMULATED");
        weatherData.setBusinessEntity(businessEntity);
        return repository.save(weatherData);
    }

    private double randomValue(double min, double max) {
        double value = ThreadLocalRandom.current().nextDouble(min, max);
        return Math.round(value * 10.0) / 10.0;
    }
}