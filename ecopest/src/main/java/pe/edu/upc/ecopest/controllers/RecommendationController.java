package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
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
}
