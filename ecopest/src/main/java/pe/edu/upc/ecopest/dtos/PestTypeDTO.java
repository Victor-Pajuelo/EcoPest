package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.NotBlank;

public class PestTypeDTO {
    private Long idPestType;
    @NotBlank(message = "The pest type name is required")
    private String name;
    @NotBlank(message = "The risk level is required")
    private String riskLevel;
    @NotBlank(message = "The description is required")
    private String description;

    public Long getIdPestType() { return idPestType; }
    public void setIdPestType(Long idPestType) { this.idPestType = idPestType; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
