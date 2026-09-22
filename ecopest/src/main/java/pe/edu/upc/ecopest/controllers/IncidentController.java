package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
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
        this.incidentService = incidentService; this.inspectionService = inspectionService; this.pestTypeService = pestTypeService; this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<IncidentDTO>> list() {
        return ResponseEntity.ok(incidentService.list().stream().map(item -> modelMapper.map(item, IncidentDTO.class)).toList());
    }

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
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(incident.getIdIncident()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentDTO> findById(@PathVariable Long id) {
        Incident incident = incidentService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Incident not found"));
        return ResponseEntity.ok(modelMapper.map(incident, IncidentDTO.class));
    }

    @GetMapping("/by-business-entity")
    public ResponseEntity<List<IncidentDTO>> findByBusinessEntity(@RequestParam Long businessEntityId) {
        return ResponseEntity.ok(incidentService.listByBusinessEntity(businessEntityId).stream().map(item -> modelMapper.map(item, IncidentDTO.class)).toList());
    }

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
