package pe.edu.upc.ecopest.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
        this.incidentService = incidentService;
        this.inspectionService = inspectionService;
        this.pestTypeService = pestTypeService;
        this.modelMapper = modelMapper;
    }

    @Operation(summary = "Listar incidentes", description = "Obtiene una lista general de todos los incidentes registrados.")
    @GetMapping
    public ResponseEntity<List<IncidentDTO>> list() {
        return ResponseEntity.ok(incidentService.list().stream().map(item -> modelMapper.map(item, IncidentDTO.class)).toList());
    }

    @Operation(summary = "Registrar un incidente", description = "Crea un nuevo incidente vinculado a una inspeccion y un tipo de plaga.")
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

    @Operation(summary = "Obtener incidente por ID", description = "Retorna el detalle de un incidente segun su ID.")
    @GetMapping("/{id}")
    public ResponseEntity<IncidentDTO> findById(@PathVariable Long id) {
        Incident incident = incidentService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Incident not found"));
        return ResponseEntity.ok(modelMapper.map(incident, IncidentDTO.class));
    }

    @Operation(summary = "Actualizar incidente", description = "Actualiza la fecha, descripcion, estado, inspeccion y tipo de plaga de un incidente existente.")
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

    @Operation(summary = "Eliminar incidente por ID", description = "Elimina un incidente especifico de la base de datos.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        incidentService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Incident not found"));
        incidentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Filtrar incidentes por ID de empresa", description = "Obtiene la lista de incidentes pertenecientes a una entidad de negocio.")
    @GetMapping("/by-business-entity")
    public ResponseEntity<List<IncidentDTO>> findByBusinessEntity(@RequestParam Long businessEntityId) {
        return ResponseEntity.ok(incidentService.listByBusinessEntity(businessEntityId).stream().map(item -> modelMapper.map(item, IncidentDTO.class)).toList());
    }

    @Operation(summary = "Conteo de incidentes por plaga", description = "Agrupa y cuenta el total de incidentes reportados segun el tipo de plaga.")
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

    @Operation(summary = "Conteo de incidentes por nivel de riesgo", description = "Agrupa y cuenta el total de incidentes reportados segun el nivel de riesgo del tipo de plaga.")
    @GetMapping("/counts-by-risk-level")
    public ResponseEntity<List<CountDTO>> countByRiskLevel() {
        List<CountDTO> items = incidentService.countIncidentsByRiskLevel().stream().map(item -> {
            CountDTO dto = new CountDTO();
            dto.setName((String) item[0]);
            dto.setQuantity(((Number) item[1]).doubleValue());
            return dto;
        }).toList();
        return ResponseEntity.ok(items);
    }

    @Operation(summary = "Obtener incidentes por plaga y empresa (JOIN)", description = "Realiza una consulta avanzada con JOIN filtrando por nombre de plaga y nombre de empresa.")
    @GetMapping("/by-pest-and-company")
    public ResponseEntity<List<IncidentDTO>> findByPestNameAndCompany(@RequestParam String pestName, @RequestParam String companyName) {
        List<IncidentDTO> items = incidentService.findByPestNameAndCompany(pestName, companyName).stream()
                .map(item -> modelMapper.map(item, IncidentDTO.class))
                .toList();
        return ResponseEntity.ok(items);
    }

    @Operation(summary = "Eliminar incidentes por ID de empresa", description = "Elimina de la base de datos todos los incidentes asociados a una entidad de negocio.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Incidentes eliminados correctamente")
    })
    @DeleteMapping("/by-business-entity/{id}")
    public ResponseEntity<Void> deleteByBusinessEntity(@PathVariable Long id) {
        incidentService.deleteByBusinessEntity(id);
        return ResponseEntity.noContent().build();
    }
}
