package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class IncidentDTO {
    private Long idIncident;
    @NotNull(message = "The incident date is required")
    private LocalDate incidentDate;
    @NotBlank(message = "The description is required")
    private String description;
    @NotBlank(message = "The status is required")
    private String status;
    @NotNull(message = "The inspection id is required")
    private Long inspectionId;
    @NotNull(message = "The pest type id is required")
    private Long pestTypeId;

    public Long getIdIncident() { return idIncident; }
    public void setIdIncident(Long idIncident) { this.idIncident = idIncident; }
    public LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getInspectionId() { return inspectionId; }
    public void setInspectionId(Long inspectionId) { this.inspectionId = inspectionId; }
    public Long getPestTypeId() { return pestTypeId; }
    public void setPestTypeId(Long pestTypeId) { this.pestTypeId = pestTypeId; }
}
