package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.TipoPlagaDTO;
import pe.edu.upc.ecopest.entities.TipoPlaga;
import pe.edu.upc.ecopest.servicesinterfaces.ITipoPlagaService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/tipos-plaga")
public class TipoPlagaController {
    private final ITipoPlagaService tS;
    private final ModelMapper modelMapper;

    public TipoPlagaController(ITipoPlagaService tS, ModelMapper modelMapper) {
        this.tS = tS; this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<TipoPlagaDTO>> listar() {
        List<TipoPlagaDTO> lista = tS.list()
                .stream().map(t -> modelMapper.map(t, TipoPlagaDTO.class)).toList();
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<TipoPlagaDTO> registrar(@Valid @RequestBody TipoPlagaDTO dto) {
        TipoPlaga tp = modelMapper.map(dto, TipoPlaga.class);
        tS.insert(tp);
        TipoPlagaDTO responseDTO = modelMapper.map(tp, TipoPlagaDTO.class);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(tp.getIdTipoPlaga()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping("/por-riesgo")
    public ResponseEntity<List<TipoPlagaDTO>> buscarPorRiesgo(@RequestParam String nivel) {
        List<TipoPlagaDTO> lista = tS.listByNivelRiesgo(nivel)
                .stream().map(t -> modelMapper.map(t, TipoPlagaDTO.class)).toList();
        return ResponseEntity.ok(lista);
    }
}
