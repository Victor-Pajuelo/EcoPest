package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class EvidenceDTO {
    private Long idEvidence;
    @NotBlank(message = "The file URL is required")
    private String fileUrl;
    @NotBlank(message = "The file type is required")
    private String fileType;
    private LocalDateTime uploadDate;
    @NotNull(message = "The incident id is required")
    private Long incidentId;

    public Long getIdEvidence() { return idEvidence; }
    public void setIdEvidence(Long idEvidence) { this.idEvidence = idEvidence; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }
    public Long getIncidentId() { return incidentId; }
    public void setIncidentId(Long incidentId) { this.incidentId = incidentId; }
}
