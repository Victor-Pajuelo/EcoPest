package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BusinessEntityDTO {
    private Long idBusinessEntity;
    @NotBlank(message = "The business entity name is required")
    private String name;
    @NotBlank(message = "The business entity type is required")
    private String type;
    private String companyName;
    @NotNull(message = "The active status is required")
    private boolean active;
    private Long parentBusinessEntityId;

    public Long getIdBusinessEntity() { return idBusinessEntity; }
    public void setIdBusinessEntity(Long idBusinessEntity) { this.idBusinessEntity = idBusinessEntity; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public Long getParentBusinessEntityId() { return parentBusinessEntityId; }
    public void setParentBusinessEntityId(Long parentBusinessEntityId) { this.parentBusinessEntityId = parentBusinessEntityId; }
}
