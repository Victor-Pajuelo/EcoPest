package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import io.swagger.v3.oas.annotations.Operation;
import pe.edu.upc.ecopest.clients.INaturalistClient;
import pe.edu.upc.ecopest.dtos.SpeciesDTO;
import pe.edu.upc.ecopest.dtos.PestIdentifyRequestDTO;
import pe.edu.upc.ecopest.dtos.PestIdentifyResponseDTO;
import pe.edu.upc.ecopest.dtos.PestTypeDTO;
import pe.edu.upc.ecopest.entities.PestType;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IPestIdentifyService;
import pe.edu.upc.ecopest.servicesinterfaces.IPestTypeService;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/pest-types")
public class PestTypeController {
    private final IPestTypeService service;
    private final ModelMapper modelMapper;
    private final IPestIdentifyService identifyService;
    private final INaturalistClient iNaturalistClient;

    public PestTypeController(IPestTypeService service, ModelMapper modelMapper, IPestIdentifyService identifyService, INaturalistClient iNaturalistClient) {
        this.service = service;
        this.modelMapper = modelMapper;
        this.identifyService = identifyService;
        this.iNaturalistClient = iNaturalistClient;
    }

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

    @Operation(summary = "Buscar especies (iNaturalist)", description = "Consulta la API externa iNaturalist por nombre comun o cientifico y devuelve hasta 8 especies con su foto y enlace a Wikipedia.")
    @GetMapping("/species")
    public ResponseEntity<List<SpeciesDTO>> searchSpecies(@RequestParam String q) {
        if (q.trim().length() < 3) {
            throw new IllegalArgumentException("The search must have at least 3 characters");
        }
        List<SpeciesDTO> items = iNaturalistClient.search(q.trim()).stream().map(taxon -> {
            SpeciesDTO dto = new SpeciesDTO();
            dto.setId(taxon.id());
            dto.setScientificName(taxon.scientificName());
            dto.setCommonName(taxon.commonName());
            dto.setRank(taxon.rank());
            dto.setPhotoUrl(taxon.photoUrl());
            dto.setWikipediaUrl(taxon.wikipediaUrl());
            return dto;
        }).toList();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PestTypeDTO> findById(@PathVariable Long id) {
        PestType pestType = service.findById(id).orElseThrow(() -> new ResourceNotFoundException("Pest type not found"));
        return ResponseEntity.ok(modelMapper.map(pestType, PestTypeDTO.class));
    }

    @PutMapping
    public ResponseEntity<PestTypeDTO> update(@Valid @RequestBody PestTypeDTO dto) {
        PestType existing = service.findById(dto.getIdPestType())
                .orElseThrow(() -> new ResourceNotFoundException("Pest type not found with id: " + dto.getIdPestType()));
        existing.setName(dto.getName());
        existing.setRiskLevel(dto.getRiskLevel());
        existing.setDescription(dto.getDescription());
        service.update(existing);
        return ResponseEntity.ok(modelMapper.map(existing, PestTypeDTO.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.findById(id).orElseThrow(() -> new ResourceNotFoundException("Pest type not found"));
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-risk")
    public ResponseEntity<List<PestTypeDTO>> findByRisk(@RequestParam String riskLevel) {
        return ResponseEntity.ok(service.listByRiskLevel(riskLevel).stream().map(item -> modelMapper.map(item, PestTypeDTO.class)).toList());
    }

    @PostMapping("/identify")
    public ResponseEntity<PestIdentifyResponseDTO> identify(@Valid @RequestBody PestIdentifyRequestDTO request) {
        return ResponseEntity.ok(new PestIdentifyResponseDTO(identifyService.identify(request)));
    }
}
