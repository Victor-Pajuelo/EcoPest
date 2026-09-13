package pe.edu.upc.ecopest.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRol;

    @Column(name = "nameRol", length = 30, nullable = false)
    private String nameRol;

    @Column(name = "descriptionRol", length = 100, nullable = false)
    private String descriptionRol;

    @Column(name = "statusRol", nullable = false)
    private boolean statusRol;

    public Rol() {}

    public Rol(Long idRol, String nameRol, String descriptionRol, boolean statusRol) {
        this.idRol = idRol;
        this.nameRol = nameRol;
        this.descriptionRol = descriptionRol;
        this.statusRol = statusRol;
    }

    public Long getIdRol() { return idRol; }
    public void setIdRol(Long idRol) { this.idRol = idRol; }
    public String getNameRol() { return nameRol; }
    public void setNameRol(String nameRol) { this.nameRol = nameRol; }
    public String getDescriptionRol() { return descriptionRol; }
    public void setDescriptionRol(String descriptionRol) { this.descriptionRol = descriptionRol; }
    public boolean isStatusRol() { return statusRol; }
    public void setStatusRol(boolean statusRol) { this.statusRol = statusRol; }
}
