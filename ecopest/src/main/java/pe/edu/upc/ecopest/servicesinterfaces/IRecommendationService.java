package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.Incident;
import pe.edu.upc.ecopest.entities.Recommendation;
import java.util.List;
import java.util.Optional;

public interface IRecommendationService {
    void insert(Recommendation recommendation);
    List<Recommendation> list();
    List<Recommendation> listByIncident(Long incidentId);
    Optional<Recommendation> findById(Long id);
    List<Object[]> countRecommendationsByIncident();
    void update(Recommendation recommendation);
    Recommendation generateWithAI(Incident incident);
    void delete(Long id);
}
