package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.CountDTO;
import pe.edu.upc.ecopest.dtos.InspeccionDTO;
import pe.edu.upc.ecopest.entities.Entidad;
import pe.edu.upc.ecopest.entities.Inspeccion;
import pe.edu.upc.ecopest.entities.Usuario;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IEntidadService;
import pe.edu.upc.ecopest.servicesinterfaces.IInspeccionService;
import pe.edu.upc.ecopest.servicesinterfaces.IUsuarioService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/inspecciones")
public class InspeccionController {
    private final IInspeccionService iS;
    private final IEntidadService eS;
    private final IUsuarioService uS;
    private final ModelMapper modelMapper;

    public InspeccionController(IInspeccionService iS, IEntidadService eS, IUsuarioService uS, ModelMapper modelMapper) {
        this.iS = iS; this.eS = eS; this.uS = uS; this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<InspeccionDTO>> listar() {
        List<InspeccionDTO> lista = iS.list()
                .stream().map(i -> modelMapper.map(i, InspeccionDTO.class)).toList();
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<InspeccionDTO> registrar(@Valid @RequestBody InspeccionDTO dto) {
        Entidad entidad = eS.listId(dto.getIdEntidad())
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra la entidad"));
        Usuario usuario = uS.listId(dto.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra el usuario"));
        Inspeccion inspeccion = modelMapper.map(dto, Inspeccion.class);
        inspeccion.setEntidad(entidad);
        inspeccion.setUsuario(usuario);
        iS.insert(inspeccion);
        InspeccionDTO responseDTO = modelMapper.map(inspeccion, InspeccionDTO.class);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(inspeccion.getIdInspeccion()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InspeccionDTO> buscarId(@PathVariable Long id) {
        Inspeccion i = iS.listId(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra la inspeccion"));
        return ResponseEntity.ok(modelMapper.map(i, InspeccionDTO.class));
    }

    @PutMapping
    public ResponseEntity<InspeccionDTO> actualizar(@Valid @RequestBody InspeccionDTO dto) {
        Inspeccion existente = iS.listId(dto.getIdInspeccion())
                .orElseThrow(() -> new ResourceNotFoundException("No existe la inspeccion con id: " + dto.getIdInspeccion()));
        existente.setEstadoInspeccion(dto.getEstadoInspeccion());
        existente.setObservacionesInspeccion(dto.getObservacionesInspeccion());
        existente.setFechaInspeccion(dto.getFechaInspeccion());
        iS.update(existente);
        return ResponseEntity.ok(modelMapper.map(existente, InspeccionDTO.class));
    }

    @GetMapping("/por-estado")
    public ResponseEntity<List<InspeccionDTO>> buscarPorEstado(@RequestParam String estado) {
        List<InspeccionDTO> lista = iS.listByEstado(estado)
                .stream().map(i -> modelMapper.map(i, InspeccionDTO.class)).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/cantidades")
    public ResponseEntity<List<CountDTO>> contar() {
        List<CountDTO> lista = iS.countInspeccionesPorEmpresa()
                .stream().map(item -> {
                    CountDTO dto = new CountDTO();
                    dto.setName((String) item[0]);
                    dto.setQuantity(((Number) item[1]).doubleValue());
                    return dto;
                }).toList();
        return ResponseEntity.ok(lista);
    }
}
