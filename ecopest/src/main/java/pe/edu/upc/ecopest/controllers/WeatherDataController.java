package pe.edu.upc.ecopest.controllers;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.WeatherDataDTO;
import pe.edu.upc.ecopest.entities.BusinessEntity;
import pe.edu.upc.ecopest.entities.WeatherData;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IBusinessEntityService;
import pe.edu.upc.ecopest.servicesinterfaces.IWeatherDataService;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/weather-data")
public class WeatherDataController {
    private final IWeatherDataService weatherDataService;
    private final IBusinessEntityService businessEntityService;
    private final ModelMapper modelMapper;

    public WeatherDataController(IWeatherDataService weatherDataService, IBusinessEntityService businessEntityService, ModelMapper modelMapper) {
        this.weatherDataService = weatherDataService;
        this.businessEntityService = businessEntityService;
        this.modelMapper = modelMapper;
    }

    @Operation(summary = "Listar datos meteorológicos", description = "Obtiene una lista general de todos los registros meteorológicos.")
    @GetMapping
    public ResponseEntity<List<WeatherDataDTO>> list() {
        return ResponseEntity.ok(weatherDataService.list().stream().map(item -> modelMapper.map(item, WeatherDataDTO.class)).toList());
    }

    @Operation(summary = "Registrar datos meteorológicos", description = "Crea un nuevo registro meteorológico asociado a una entidad de negocio.")
    @PostMapping
    public ResponseEntity<WeatherDataDTO> register(@Valid @RequestBody WeatherDataDTO dto) {
        BusinessEntity businessEntity = businessEntityService.findById(dto.getBusinessEntityId())
                .orElseThrow(() -> new ResourceNotFoundException("Business entity not found"));
        WeatherData weatherData = modelMapper.map(dto, WeatherData.class);
        weatherData.setBusinessEntity(businessEntity);
        weatherDataService.insert(weatherData);
        WeatherDataDTO responseDTO = modelMapper.map(weatherData, WeatherDataDTO.class);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(weatherData.getIdWeatherData()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @Operation(summary = "Obtener datos meteorológicos por ID", description = "Retorna el detalle de un registro meteorológico según su ID.")
    @GetMapping("/{id}")
    public ResponseEntity<WeatherDataDTO> findById(@PathVariable Long id) {
        WeatherData weatherData = weatherDataService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Weather data not found"));
        return ResponseEntity.ok(modelMapper.map(weatherData, WeatherDataDTO.class));
    }

    @Operation(summary = "Filtrar datos meteorológicos por ID de empresa", description = "Obtiene la lista de registros meteorológicos pertenecientes a una entidad de negocio.")
    @GetMapping("/by-business-entity")
    public ResponseEntity<List<WeatherDataDTO>> findByBusinessEntity(@RequestParam Long businessEntityId) {
        return ResponseEntity.ok(weatherDataService.listByBusinessEntity(businessEntityId).stream().map(item -> modelMapper.map(item, WeatherDataDTO.class)).toList());
    }
}