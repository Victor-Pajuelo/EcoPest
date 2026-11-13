package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.clients.GeminiClient;
import pe.edu.upc.ecopest.entities.BusinessEntity;
import pe.edu.upc.ecopest.entities.Incident;
import pe.edu.upc.ecopest.entities.Recommendation;
import pe.edu.upc.ecopest.entities.WeatherData;
import pe.edu.upc.ecopest.repositories.IRecommendationRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IRecommendationService;
import pe.edu.upc.ecopest.servicesinterfaces.IWeatherDataService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RecommendationServiceImplement implements IRecommendationService {
    private final IRecommendationRepository repository;
    private final IWeatherDataService weatherDataService;
    private final GeminiClient geminiClient;

    public RecommendationServiceImplement(IRecommendationRepository repository, IWeatherDataService weatherDataService, GeminiClient geminiClient) {
        this.repository = repository;
        this.weatherDataService = weatherDataService;
        this.geminiClient = geminiClient;
    }

    @Override
    public void insert(Recommendation recommendation) {
        repository.save(recommendation);
    }

    @Override
    public List<Recommendation> list() {
        return repository.findAll();
    }

    @Override
    public List<Recommendation> listByIncident(Long incidentId) {
        return repository.findByIncident_IdIncident(incidentId);
    }

    @Override
    public Optional<Recommendation> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<Object[]> countRecommendationsByIncident() {
        return repository.countRecommendationsByIncident();
    }

    @Override
    public void update(Recommendation recommendation) {
        repository.save(recommendation);
    }

    @Override
    public Recommendation generateWithAI(Incident incident) {
        // 1. Armamos el texto que se le envia a la IA con los datos del incidente
        StringBuilder prompt = new StringBuilder();
        prompt.append("Incidente registrado: ").append(incident.getDescription()).append("\n");
        if (incident.getPestType() != null) {
            prompt.append("Plaga: ").append(incident.getPestType().getName())
                    .append(" (nivel de riesgo: ").append(incident.getPestType().getRiskLevel()).append(")\n");
            if (incident.getPestType().getDescription() != null) {
                prompt.append("Descripción de la plaga: ").append(incident.getPestType().getDescription()).append("\n");
            }
        }
        BusinessEntity businessEntity = incident.getInspection() == null ? null : incident.getInspection().getBusinessEntity();
        if (businessEntity != null) {
            prompt.append("Lugar: ").append(businessEntity.getName()).append(" (").append(businessEntity.getType()).append(")\n");
            List<WeatherData> weather = weatherDataService.listByBusinessEntity(businessEntity.getIdBusinessEntity());
            if (!weather.isEmpty()) {
                WeatherData last = weather.get(weather.size() - 1);
                prompt.append("Clima reciente: ").append(last.getTemperature()).append(" °C, humedad ")
                        .append(last.getHumidity()).append(" %\n");
            }
        }

        // 2. Le pedimos la recomendacion a la IA
        String system = "Eres un asistente experto en control integrado de plagas. Responde en español, "
                + "en un solo párrafo de máximo 600 caracteres, con acciones concretas, seguras y ordenadas por prioridad. "
                + "No inventes datos que no se te dieron.";
        String text = geminiClient.generate(system, prompt.toString());
        if (text.length() > 990) {
            text = text.substring(0, 987) + "...";
        }

        // 3. Guardamos la recomendacion con origen IA
        Recommendation recommendation = new Recommendation();
        recommendation.setDescription(text);
        recommendation.setOrigin("IA");
        recommendation.setStatus("PENDING");
        recommendation.setGenerationDate(LocalDateTime.now());
        recommendation.setIncident(incident);
        repository.save(recommendation);
        return recommendation;
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
