package pe.edu.upc.ecopest.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "inspecciones")
public class Inspeccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInspeccion;

    @Column(name = "fechaInspeccion", nullable = false)
    private LocalDate fechaInspeccion;

    @Column(name = "estadoInspeccion", length = 20, nullable = false)
    private String estadoInspeccion;

    @Column(name = "observacionesInspeccion", length = 300, nullable = false)
    private String observacionesInspeccion;

    @ManyToOne
    @JoinColumn(name = "idEntidad")
    private Entidad entidad;

    @ManyToOne
    @JoinColumn(name = "idUsuario")
    private Usuario usuario;

    public Inspeccion() {}

    public Long getIdInspeccion() { return idInspeccion; }
    public void setIdInspeccion(Long idInspeccion) { this.idInspeccion = idInspeccion; }
    public LocalDate getFechaInspeccion() { return fechaInspeccion; }
    public void setFechaInspeccion(LocalDate fechaInspeccion) { this.fechaInspeccion = fechaInspeccion; }
    public String getEstadoInspeccion() { return estadoInspeccion; }
    public void setEstadoInspeccion(String estadoInspeccion) { this.estadoInspeccion = estadoInspeccion; }
    public String getObservacionesInspeccion() { return observacionesInspeccion; }
    public void setObservacionesInspeccion(String observacionesInspeccion) { this.observacionesInspeccion = observacionesInspeccion; }
    public Entidad getEntidad() { return entidad; }
    public void setEntidad(Entidad entidad) { this.entidad = entidad; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
