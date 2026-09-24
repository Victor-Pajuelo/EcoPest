package pe.edu.upc.ecopest.dtos;

public class UserResponseDTO {
    private Long idUsuario;
    private String nameUsuario;
    private String emailUsuario;
    private Long idRol;
    private String nameRol;

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    public String getNameUsuario() { return nameUsuario; }
    public void setNameUsuario(String nameUsuario) { this.nameUsuario = nameUsuario; }
    public String getEmailUsuario() { return emailUsuario; }
    public void setEmailUsuario(String emailUsuario) { this.emailUsuario = emailUsuario; }
    public Long getIdRol() { return idRol; }
    public void setIdRol(Long idRol) { this.idRol = idRol; }
    public String getNameRol() { return nameRol; }
    public void setNameRol(String nameRol) { this.nameRol = nameRol; }
}
