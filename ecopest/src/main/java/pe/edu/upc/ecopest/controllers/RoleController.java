package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.RoleDTO;
import pe.edu.upc.ecopest.dtos.RoleInsertDTO;
import pe.edu.upc.ecopest.entities.Role;
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

    @GetMapping("/status")
    public ResponseEntity<List<RoleDTO>> findByStatus(@RequestParam boolean active) {
        return ResponseEntity.ok(service.listByActive(active).stream().map(item -> modelMapper.map(item, RoleDTO.class)).toList());
    }
}
