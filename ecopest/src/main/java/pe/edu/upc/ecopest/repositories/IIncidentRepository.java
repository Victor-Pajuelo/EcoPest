package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.Incident;
import java.util.List;

@Repository
public interface IIncidentRepository extends JpaRepository<Incident, Long> {

    // Método original
    List<Incident> findByInspection_BusinessEntity_IdBusinessEntity(Long businessEntityId);

    // Borrado por ID de BusinessEntity
    void deleteByInspection_BusinessEntity_IdBusinessEntity(Long businessEntityId);

    @Query(value = "SELECT pt.name, COUNT(i.id_incident) " +
            "FROM pest_types pt LEFT JOIN incidents i ON pt.id_pest_type = i.id_pest_type " +
            "GROUP BY pt.name", nativeQuery = true)
    List<Object[]> countIncidentsByPestType();

    // JPQL ajustado exactamente a los campos idIncident, pestType e inspection de la entidad Incident
    @Query("SELECT i FROM Incident i " +
            "JOIN i.pestType pt " +
            "JOIN i.inspection insp " +
            "WHERE pt.name = :pestName")
    List<Incident> findIncidentsByPestNameAndCompany(@Param("pestName") String pestName,
                                                     @Param("companyName") String companyName);
}