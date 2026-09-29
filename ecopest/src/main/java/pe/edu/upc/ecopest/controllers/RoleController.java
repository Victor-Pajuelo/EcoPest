package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.RoleDTO;
import pe.edu.upc.ecopest.dtos.RoleInsertDTO;
import pe.edu.upc.ecopest.entities.Role;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IRoleService;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    private final IRoleService service;
    private final ModelMapper modelMapper;
    public RoleController(IRoleService service, ModelMapper modelMapper) { this.service = service; this.modelMapper = modelMapper; }

    @GetMapping
    public ResponseEntity<List<RoleDTO>> list() {
        return ResponseEntity.ok(service.list().stream().map(item -> modelMapper.map(item, RoleDTO.class)).toList());
    }

    @PostMapping
    public ResponseEntity<RoleDTO> register(@Valid @RequestBody RoleInsertDTO dto) {
        Role role = modelMapper.map(dto, Role.class);
        service.insert(role);
        RoleDTO responseDTO = modelMapper.map(role, RoleDTO.class);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(role.getIdRole()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleDTO> findById(@PathVariable Long id) {
        Role role = service.findById(id).orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        return ResponseEntity.ok(modelMapper.map(role, RoleDTO.class));
    }

    @PutMapping
    public ResponseEntity<RoleDTO> update(@Valid @RequestBody RoleInsertDTO dto) {
        Role existing = service.findById(dto.getIdRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + dto.getIdRole()));
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setActive(dto.isActive());
        service.update(existing);
        return ResponseEntity.ok(modelMapper.map(existing, RoleDTO.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.findById(id).orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status")
    public ResponseEntity<List<RoleDTO>> findByStatus(@RequestParam boolean active) {
        return ResponseEntity.ok(service.listByActive(active).stream().map(item -> modelMapper.map(item, RoleDTO.class)).toList());
    }
}
