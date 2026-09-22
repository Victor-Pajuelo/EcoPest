package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.Inspection;

import java.util.List;

@Repository
public interface IInspectionRepository extends JpaRepository<Inspection, Long> {

    // Método original
    List<Inspection> findByStatus(String status);

    // Borrado por estado
    void deleteByStatus(String status);

    // Método original
    @Query(value = "SELECT be.company_name, COUNT(i.id_inspection) " +
            "FROM business_entities be LEFT JOIN inspections i ON be.id_business_entity = i.id_business_entity " +
            "GROUP BY be.company_name", nativeQuery = true)
    List<Object[]> countInspectionsByCompany();

    // Consulta corregida navegando desde Incident hacia Inspection y BusinessEntity
    @Query("SELECT DISTINCT i.inspection FROM Incident i " +
            "JOIN i.inspection.businessEntity be " +
            "WHERE i.status = :incidentStatus AND be.companyName = :companyName")
    List<Inspection> findInspectionsWithPendingIncidentsByCompany(@Param("incidentStatus") String incidentStatus,
                                                                  @Param("companyName") String companyName);
}