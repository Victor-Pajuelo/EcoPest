package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.PestTypeDTO;
import pe.edu.upc.ecopest.entities.PestType;
import pe.edu.upc.ecopest.servicesinterfaces.IPestTypeService;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/pest-types")
public class PestTypeController {
    private final IPestTypeService service;
    private final ModelMapper modelMapper;
    public PestTypeController(IPestTypeService service, ModelMapper modelMapper) { this.service = service; this.modelMapper = modelMapper; }

    @GetMapping
    public ResponseEntity<List<PestTypeDTO>> list() {
        return ResponseEntity.ok(service.list().stream().map(item -> modelMapper.map(item, PestTypeDTO.class)).toList());
    }

    @PostMapping
    public ResponseEntity<PestTypeDTO> register(@Valid @RequestBody PestTypeDTO dto) {
        PestType pestType = modelMapper.map(dto, PestType.class);
        service.insert(pestType);
        PestTypeDTO responseDTO = modelMapper.map(pestType, PestTypeDTO.class);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(pestType.getIdPestType()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping("/by-risk")
    public ResponseEntity<List<PestTypeDTO>> findByRisk(@RequestParam String riskLevel) {
        return ResponseEntity.ok(service.listByRiskLevel(riskLevel).stream().map(item -> modelMapper.map(item, PestTypeDTO.class)).toList());
    }
}
