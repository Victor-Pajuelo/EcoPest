package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.CountDTO;
import pe.edu.upc.ecopest.dtos.EntidadDTO;
import pe.edu.upc.ecopest.entities.Entidad;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IEntidadService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/entidades")
public class EntidadController {
    private final IEntidadService eS;
    private final ModelMapper modelMapper;

    public EntidadController(IEntidadService eS, ModelMapper modelMapper) {
        this.eS = eS;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<EntidadDTO>> listar() {
        List<EntidadDTO> lista = eS.list()
                .stream()
                .map(e -> modelMapper.map(e, EntidadDTO.class))
                .toList();
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<EntidadDTO> registrar(@Valid @RequestBody EntidadDTO dto) {
        Entidad entidad = modelMapper.map(dto, Entidad.class);
        if (dto.getIdEntidadPadre() != null) {
            Entidad padre = eS.listId(dto.getIdEntidadPadre())
                    .orElseThrow(() -> new ResourceNotFoundException("No se encuentra la entidad padre"));
            entidad.setEntidadPadre(padre);
            entidad.setNombreEmpresa(padre.getNombreEmpresa());
        } else {
            entidad.setNombreEmpresa(dto.getNameEntidad());
        }
        eS.insert(entidad);
        EntidadDTO responseDTO = modelMapper.map(entidad, EntidadDTO.class);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(entidad.getIdEntidad()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntidadDTO> buscarId(@PathVariable Long id) {
        Entidad e = eS.listId(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra la entidad"));
        return ResponseEntity.ok(modelMapper.map(e, EntidadDTO.class));
    }

    @PutMapping
    public ResponseEntity<EntidadDTO> actualizar(@Valid @RequestBody EntidadDTO dto) {
        Entidad existente = eS.listId(dto.getIdEntidad())
                .orElseThrow(() -> new ResourceNotFoundException("No existe la entidad con id: " + dto.getIdEntidad()));
        existente.setNameEntidad(dto.getNameEntidad());
        existente.setTypeEntidad(dto.getTypeEntidad());
        existente.setStatusEntidad(dto.isStatusEntidad());
        eS.update(existente);
        return ResponseEntity.ok(modelMapper.map(existente, EntidadDTO.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        eS.listId(id).orElseThrow(() -> new ResourceNotFoundException("No se encuentra la entidad"));
        eS.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tipos")
    public ResponseEntity<List<EntidadDTO>> buscarPorTipo(@RequestParam String tipo) {
        List<EntidadDTO> lista = eS.listByTipo(tipo)
                .stream()
                .map(e -> modelMapper.map(e, EntidadDTO.class))
                .toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/cantidades")
    public ResponseEntity<List<CountDTO>> contar() {
        List<CountDTO> lista = eS.countUsuariosPorEmpresa()
                .stream()
                .map(item -> {
                    CountDTO dto = new CountDTO();
                    dto.setName((String) item[0]);
                    dto.setQuantity(((Number) item[1]).doubleValue());
                    return dto;
                }).toList();
        return ResponseEntity.ok(lista);
    }
}
