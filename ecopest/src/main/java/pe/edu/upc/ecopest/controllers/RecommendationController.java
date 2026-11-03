package pe.edu.upc.ecopest.controllers;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.clients.GeminiClient;
import pe.edu.upc.ecopest.dtos.CountDTO;
import pe.edu.upc.ecopest.dtos.RecommendationDTO;
import pe.edu.upc.ecopest.entities.BusinessEntity;
import pe.edu.upc.ecopest.entities.Incident;
import pe.edu.upc.ecopest.entities.Recommendation;
import pe.edu.upc.ecopest.entities.User;
import pe.edu.upc.ecopest.entities.WeatherData;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IIncidentService;
import pe.edu.upc.ecopest.servicesinterfaces.IRecommendationService;
import pe.edu.upc.ecopest.servicesinterfaces.IUserService;
import pe.edu.upc.ecopest.servicesinterfaces.IWeatherDataService;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private final IRecommendationService recommendationService;
    private final IIncidentService incidentService;
    private final IUserService userService;
    private final ModelMapper modelMapper;
    private final IWeatherDataService weatherDataService;
    private final GeminiClient geminiClient;

    public RecommendationController(IRecommendationService recommendationService, IIncidentService incidentService, IUserService userService, ModelMapper modelMapper, IWeatherDataService weatherDataService, GeminiClient geminiClient) {
        this.weatherDataService = weatherDataService; this.geminiClient = geminiClient;
        this.recommendationService = recommendationService; this.incidentService = incidentService; this.userService = userService; this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<RecommendationDTO>> list() {
        return ResponseEntity.ok(recommendationService.list().stream().map(item -> modelMapper.map(item, RecommendationDTO.class)).toList());
    }

    @PostMapping
    public ResponseEntity<RecommendationDTO> register(@Valid @RequestBody RecommendationDTO dto) {
        Incident incident = incidentService.findById(dto.getIncidentId()).orElseThrow(() -> new ResourceNotFoundException("Incident not found"));
        Recommendation recommendation = modelMapper.map(dto, Recommendation.class);
        recommendation.setIncident(incident);
        if (dto.getResponsibleUserId() != null) {
            User responsibleUser = userService.findById(dto.getResponsibleUserId()).orElseThrow(() -> new ResourceNotFoundException("Responsible user not found"));
            recommendation.setResponsibleUser(responsibleUser);
        }
        recommendationService.insert(recommendation);
        RecommendationDTO responseDTO = modelMapper.map(recommendation, RecommendationDTO.class);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(recommendation.getIdRecommendation()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecommendationDTO> findById(@PathVariable Long id) {
        Recommendation recommendation = recommendationService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Recommendation not found"));
        return ResponseEntity.ok(modelMapper.map(recommendation, RecommendationDTO.class));
    }

    @Operation(summary = "Generar recomendación con IA", description = "Toma la incidencia (plaga, riesgo, descripción) y el último clima de la empresa, se los envía a la IA (Gemini) y guarda la recomendación resultante con origin IA.")
    @PostMapping("/generate")
    public ResponseEntity<RecommendationDTO> generate(@RequestParam Long incidentId) {
        Incident incident = incidentService.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

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
        String system = "Eres un asistente experto en control integrado de plagas. Responde en español, "
                + "en un solo párrafo de máximo 600 caracteres, con acciones concretas, seguras y ordenadas por prioridad. "
                + "No inventes datos que no se te dieron.";
        String text = geminiClient.generate(system, prompt.toString());
        if (text.length() > 990) {
            text = text.substring(0, 987) + "...";
        }

        Recommendation recommendation = new Recommendation();
        recommendation.setDescription(text);
        recommendation.setOrigin("IA");
        recommendation.setStatus("PENDING");
        recommendation.setGenerationDate(LocalDateTime.now());
        recommendation.setIncident(incident);
        recommendationService.insert(recommendation);
        return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(recommendation, RecommendationDTO.class));
    }

    @GetMapping("/by-incident")
    public ResponseEntity<List<RecommendationDTO>> findByIncident(@RequestParam Long incidentId) {
        return ResponseEntity.ok(recommendationService.listByIncident(incidentId).stream().map(item -> modelMapper.map(item, RecommendationDTO.class)).toList());
    }

    @GetMapping("/counts")
    public ResponseEntity<List<CountDTO>> count() {
        List<CountDTO> items = recommendationService.countRecommendationsByIncident().stream().map(item -> {
            CountDTO dto = new CountDTO();
            dto.setName((String) item[0]);
            dto.setQuantity(((Number) item[1]).doubleValue());
            return dto;
        }).toList();
        return ResponseEntity.ok(items);
    }
    @PutMapping
    public ResponseEntity<RecommendationDTO> update(@Valid @RequestBody RecommendationDTO dto) {
        Recommendation existing = recommendationService.findById(dto.getIdRecommendation())
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found with id: " + dto.getIdRecommendation()));
        Incident incident = incidentService.findById(dto.getIncidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));
        existing.setDescription(dto.getDescription());
        existing.setOrigin(dto.getOrigin());
        existing.setStatus(dto.getStatus());
        existing.setIncident(incident);
        if (dto.getResponsibleUserId() != null) {
            User responsibleUser = userService.findById(dto.getResponsibleUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Responsible user not found"));
            existing.setResponsibleUser(responsibleUser);
        } else {
            existing.setResponsibleUser(null);
        }
        recommendationService.update(existing);
        return ResponseEntity.ok(modelMapper.map(existing, RecommendationDTO.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        recommendationService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found"));
        recommendationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
