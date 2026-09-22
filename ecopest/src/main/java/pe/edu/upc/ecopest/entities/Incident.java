package pe.edu.upc.ecopest.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "incidents")
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_incident")
    private Long idIncident;

    @Column(name = "incident_date", nullable = false)
    private LocalDate incidentDate;

    @Column(name = "description", length = 300, nullable = false)
    private String description;

    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "id_inspection")
    private Inspection inspection;

    @ManyToOne
    @JoinColumn(name = "id_pest_type")
    private PestType pestType;

    public Incident() {}

    public Long getIdIncident() { return idIncident; }
    public void setIdIncident(Long idIncident) { this.idIncident = idIncident; }
    public LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Inspection getInspection() { return inspection; }
    public void setInspection(Inspection inspection) { this.inspection = inspection; }
    public PestType getPestType() { return pestType; }
    public void setPestType(PestType pestType) { this.pestType = pestType; }
}
