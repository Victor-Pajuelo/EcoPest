package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upc.ecopest.clients.OpenMeteoClient;
import pe.edu.upc.ecopest.entities.BusinessEntity;
import pe.edu.upc.ecopest.entities.WeatherData;
import pe.edu.upc.ecopest.repositories.IWeatherDataRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IWeatherDataService;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class WeatherDataServiceImplement implements IWeatherDataService {

    private final IWeatherDataRepository repository;
    private final OpenMeteoClient openMeteoClient;

    // El pronostico se guarda 30 minutos por zona para no llamar a Open-Meteo en cada visita
    private static final long FORECAST_CACHE_MILLIS = 30 * 60 * 1000;
    private record CachedForecast(long savedAt, List<OpenMeteoClient.DailyForecast> days) {}
    private final Map<String, CachedForecast> forecastCache = new ConcurrentHashMap<>();

    public WeatherDataServiceImplement(IWeatherDataRepository repository, OpenMeteoClient openMeteoClient) {
        this.repository = repository;
        this.openMeteoClient = openMeteoClient;
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
    public List<WeatherData> simulateDays(BusinessEntity businessEntity, int days) {
        List<WeatherData> items = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 0; i < days; i++) {
            items.add(simulate(businessEntity, today.minusDays(i)));
        }
        return items;
    }

    private WeatherData simulate(BusinessEntity businessEntity, LocalDate date) {
        WeatherData weatherData = new WeatherData();
        weatherData.setDate(date);
        weatherData.setTemperature(randomValue(14.0, 30.0));
        weatherData.setHumidity(randomValue(60.0, 95.0));
        weatherData.setSource("SIMULATED");
        weatherData.setBusinessEntity(businessEntity);
        return repository.save(weatherData);
    }

    @Override
    public WeatherData syncCurrent(BusinessEntity businessEntity, double latitude, double longitude) {
        OpenMeteoClient.CurrentWeather current = openMeteoClient.fetchCurrent(latitude, longitude);
        LocalDate today = LocalDate.now();
        // Hay un solo registro por empresa y fecha (restriccion unica): si ya existe hoy, se actualiza.
        WeatherData weatherData = listByBusinessEntity(businessEntity.getIdBusinessEntity()).stream()
                .filter(item -> today.equals(item.getDate()))
                .findFirst()
                .orElse(new WeatherData());
        weatherData.setDate(today);
        weatherData.setTemperature(current.temperature());
        weatherData.setHumidity(current.humidity());
        weatherData.setSource(current.source());
        weatherData.setBusinessEntity(businessEntity);
        return repository.save(weatherData);
    }

    @Override
    public List<OpenMeteoClient.DailyForecast> forecast(double latitude, double longitude, int days) {
        String key = Math.round(latitude * 100) + "," + Math.round(longitude * 100) + "," + days;
        CachedForecast cached = forecastCache.get(key);
        if (cached != null && System.currentTimeMillis() - cached.savedAt() < FORECAST_CACHE_MILLIS) {
            return cached.days();
        }
        List<OpenMeteoClient.DailyForecast> result = openMeteoClient.fetchForecast(latitude, longitude, days);
        forecastCache.put(key, new CachedForecast(System.currentTimeMillis(), result));
        return result;
    }

    // Suma 1 punto si la humedad es 70% o mas, otro si es 80% o mas, otro si la temperatura media
    // esta entre 20 y 32 grados y otro si llueve 1 mm o mas. 3 o mas puntos es ALTO, 2 es MEDIO.
    @Override
    public String pestRisk(OpenMeteoClient.DailyForecast day) {
        double averageTemperature = (day.temperatureMax() + day.temperatureMin()) / 2;
        int points = 0;
        if (day.humidity() >= 70) points++;
        if (day.humidity() >= 80) points++;
        if (averageTemperature >= 20 && averageTemperature <= 32) points++;
        if (day.precipitation() >= 1) points++;
        if (points >= 3) return "ALTO";
        if (points == 2) return "MEDIO";
        return "BAJO";
    }

    private double randomValue(double min, double max) {
        double value = ThreadLocalRandom.current().nextDouble(min, max);
        return Math.round(value * 10.0) / 10.0;
    }
}