package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RolInsertDTO {
    private Long idRol;
    @NotBlank(message = "El nombre del rol es obligatorio")
    private String nameRol;
    @NotBlank(message = "La descripcion del rol es obligatoria")
    private String descriptionRol;
    @NotNull(message = "El status es obligatorio")
    private boolean statusRol;

    public Long getIdRol() { return idRol; }
    public void setIdRol(Long idRol) { this.idRol = idRol; }
    public String getNameRol() { return nameRol; }
    public void setNameRol(String nameRol) { this.nameRol = nameRol; }
    public String getDescriptionRol() { return descriptionRol; }
    public void setDescriptionRol(String descriptionRol) { this.descriptionRol = descriptionRol; }
    public boolean isStatusRol() { return statusRol; }
    public void setStatusRol(boolean statusRol) { this.statusRol = statusRol; }
}
