package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.CountDTO;
import pe.edu.upc.ecopest.dtos.IncidenciaDTO;
import pe.edu.upc.ecopest.entities.Incidencia;
import pe.edu.upc.ecopest.entities.Inspeccion;
import pe.edu.upc.ecopest.entities.TipoPlaga;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IIncidenciaService;
import pe.edu.upc.ecopest.servicesinterfaces.IInspeccionService;
import pe.edu.upc.ecopest.servicesinterfaces.ITipoPlagaService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/incidencias")
public class IncidenciaController {
    private final IIncidenciaService incS;
    private final IInspeccionService insS;
    private final ITipoPlagaService tS;
    private final ModelMapper modelMapper;

    public IncidenciaController(IIncidenciaService incS, IInspeccionService insS, ITipoPlagaService tS, ModelMapper modelMapper) {
        this.incS = incS; this.insS = insS; this.tS = tS; this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<IncidenciaDTO>> listar() {
        List<IncidenciaDTO> lista = incS.list()
                .stream().map(i -> modelMapper.map(i, IncidenciaDTO.class)).toList();
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<IncidenciaDTO> registrar(@Valid @RequestBody IncidenciaDTO dto) {
        Inspeccion inspeccion = insS.listId(dto.getIdInspeccion())
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra la inspeccion"));
        TipoPlaga tipoPlaga = tS.listId(dto.getIdTipoPlaga())
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra el tipo de plaga"));
        Incidencia incidencia = modelMapper.map(dto, Incidencia.class);
        incidencia.setInspeccion(inspeccion);
        incidencia.setTipoPlaga(tipoPlaga);
        incS.insert(incidencia);
        IncidenciaDTO responseDTO = modelMapper.map(incidencia, IncidenciaDTO.class);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(incidencia.getIdIncidencia()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidenciaDTO> buscarId(@PathVariable Long id) {
        Incidencia i = incS.listId(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra la incidencia"));
        return ResponseEntity.ok(modelMapper.map(i, IncidenciaDTO.class));
    }

    @GetMapping("/por-entidad")
    public ResponseEntity<List<IncidenciaDTO>> buscarPorEntidad(@RequestParam Long idEntidad) {
        List<IncidenciaDTO> lista = incS.listByEntidad(idEntidad)
                .stream().map(i -> modelMapper.map(i, IncidenciaDTO.class)).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/cantidades")
    public ResponseEntity<List<CountDTO>> contar() {
        List<CountDTO> lista = incS.countIncidenciasPorTipoPlaga()
                .stream().map(item -> {
                    CountDTO dto = new CountDTO();
                    dto.setName((String) item[0]);
                    dto.setQuantity(((Number) item[1]).doubleValue());
                    return dto;
                }).toList();
        return ResponseEntity.ok(lista);
    }
}
