package pe.edu.upc.ecopest.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "entidades")
public class Entidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEntidad;

    @Column(name = "nameEntidad", length = 80, nullable = false)
    private String nameEntidad;

    @Column(name = "typeEntidad", length = 20, nullable = false)
    private String typeEntidad;

    @Column(name = "nombreEmpresa", length = 80, nullable = false)
    private String nombreEmpresa;

    @Column(name = "statusEntidad", nullable = false)
    private boolean statusEntidad;

    @ManyToOne
    @JoinColumn(name = "idEntidadPadre")
    private Entidad entidadPadre;

    public Entidad() {}

    public Long getIdEntidad() { return idEntidad; }
    public void setIdEntidad(Long idEntidad) { this.idEntidad = idEntidad; }
    public String getNameEntidad() { return nameEntidad; }
    public void setNameEntidad(String nameEntidad) { this.nameEntidad = nameEntidad; }
    public String getTypeEntidad() { return typeEntidad; }
    public void setTypeEntidad(String typeEntidad) { this.typeEntidad = typeEntidad; }
    public String getNombreEmpresa() { return nombreEmpresa; }
    public void setNombreEmpresa(String nombreEmpresa) { this.nombreEmpresa = nombreEmpresa; }
    public boolean isStatusEntidad() { return statusEntidad; }
    public void setStatusEntidad(boolean statusEntidad) { this.statusEntidad = statusEntidad; }
    public Entidad getEntidadPadre() { return entidadPadre; }
    public void setEntidadPadre(Entidad entidadPadre) { this.entidadPadre = entidadPadre; }
}
