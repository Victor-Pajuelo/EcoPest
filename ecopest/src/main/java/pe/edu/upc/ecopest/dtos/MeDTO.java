package pe.edu.upc.ecopest.dtos;

/**
 * Datos del usuario autenticado (para que el frontend sepa su id, rol y empresa).
 */
public class MeDTO {
    private Long idUser;
    private String name;
    private String email;
    private String role;
    private Long businessEntityId;

    public MeDTO(Long idUser, String name, String email, String role, Long businessEntityId) {
        this.idUser = idUser;
        this.name = name;
        this.email = email;
        this.role = role;
        this.businessEntityId = businessEntityId;
    }

    public Long getIdUser() { return idUser; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public Long getBusinessEntityId() { return businessEntityId; }
}
