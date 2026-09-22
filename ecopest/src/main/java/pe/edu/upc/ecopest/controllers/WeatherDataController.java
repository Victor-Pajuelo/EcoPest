package pe.edu.upc.ecopest.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "Listar registros climáticos", description = "Obtiene una lista general de todos los datos climáticos registrados.")
    @GetMapping
    public ResponseEntity<List<WeatherDataDTO>> list() {
        return ResponseEntity.ok(weatherDataService.list().stream().map(item -> modelMapper.map(item, WeatherDataDTO.class)).toList());
    }

    @Operation(summary = "Registrar datos climáticos", description = "Crea un nuevo registro de clima asociado a una entidad de negocio.")
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

    @Operation(summary = "Obtener datos climáticos por ID", description = "Retorna la información del clima de un registro específico según su ID.")
    @GetMapping("/{id}")
    public ResponseEntity<WeatherDataDTO> findById(@PathVariable Long id) {
        WeatherData weatherData = weatherDataService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Weather data not found"));
        return ResponseEntity.ok(modelMapper.map(weatherData, WeatherDataDTO.class));
    }

    @Operation(summary = "Filtrar datos climáticos por ID de empresa", description = "Obtiene los datos del clima asociados a una entidad de negocio.")
    @GetMapping("/by-business-entity")
    public ResponseEntity<List<WeatherDataDTO>> findByBusinessEntity(@RequestParam Long businessEntityId) {
        return ResponseEntity.ok(weatherDataService.listByBusinessEntity(businessEntityId).stream().map(item -> modelMapper.map(item, WeatherDataDTO.class)).toList());
    }

    // NUEVO: Método GET con JOIN explícito por Nombre de Plaga
    @Operation(summary = "Obtener datos climáticos por nombre de plaga (JOIN)", description = "Filtra registros climáticos consultando a través de las inspecciones e incidentes vinculados a una plaga específica.")
    @GetMapping("/by-pest")
    public ResponseEntity<List<WeatherDataDTO>> findWeatherByPestType(@RequestParam String pestName) {
        List<WeatherDataDTO> items = weatherDataService.findWeatherByPestType(pestName).stream()
                .map(item -> modelMapper.map(item, WeatherDataDTO.class))
                .toList();
        return ResponseEntity.ok(items);
    }

    // NUEVO: Método DELETE por Entidad de Negocio
    @Operation(summary = "Eliminar datos climáticos por ID de empresa", description = "Elimina de la base de datos todos los registros climáticos asociados a una entidad de negocio.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Registros climáticos eliminados correctamente")
    })
    @DeleteMapping("/by-business-entity/{id}")
    public ResponseEntity<Void> deleteByBusinessEntity(@PathVariable Long id) {
        weatherDataService.deleteByBusinessEntity(id);
        return ResponseEntity.noContent().build();
    }
}