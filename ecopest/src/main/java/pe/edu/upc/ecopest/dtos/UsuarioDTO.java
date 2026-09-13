package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UsuarioDTO {
    private Long idUsuario;
    @NotBlank(message = "El nombre del usuario es obligatorio")
    private String nameUsuario;
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene formato valido")
    private String emailUsuario;
    @NotBlank(message = "La contrasena es obligatoria")
    private String passwordUsuario;
    @NotNull(message = "El status es obligatorio")
    private boolean statusUsuario;
    @NotNull(message = "El id del rol es obligatorio")
    private Long idRol;
    @NotNull(message = "El id de la entidad es obligatorio")
    private Long idEntidad;

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    public String getNameUsuario() { return nameUsuario; }
    public void setNameUsuario(String nameUsuario) { this.nameUsuario = nameUsuario; }
    public String getEmailUsuario() { return emailUsuario; }
    public void setEmailUsuario(String emailUsuario) { this.emailUsuario = emailUsuario; }
    public String getPasswordUsuario() { return passwordUsuario; }
    public void setPasswordUsuario(String passwordUsuario) { this.passwordUsuario = passwordUsuario; }
    public boolean isStatusUsuario() { return statusUsuario; }
    public void setStatusUsuario(boolean statusUsuario) { this.statusUsuario = statusUsuario; }
    public Long getIdRol() { return idRol; }
    public void setIdRol(Long idRol) { this.idRol = idRol; }
    public Long getIdEntidad() { return idEntidad; }
    public void setIdEntidad(Long idEntidad) { this.idEntidad = idEntidad; }
}
