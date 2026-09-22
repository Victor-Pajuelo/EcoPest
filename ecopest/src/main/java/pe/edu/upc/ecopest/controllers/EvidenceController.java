package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.EvidenceDTO;
import pe.edu.upc.ecopest.entities.Evidence;
import pe.edu.upc.ecopest.entities.Incident;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IEvidenceService;
import pe.edu.upc.ecopest.servicesinterfaces.IIncidentService;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/evidence")
public class EvidenceController {
    private final IEvidenceService evidenceService;
    private final IIncidentService incidentService;
    private final ModelMapper modelMapper;

    public EvidenceController(IEvidenceService evidenceService, IIncidentService incidentService, ModelMapper modelMapper) {
        this.evidenceService = evidenceService; this.incidentService = incidentService; this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<EvidenceDTO>> list() {
        return ResponseEntity.ok(evidenceService.list().stream().map(item -> modelMapper.map(item, EvidenceDTO.class)).toList());
    }

    @PostMapping
    public ResponseEntity<EvidenceDTO> register(@Valid @RequestBody EvidenceDTO dto) {
        Incident incident = incidentService.findById(dto.getIncidentId()).orElseThrow(() -> new ResourceNotFoundException("Incident not found"));
        Evidence evidence = modelMapper.map(dto, Evidence.class);
        evidence.setIncident(incident);
        evidenceService.insert(evidence);
        EvidenceDTO responseDTO = modelMapper.map(evidence, EvidenceDTO.class);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(evidence.getIdEvidence()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvidenceDTO> findById(@PathVariable Long id) {
        Evidence evidence = evidenceService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Evidence not found"));
        return ResponseEntity.ok(modelMapper.map(evidence, EvidenceDTO.class));
    }

    @GetMapping("/by-incident")
    public ResponseEntity<List<EvidenceDTO>> findByIncident(@RequestParam Long incidentId) {
        return ResponseEntity.ok(evidenceService.listByIncident(incidentId).stream().map(item -> modelMapper.map(item, EvidenceDTO.class)).toList());
    }
}
