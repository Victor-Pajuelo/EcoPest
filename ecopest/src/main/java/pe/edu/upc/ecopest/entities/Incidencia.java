package pe.edu.upc.ecopest.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "incidencias")
public class Incidencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idIncidencia;

    @Column(name = "fechaIncidencia", nullable = false)
    private LocalDate fechaIncidencia;

    @Column(name = "descripcionIncidencia", length = 300, nullable = false)
    private String descripcionIncidencia;

    @Column(name = "estadoIncidencia", length = 20, nullable = false)
    private String estadoIncidencia;

    @ManyToOne
    @JoinColumn(name = "idInspeccion")
    private Inspeccion inspeccion;

    @ManyToOne
    @JoinColumn(name = "idTipoPlaga")
    private TipoPlaga tipoPlaga;

    public Incidencia() {}

    public Long getIdIncidencia() { return idIncidencia; }
    public void setIdIncidencia(Long idIncidencia) { this.idIncidencia = idIncidencia; }
    public LocalDate getFechaIncidencia() { return fechaIncidencia; }
    public void setFechaIncidencia(LocalDate fechaIncidencia) { this.fechaIncidencia = fechaIncidencia; }
    public String getDescripcionIncidencia() { return descripcionIncidencia; }
    public void setDescripcionIncidencia(String descripcionIncidencia) { this.descripcionIncidencia = descripcionIncidencia; }
    public String getEstadoIncidencia() { return estadoIncidencia; }
    public void setEstadoIncidencia(String estadoIncidencia) { this.estadoIncidencia = estadoIncidencia; }
    public Inspeccion getInspeccion() { return inspeccion; }
    public void setInspeccion(Inspeccion inspeccion) { this.inspeccion = inspeccion; }
    public TipoPlaga getTipoPlaga() { return tipoPlaga; }
    public void setTipoPlaga(TipoPlaga tipoPlaga) { this.tipoPlaga = tipoPlaga; }
}
