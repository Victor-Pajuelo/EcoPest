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
import pe.edu.upc.ecopest.dtos.InspectionDTO;
import pe.edu.upc.ecopest.entities.BusinessEntity;
import pe.edu.upc.ecopest.entities.Inspection;
import pe.edu.upc.ecopest.entities.User;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IBusinessEntityService;
import pe.edu.upc.ecopest.servicesinterfaces.IInspectionService;
import pe.edu.upc.ecopest.servicesinterfaces.IUserService;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/inspections")
public class InspectionController {

    private final IInspectionService inspectionService;
    private final IBusinessEntityService businessEntityService;
    private final IUserService userService;
    private final ModelMapper modelMapper;

    public InspectionController(IInspectionService inspectionService, IBusinessEntityService businessEntityService, IUserService userService, ModelMapper modelMapper) {
        this.inspectionService = inspectionService;
        this.businessEntityService = businessEntityService;
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @Operation(summary = "Listar inspecciones", description = "Obtiene una lista general de todas las inspecciones realizadas.")
    @GetMapping
    public ResponseEntity<List<InspectionDTO>> list() {
        return ResponseEntity.ok(inspectionService.list().stream().map(item -> modelMapper.map(item, InspectionDTO.class)).toList());
    }

    @Operation(summary = "Registrar inspección", description = "Crea una nueva inspección asociada a una entidad de negocio y un usuario asignado.")
    @PostMapping
    public ResponseEntity<InspectionDTO> register(@Valid @RequestBody InspectionDTO dto) {
        BusinessEntity businessEntity = businessEntityService.findById(dto.getBusinessEntityId())
                .orElseThrow(() -> new ResourceNotFoundException("Business entity not found"));
        User user = userService.findById(dto.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Inspection inspection = modelMapper.map(dto, Inspection.class);
        inspection.setBusinessEntity(businessEntity);
        inspection.setUser(user);
        inspectionService.insert(inspection);
        InspectionDTO responseDTO = modelMapper.map(inspection, InspectionDTO.class);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(inspection.getIdInspection()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @Operation(summary = "Obtener inspección por ID", description = "Retorna el detalle de una inspección específica según su ID.")
    @GetMapping("/{id}")
    public ResponseEntity<InspectionDTO> findById(@PathVariable Long id) {
        Inspection inspection = inspectionService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Inspection not found"));
        return ResponseEntity.ok(modelMapper.map(inspection, InspectionDTO.class));
    }

    @Operation(summary = "Actualizar inspección", description = "Actualiza el estado, observaciones y fecha de una inspección existente.")
    @PutMapping
    public ResponseEntity<InspectionDTO> update(@Valid @RequestBody InspectionDTO dto) {
        Inspection existing = inspectionService.findById(dto.getIdInspection())
                .orElseThrow(() -> new ResourceNotFoundException("Inspection not found with id: " + dto.getIdInspection()));
        existing.setStatus(dto.getStatus());
        existing.setObservations(dto.getObservations());
        existing.setInspectionDate(dto.getInspectionDate());
        inspectionService.update(existing);
        return ResponseEntity.ok(modelMapper.map(existing, InspectionDTO.class));
    }

    @Operation(summary = "Filtrar inspecciones por estado", description = "Obtiene la lista de inspecciones según su estado actual.")
    @GetMapping("/by-status")
    public ResponseEntity<List<InspectionDTO>> findByStatus(@RequestParam String status) {
        return ResponseEntity.ok(inspectionService.listByStatus(status).stream().map(item -> modelMapper.map(item, InspectionDTO.class)).toList());
    }

    @Operation(summary = "Conteo de inspecciones por empresa", description = "Agrupa y cuenta el total de inspecciones registradas por empresa.")
    @GetMapping("/counts")
    public ResponseEntity<List<CountDTO>> count() {
        List<CountDTO> items = inspectionService.countInspectionsByCompany().stream().map(item -> {
            CountDTO dto = new CountDTO();
            dto.setName((String) item[0]);
            dto.setQuantity(((Number) item[1]).doubleValue());
            return dto;
        }).toList();
        return ResponseEntity.ok(items);
    }

    @Operation(summary = "Obtener inspecciones con incidentes pendientes por empresa (JOIN)", description = "Realiza una consulta JPQL JOIN para obtener inspecciones vinculadas a incidentes según su estado y el nombre de la empresa.")
    @GetMapping("/pending-by-company")
    public ResponseEntity<List<InspectionDTO>> findWithPendingIncidentsByCompany(@RequestParam String incidentStatus, @RequestParam String companyName) {
        List<InspectionDTO> items = inspectionService.findWithPendingIncidentsByCompany(incidentStatus, companyName).stream()
                .map(item -> modelMapper.map(item, InspectionDTO.class))
                .toList();
        return ResponseEntity.ok(items);
    }

    @Operation(summary = "Eliminar inspecciones por estado", description = "Elimina de la base de datos todas las inspecciones filtradas por un estado específico.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Inspecciones eliminadas correctamente")
    })
    @DeleteMapping("/by-status")
    public ResponseEntity<Void> deleteByStatus(@RequestParam String status) {
        inspectionService.deleteByStatus(status);
        return ResponseEntity.noContent().build();
    }
}