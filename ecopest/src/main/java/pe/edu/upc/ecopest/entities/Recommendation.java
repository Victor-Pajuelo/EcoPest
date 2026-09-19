package pe.edu.upc.ecopest.entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRecommendation;
    private String descriptionRecommendation;
    private String originRecommendation;
    private LocalDate dateRecommendation;
    private boolean statusRecommendation;

    @ManyToOne
    @JoinColumn(name = "idIncidencia")
    private Incidencia incidencia;

    @ManyToOne
    @JoinColumn(name = "idUsuario")
    private Usuario usuario;

    public Recommendation() {
    }

    public Recommendation(Long idRecommendation, String descriptionRecommendation, String originRecommendation, LocalDate dateRecommendation, boolean statusRecommendation, Incidencia incidencia, Usuario usuario) {
        this.idRecommendation = idRecommendation;
        this.descriptionRecommendation = descriptionRecommendation;
        this.originRecommendation = originRecommendation;
        this.dateRecommendation = dateRecommendation;
        this.statusRecommendation = statusRecommendation;
        this.incidencia = incidencia;
        this.usuario = usuario;
    }

    public Long getIdRecommendation() {
        return idRecommendation;
    }

    public void setIdRecommendation(Long idRecommendation) {
        this.idRecommendation = idRecommendation;
    }

    public String getDescriptionRecommendation() {
        return descriptionRecommendation;
    }

    public void setDescriptionRecommendation(String descriptionRecommendation) {
        this.descriptionRecommendation = descriptionRecommendation;
    }

    public String getOriginRecommendation() {
        return originRecommendation;
    }

    public void setOriginRecommendation(String originRecommendation) {
        this.originRecommendation = originRecommendation;
    }

    public LocalDate getDateRecommendation() {
        return dateRecommendation;
    }

    public void setDateRecommendation(LocalDate dateRecommendation) {
        this.dateRecommendation = dateRecommendation;
    }

    public boolean isStatusRecommendation() {
        return statusRecommendation;
    }

    public void setStatusRecommendation(boolean statusRecommendation) {
        this.statusRecommendation = statusRecommendation;
    }

    public Incidencia getIncidencia() {
        return incidencia;
    }

    public void setIncidencia(Incidencia incidencia) {
        this.incidencia = incidencia;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}

