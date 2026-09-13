package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.RolDTO;
import pe.edu.upc.ecopest.dtos.RolInsertDTO;
import pe.edu.upc.ecopest.entities.Rol;
import pe.edu.upc.ecopest.servicesinterfaces.IRolService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {
    private final IRolService rS;
    private final ModelMapper modelMapper;

    public RolController(IRolService rS, ModelMapper modelMapper) {
        this.rS = rS;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<RolDTO>> listar() {
        List<RolDTO> lista = rS.list()
                .stream()
                .map(r -> modelMapper.map(r, RolDTO.class))
                .toList();
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<RolInsertDTO> registrar(@Valid @RequestBody RolInsertDTO dto) {
        Rol rol = modelMapper.map(dto, Rol.class);
        rS.insert(rol);
        RolInsertDTO responseDTO = modelMapper.map(rol, RolInsertDTO.class);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(rol.getIdRol()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping("/estados")
    public ResponseEntity<List<RolDTO>> buscarPorEstado(@RequestParam boolean s) {
        List<RolDTO> lista = rS.listByStatus(s)
                .stream()
                .map(r -> modelMapper.map(r, RolDTO.class))
                .toList();
        return ResponseEntity.ok(lista);
    }
}
