package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class InspectionDTO {
    private Long idInspection;
    @NotNull(message = "The inspection date is required")
    private LocalDate inspectionDate;
    @NotBlank(message = "The inspection status is required")
    private String status;
    @NotBlank(message = "The observations are required")
    private String observations;
    @NotNull(message = "The business entity id is required")
    private Long businessEntityId;
    @NotNull(message = "The user id is required")
    private Long userId;

    public Long getIdInspection() { return idInspection; }
    public void setIdInspection(Long idInspection) { this.idInspection = idInspection; }
    public LocalDate getInspectionDate() { return inspectionDate; }
    public void setInspectionDate(LocalDate inspectionDate) { this.inspectionDate = inspectionDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
    public Long getBusinessEntityId() { return businessEntityId; }
    public void setBusinessEntityId(Long businessEntityId) { this.businessEntityId = businessEntityId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
