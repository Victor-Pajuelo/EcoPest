package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.Recommendation;
import java.util.List;

@Repository
public interface IRecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByIncident_IdIncident(Long incidentId);

    @Query(value = "SELECT i.description, COUNT(r.id_recommendation) " +
            "FROM incidents i LEFT JOIN recommendations r ON i.id_incident = r.id_incident " +
            "GROUP BY i.description", nativeQuery = true)
    List<Object[]> countRecommendationsByIncident();
}
