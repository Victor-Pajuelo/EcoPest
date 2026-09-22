package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.Recommendation;
import java.util.List;

@Repository
public interface IRecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByIncident_IdIncident(Long incidentId);
}
