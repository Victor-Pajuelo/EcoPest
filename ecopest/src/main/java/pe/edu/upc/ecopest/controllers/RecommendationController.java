package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.CountDTO;
import pe.edu.upc.ecopest.dtos.RecommendationDTO;
import pe.edu.upc.ecopest.entities.Incident;
import pe.edu.upc.ecopest.entities.Recommendation;
import pe.edu.upc.ecopest.entities.User;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IIncidentService;
import pe.edu.upc.ecopest.servicesinterfaces.IRecommendationService;
import pe.edu.upc.ecopest.servicesinterfaces.IUserService;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private final IRecommendationService recommendationService;
    private final IIncidentService incidentService;
    private final IUserService userService;
    private final ModelMapper modelMapper;

    public RecommendationController(IRecommendationService recommendationService, IIncidentService incidentService, IUserService userService, ModelMapper modelMapper) {
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
