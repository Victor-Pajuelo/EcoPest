package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class InspeccionDTO {
    private Long idInspeccion;
    @NotNull(message = "La fecha de inspeccion es obligatoria")
    private LocalDate fechaInspeccion;
    @NotBlank(message = "El estado de la inspeccion es obligatorio")
    private String estadoInspeccion;
    @NotBlank(message = "Las observaciones son obligatorias")
    private String observacionesInspeccion;
    @NotNull(message = "El id de la entidad es obligatorio")
    private Long idEntidad;
    @NotNull(message = "El id del usuario es obligatorio")
    private Long idUsuario;

    public Long getIdInspeccion() { return idInspeccion; }
    public void setIdInspeccion(Long idInspeccion) { this.idInspeccion = idInspeccion; }
    public LocalDate getFechaInspeccion() { return fechaInspeccion; }
    public void setFechaInspeccion(LocalDate fechaInspeccion) { this.fechaInspeccion = fechaInspeccion; }
    public String getEstadoInspeccion() { return estadoInspeccion; }
    public void setEstadoInspeccion(String estadoInspeccion) { this.estadoInspeccion = estadoInspeccion; }
    public String getObservacionesInspeccion() { return observacionesInspeccion; }
    public void setObservacionesInspeccion(String observacionesInspeccion) { this.observacionesInspeccion = observacionesInspeccion; }
    public Long getIdEntidad() { return idEntidad; }
    public void setIdEntidad(Long idEntidad) { this.idEntidad = idEntidad; }
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
}
