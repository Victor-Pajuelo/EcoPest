package pe.edu.upc.ecopest.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_recommendation")
    private Long idRecommendation;

    @Column(name = "description", length = 1000, nullable = false)
    private String description;

    @Column(name = "origin", length = 20, nullable = false)
    private String origin;

    @Column(name = "generation_date", nullable = false)
    private LocalDateTime generationDate;

    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "id_incident", nullable = false)
    private Incident incident;

    @ManyToOne
    @JoinColumn(name = "id_responsible_user")
    private User responsibleUser;

    public Recommendation() {}

    @PrePersist
    public void prePersist() {
        if (generationDate == null) generationDate = LocalDateTime.now();
    }

    public Long getIdRecommendation() { return idRecommendation; }
    public void setIdRecommendation(Long idRecommendation) { this.idRecommendation = idRecommendation; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public LocalDateTime getGenerationDate() { return generationDate; }
    public void setGenerationDate(LocalDateTime generationDate) { this.generationDate = generationDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Incident getIncident() { return incident; }
    public void setIncident(Incident incident) { this.incident = incident; }
    public User getResponsibleUser() { return responsibleUser; }
    public void setResponsibleUser(User responsibleUser) { this.responsibleUser = responsibleUser; }
}
