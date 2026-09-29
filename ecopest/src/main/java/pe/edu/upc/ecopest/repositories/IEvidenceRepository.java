package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.Evidence;
import java.util.List;

@Repository
public interface IEvidenceRepository extends JpaRepository<Evidence, Long> {
    List<Evidence> findByIncident_IdIncident(Long incidentId);

    @Query(value = "SELECT i.description, COUNT(e.id_evidence) " +
            "FROM incidents i LEFT JOIN evidence e ON i.id_incident = e.id_incident " +
            "GROUP BY i.description", nativeQuery = true)
    List<Object[]> countEvidenceByIncident();
}
