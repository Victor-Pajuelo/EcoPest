package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.BusinessEntityDTO;
import pe.edu.upc.ecopest.dtos.CountDTO;
import pe.edu.upc.ecopest.entities.BusinessEntity;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IBusinessEntityService;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/business-entities")
public class BusinessEntityController {
    private final IBusinessEntityService service;
    private final ModelMapper modelMapper;

    public BusinessEntityController(IBusinessEntityService service, ModelMapper modelMapper) {
        this.service = service;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<BusinessEntityDTO>> list() {
        List<BusinessEntityDTO> items = service.list().stream()
                .map(item -> modelMapper.map(item, BusinessEntityDTO.class)).toList();
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<BusinessEntityDTO> register(@Valid @RequestBody BusinessEntityDTO dto) {
        BusinessEntity businessEntity = modelMapper.map(dto, BusinessEntity.class);
        if (dto.getParentBusinessEntityId() != null) {
            BusinessEntity parent = service.findById(dto.getParentBusinessEntityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent business entity not found"));
            businessEntity.setParentBusinessEntity(parent);
            businessEntity.setCompanyName(parent.getCompanyName());
        } else {
            businessEntity.setCompanyName(dto.getName());
        }
        service.insert(businessEntity);
        BusinessEntityDTO responseDTO = modelMapper.map(businessEntity, BusinessEntityDTO.class);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(businessEntity.getIdBusinessEntity()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusinessEntityDTO> findById(@PathVariable Long id) {
        BusinessEntity businessEntity = service.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Business entity not found"));
        return ResponseEntity.ok(modelMapper.map(businessEntity, BusinessEntityDTO.class));
    }

    @PutMapping
    public ResponseEntity<BusinessEntityDTO> update(@Valid @RequestBody BusinessEntityDTO dto) {
        BusinessEntity existing = service.findById(dto.getIdBusinessEntity())
                .orElseThrow(() -> new ResourceNotFoundException("Business entity not found with id: " + dto.getIdBusinessEntity()));
        existing.setName(dto.getName());
        existing.setType(dto.getType());
        existing.setActive(dto.isActive());
        service.update(existing);
        return ResponseEntity.ok(modelMapper.map(existing, BusinessEntityDTO.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.findById(id).orElseThrow(() -> new ResourceNotFoundException("Business entity not found"));
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/types")
    public ResponseEntity<List<BusinessEntityDTO>> findByType(@RequestParam String type) {
        List<BusinessEntityDTO> items = service.listByType(type).stream()
                .map(item -> modelMapper.map(item, BusinessEntityDTO.class)).toList();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/counts")
    public ResponseEntity<List<CountDTO>> count() {
        List<CountDTO> items = service.countUsersByCompany().stream().map(item -> {
            CountDTO dto = new CountDTO();
            dto.setName((String) item[0]);
            dto.setQuantity(((Number) item[1]).doubleValue());
            return dto;
        }).toList();
        return ResponseEntity.ok(items);
    }
}
