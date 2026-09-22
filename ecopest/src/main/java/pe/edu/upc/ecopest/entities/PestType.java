package pe.edu.upc.ecopest.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "pest_types")
public class PestType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pest_type")
    private Long idPestType;

    @Column(name = "name", length = 60, nullable = false)
    private String name;

    @Column(name = "risk_level", length = 20, nullable = false)
    private String riskLevel;

    @Column(name = "description", length = 200, nullable = false)
    private String description;

    public PestType() {}

    public Long getIdPestType() { return idPestType; }
    public void setIdPestType(Long idPestType) { this.idPestType = idPestType; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
