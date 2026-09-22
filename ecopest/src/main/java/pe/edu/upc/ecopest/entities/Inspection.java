package pe.edu.upc.ecopest.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "inspections")
public class Inspection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inspection")
    private Long idInspection;

    @Column(name = "inspection_date", nullable = false)
    private LocalDate inspectionDate;

    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @Column(name = "observations", length = 300, nullable = false)
    private String observations;

    @ManyToOne
    @JoinColumn(name = "id_business_entity")
    private BusinessEntity businessEntity;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    public Inspection() {}

    public Long getIdInspection() { return idInspection; }
    public void setIdInspection(Long idInspection) { this.idInspection = idInspection; }
    public LocalDate getInspectionDate() { return inspectionDate; }
    public void setInspectionDate(LocalDate inspectionDate) { this.inspectionDate = inspectionDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
    public BusinessEntity getBusinessEntity() { return businessEntity; }
    public void setBusinessEntity(BusinessEntity businessEntity) { this.businessEntity = businessEntity; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
