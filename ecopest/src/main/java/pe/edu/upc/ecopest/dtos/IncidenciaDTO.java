package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class IncidenciaDTO {
    private Long idIncidencia;
    @NotNull(message = "La fecha de incidencia es obligatoria")
    private LocalDate fechaIncidencia;
    @NotBlank(message = "La descripcion es obligatoria")
    private String descripcionIncidencia;
    @NotBlank(message = "El estado es obligatorio")
    private String estadoIncidencia;
    @NotNull(message = "El id de la inspeccion es obligatorio")
    private Long idInspeccion;
    @NotNull(message = "El id del tipo de plaga es obligatorio")
    private Long idTipoPlaga;

    public Long getIdIncidencia() { return idIncidencia; }
    public void setIdIncidencia(Long idIncidencia) { this.idIncidencia = idIncidencia; }
    public LocalDate getFechaIncidencia() { return fechaIncidencia; }
    public void setFechaIncidencia(LocalDate fechaIncidencia) { this.fechaIncidencia = fechaIncidencia; }
    public String getDescripcionIncidencia() { return descripcionIncidencia; }
    public void setDescripcionIncidencia(String descripcionIncidencia) { this.descripcionIncidencia = descripcionIncidencia; }
    public String getEstadoIncidencia() { return estadoIncidencia; }
    public void setEstadoIncidencia(String estadoIncidencia) { this.estadoIncidencia = estadoIncidencia; }
    public Long getIdInspeccion() { return idInspeccion; }
    public void setIdInspeccion(Long idInspeccion) { this.idInspeccion = idInspeccion; }
    public Long getIdTipoPlaga() { return idTipoPlaga; }
    public void setIdTipoPlaga(Long idTipoPlaga) { this.idTipoPlaga = idTipoPlaga; }
}
