package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.Recommendation;
import pe.edu.upc.ecopest.repositories.IRecommendationRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IRecommendationService;
import java.util.List;
import java.util.Optional;

@Service
public class RecommendationServiceImplement implements IRecommendationService {
    private final IRecommendationRepository repository;
    public RecommendationServiceImplement(IRecommendationRepository repository) { this.repository = repository; }
    @Override public void insert(Recommendation recommendation) { repository.save(recommendation); }
    @Override public List<Recommendation> list() { return repository.findAll(); }
    @Override public List<Recommendation> listByIncident(Long incidentId) { return repository.findByIncident_IdIncident(incidentId); }
    @Override public Optional<Recommendation> findById(Long id) { return repository.findById(id); }
}
