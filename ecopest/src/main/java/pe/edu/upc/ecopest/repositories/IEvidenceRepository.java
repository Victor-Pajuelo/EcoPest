package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.Evidence;
import java.util.List;

@Repository
public interface IEvidenceRepository extends JpaRepository<Evidence, Long> {
    List<Evidence> findByIncident_IdIncident(Long incidentId);
}
