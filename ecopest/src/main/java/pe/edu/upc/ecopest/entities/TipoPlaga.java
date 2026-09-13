package pe.edu.upc.ecopest.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "tipos_plaga")
public class TipoPlaga {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTipoPlaga;

    @Column(name = "nameTipoPlaga", length = 60, nullable = false)
    private String nameTipoPlaga;

    @Column(name = "nivelRiesgoTipoPlaga", length = 20, nullable = false)
    private String nivelRiesgoTipoPlaga;

    @Column(name = "descripcionTipoPlaga", length = 200, nullable = false)
    private String descripcionTipoPlaga;

    public TipoPlaga() {}

    public Long getIdTipoPlaga() { return idTipoPlaga; }
    public void setIdTipoPlaga(Long idTipoPlaga) { this.idTipoPlaga = idTipoPlaga; }
    public String getNameTipoPlaga() { return nameTipoPlaga; }
    public void setNameTipoPlaga(String nameTipoPlaga) { this.nameTipoPlaga = nameTipoPlaga; }
    public String getNivelRiesgoTipoPlaga() { return nivelRiesgoTipoPlaga; }
    public void setNivelRiesgoTipoPlaga(String nivelRiesgoTipoPlaga) { this.nivelRiesgoTipoPlaga = nivelRiesgoTipoPlaga; }
    public String getDescripcionTipoPlaga() { return descripcionTipoPlaga; }
    public void setDescripcionTipoPlaga(String descripcionTipoPlaga) { this.descripcionTipoPlaga = descripcionTipoPlaga; }
}
