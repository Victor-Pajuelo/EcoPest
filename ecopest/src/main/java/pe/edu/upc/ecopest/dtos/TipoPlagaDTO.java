package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.NotBlank;

public class TipoPlagaDTO {
    private Long idTipoPlaga;
    @NotBlank(message = "El nombre del tipo de plaga es obligatorio")
    private String nameTipoPlaga;
    @NotBlank(message = "El nivel de riesgo es obligatorio")
    private String nivelRiesgoTipoPlaga;
    @NotBlank(message = "La descripcion es obligatoria")
    private String descripcionTipoPlaga;

    public Long getIdTipoPlaga() { return idTipoPlaga; }
    public void setIdTipoPlaga(Long idTipoPlaga) { this.idTipoPlaga = idTipoPlaga; }
    public String getNameTipoPlaga() { return nameTipoPlaga; }
    public void setNameTipoPlaga(String nameTipoPlaga) { this.nameTipoPlaga = nameTipoPlaga; }
    public String getNivelRiesgoTipoPlaga() { return nivelRiesgoTipoPlaga; }
    public void setNivelRiesgoTipoPlaga(String nivelRiesgoTipoPlaga) { this.nivelRiesgoTipoPlaga = nivelRiesgoTipoPlaga; }
    public String getDescripcionTipoPlaga() { return descripcionTipoPlaga; }
    public void setDescripcionTipoPlaga(String descripcionTipoPlaga) { this.descripcionTipoPlaga = descripcionTipoPlaga; }
}
