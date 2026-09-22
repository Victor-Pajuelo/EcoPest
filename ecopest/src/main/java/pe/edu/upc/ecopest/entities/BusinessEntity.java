package pe.edu.upc.ecopest.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "business_entities")
public class BusinessEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_business_entity")
    private Long idBusinessEntity;

    @Column(name = "name", length = 80, nullable = false)
    private String name;

    @Column(name = "type", length = 20, nullable = false)
    private String type;

    @Column(name = "company_name", length = 80, nullable = false)
    private String companyName;

    @Column(name = "active", nullable = false)
    private boolean active;

    @ManyToOne
    @JoinColumn(name = "parent_business_entity_id")
    private BusinessEntity parentBusinessEntity;

    public BusinessEntity() {}

    public Long getIdBusinessEntity() { return idBusinessEntity; }
    public void setIdBusinessEntity(Long idBusinessEntity) { this.idBusinessEntity = idBusinessEntity; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public BusinessEntity getParentBusinessEntity() { return parentBusinessEntity; }
    public void setParentBusinessEntity(BusinessEntity parentBusinessEntity) { this.parentBusinessEntity = parentBusinessEntity; }
}
