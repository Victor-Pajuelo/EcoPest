package pe.edu.upc.ecopest.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserDTO {
    private Long idUser;
    @NotBlank(message = "The user name is required")
    private String name;
    @NotBlank(message = "The email is required")
    @Email(message = "The email format is invalid")
    private String email;
    @NotBlank(message = "The password is required")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    @NotNull(message = "The active status is required")
    private boolean active;
    @NotNull(message = "The role id is required")
    private Long roleId;
    @NotNull(message = "The business entity id is required")
    private Long businessEntityId;

    public Long getIdUser() { return idUser; }
    public void setIdUser(Long idUser) { this.idUser = idUser; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public Long getRoleId() { return roleId; }
    public void setRoleId(Long roleId) { this.roleId = roleId; }
    public Long getBusinessEntityId() { return businessEntityId; }
    public void setBusinessEntityId(Long businessEntityId) { this.businessEntityId = businessEntityId; }
}
