package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RoleInsertDTO {
    private Long idRole;
    @NotBlank(message = "The role name is required")
    private String name;
    @NotBlank(message = "The role description is required")
    private String description;
    @NotNull(message = "The active status is required")
    private boolean active;

    public Long getIdRole() { return idRole; }
    public void setIdRole(Long idRole) { this.idRole = idRole; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
