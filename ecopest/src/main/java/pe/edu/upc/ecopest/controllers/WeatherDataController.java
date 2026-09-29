package pe.edu.upc.ecopest.controllers;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.AverageWeatherDTO;
import pe.edu.upc.ecopest.dtos.WeatherDataDTO;
import pe.edu.upc.ecopest.entities.BusinessEntity;
import pe.edu.upc.ecopest.entities.WeatherData;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IBusinessEntityService;
import pe.edu.upc.ecopest.servicesinterfaces.IWeatherDataService;
import java.net.URI;
import java.time.LocalDate;
import java.util.ArrayList;
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

    @Operation(summary = "Actualizar datos meteorológicos", description = "Actualiza temperatura, humedad, fecha, fuente o empresa de un registro existente.")
    @PutMapping
    public ResponseEntity<WeatherDataDTO> update(@Valid @RequestBody WeatherDataDTO dto) {
        WeatherData existing = weatherDataService.findById(dto.getIdWeatherData())
                .orElseThrow(() -> new ResourceNotFoundException("Weather data not found with id: " + dto.getIdWeatherData()));
        BusinessEntity businessEntity = businessEntityService.findById(dto.getBusinessEntityId())
                .orElseThrow(() -> new ResourceNotFoundException("Business entity not found"));
        existing.setDate(dto.getDate());
        existing.setTemperature(dto.getTemperature());
        existing.setHumidity(dto.getHumidity());
        existing.setSource(dto.getSource());
        existing.setBusinessEntity(businessEntity);
        weatherDataService.update(existing);
        return ResponseEntity.ok(modelMapper.map(existing, WeatherDataDTO.class));
    }

    @Operation(summary = "Eliminar datos meteorológicos", description = "Elimina un registro meteorológico según su ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        weatherDataService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Weather data not found"));
        weatherDataService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Simular datos meteorológicos", description = "Genera registros con temperatura y humedad aleatorias para una empresa, uno por día hacia atrás desde hoy.")
    @PostMapping("/simulate")
    public ResponseEntity<List<WeatherDataDTO>> simulate(@RequestParam Long businessEntityId,
                                                         @RequestParam(defaultValue = "1") int days) {
        if (days < 1 || days > 30) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Days must be between 1 and 30");
        }
        BusinessEntity businessEntity = businessEntityService.findById(businessEntityId)
                .orElseThrow(() -> new ResourceNotFoundException("Business entity not found"));
        List<WeatherDataDTO> items = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 0; i < days; i++) {
            WeatherData weatherData = weatherDataService.simulate(businessEntity, today.minusDays(i));
            items.add(modelMapper.map(weatherData, WeatherDataDTO.class));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(items);
    }

    @Operation(summary = "Filtrar datos meteorológicos por ID de empresa", description = "Obtiene la lista de registros meteorológicos pertenecientes a una entidad de negocio.")
    @GetMapping("/by-business-entity")
    public ResponseEntity<List<WeatherDataDTO>> findByBusinessEntity(@RequestParam Long businessEntityId) {
        return ResponseEntity.ok(weatherDataService.listByBusinessEntity(businessEntityId).stream().map(item -> modelMapper.map(item, WeatherDataDTO.class)).toList());
    }

    @Operation(summary = "Promedio de clima por empresa", description = "Calcula el promedio de temperatura y humedad agrupado por entidad de negocio, redondeado a 2 decimales.")
    @GetMapping("/averages")
    public ResponseEntity<List<AverageWeatherDTO>> averages() {
        List<AverageWeatherDTO> items = weatherDataService.averageWeatherByBusinessEntity().stream().map(item -> {
            AverageWeatherDTO dto = new AverageWeatherDTO();
            dto.setName((String) item[0]);
            dto.setAvgTemperature(item[1] == null ? 0.0 : round2(((Number) item[1]).doubleValue()));
            dto.setAvgHumidity(item[2] == null ? 0.0 : round2(((Number) item[2]).doubleValue()));
            return dto;
        }).toList();
        return ResponseEntity.ok(items);
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}