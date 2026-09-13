package pe.edu.upc.ecopest.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EntidadDTO {
    private Long idEntidad;
    @NotBlank(message = "El nombre de la entidad es obligatorio")
    private String nameEntidad;
    @NotBlank(message = "El tipo de entidad es obligatorio")
    private String typeEntidad;
    private String nombreEmpresa;
    @NotNull(message = "El status es obligatorio")
    private boolean statusEntidad;
    private Long idEntidadPadre;

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
    public Long getIdEntidadPadre() { return idEntidadPadre; }
    public void setIdEntidadPadre(Long idEntidadPadre) { this.idEntidadPadre = idEntidadPadre; }
}
