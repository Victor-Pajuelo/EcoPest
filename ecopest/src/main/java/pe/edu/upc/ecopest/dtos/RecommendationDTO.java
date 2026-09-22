package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class RecommendationDTO {
    private Long idRecommendation;
    @NotBlank(message = "The recommendation description is required")
    private String description;
    @NotBlank(message = "The recommendation origin is required")
    private String origin;
    private LocalDateTime generationDate;
    @NotBlank(message = "The recommendation status is required")
    private String status;
    @NotNull(message = "The incident id is required")
    private Long incidentId;
    private Long responsibleUserId;

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
    public Long getIncidentId() { return incidentId; }
    public void setIncidentId(Long incidentId) { this.incidentId = incidentId; }
    public Long getResponsibleUserId() { return responsibleUserId; }
    public void setResponsibleUserId(Long responsibleUserId) { this.responsibleUserId = responsibleUserId; }
}
