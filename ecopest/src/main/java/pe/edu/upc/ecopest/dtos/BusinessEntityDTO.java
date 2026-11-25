package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

public class BusinessEntityDTO {
    private Long idBusinessEntity;
    @NotBlank(message = "The business entity name is required")
    private String name;
    @NotBlank(message = "The business entity type is required")
    private String type;
    private String companyName;
    private boolean active;
    private Long parentBusinessEntityId;
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;

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
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
