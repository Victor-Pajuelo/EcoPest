package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.CountDTO;
import pe.edu.upc.ecopest.dtos.IncidentDTO;
import pe.edu.upc.ecopest.entities.Incident;
import pe.edu.upc.ecopest.entities.Inspection;
import pe.edu.upc.ecopest.entities.PestType;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IIncidentService;
import pe.edu.upc.ecopest.servicesinterfaces.IInspectionService;
import pe.edu.upc.ecopest.servicesinterfaces.IPestTypeService;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {
    private final IIncidentService incidentService;
    private final IInspectionService inspectionService;
    private final IPestTypeService pestTypeService;
    private final ModelMapper modelMapper;

    public IncidentController(IIncidentService incidentService, IInspectionService inspectionService, IPestTypeService pestTypeService, ModelMapper modelMapper) {
        this.incidentService = incidentService;
        this.inspectionService = inspectionService;
        this.pestTypeService = pestTypeService;
        this.modelMapper = modelMapper;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    @GetMapping
    public ResponseEntity<List<IncidentDTO>> list() {
        return ResponseEntity.ok(incidentService.list().stream()
                .map(item -> modelMapper.map(item, IncidentDTO.class)).toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<IncidentDTO> register(@Valid @RequestBody IncidentDTO dto) {
        Inspection inspection = inspectionService.findById(dto.getInspectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Inspection not found"));
        PestType pestType = pestTypeService.findById(dto.getPestTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Pest type not found"));
        Incident incident = modelMapper.map(dto, Incident.class);
        incident.setInspection(inspection);
        incident.setPestType(pestType);
        incidentService.insert(incident);
        IncidentDTO responseDTO = modelMapper.map(incident, IncidentDTO.class);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(incident.getIdIncident()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    @GetMapping("/{id}")
    public ResponseEntity<IncidentDTO> findById(@PathVariable Long id) {
        Incident incident = incidentService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));
        return ResponseEntity.ok(modelMapper.map(incident, IncidentDTO.class));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping
    public ResponseEntity<IncidentDTO> update(@Valid @RequestBody IncidentDTO dto) {
        Incident existing = incidentService.findById(dto.getIdIncident())
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + dto.getIdIncident()));
        Inspection inspection = inspectionService.findById(dto.getInspectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Inspection not found"));
        PestType pestType = pestTypeService.findById(dto.getPestTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Pest type not found"));
        existing.setIncidentDate(dto.getIncidentDate());
        existing.setDescription(dto.getDescription());
        existing.setStatus(dto.getStatus());
        existing.setInspection(inspection);
        existing.setPestType(pestType);
        incidentService.update(existing);
        return ResponseEntity.ok(modelMapper.map(existing, IncidentDTO.class));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        incidentService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));
        incidentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    @GetMapping("/by-business-entity")
    public ResponseEntity<List<IncidentDTO>> findByBusinessEntity(@RequestParam Long businessEntityId) {
        return ResponseEntity.ok(incidentService.listByBusinessEntity(businessEntityId).stream()
                .map(item -> modelMapper.map(item, IncidentDTO.class)).toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    @GetMapping("/counts")
    public ResponseEntity<List<CountDTO>> count() {
        List<CountDTO> items = incidentService.countIncidentsByPestType().stream().map(item -> {
            CountDTO dto = new CountDTO();
            dto.setName((String) item[0]);
            dto.setQuantity(((Number) item[1]).doubleValue());
            return dto;
        }).toList();
        return ResponseEntity.ok(items);
    }
}