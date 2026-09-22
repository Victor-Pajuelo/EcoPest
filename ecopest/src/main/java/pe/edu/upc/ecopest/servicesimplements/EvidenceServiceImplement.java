package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.Evidence;
import pe.edu.upc.ecopest.repositories.IEvidenceRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IEvidenceService;
import java.util.List;
import java.util.Optional;

@Service
public class EvidenceServiceImplement implements IEvidenceService {
    private final IEvidenceRepository repository;
    public EvidenceServiceImplement(IEvidenceRepository repository) { this.repository = repository; }
    @Override public void insert(Evidence evidence) { repository.save(evidence); }
    @Override public List<Evidence> list() { return repository.findAll(); }
    @Override public List<Evidence> listByIncident(Long incidentId) { return repository.findByIncident_IdIncident(incidentId); }
    @Override public Optional<Evidence> findById(Long id) { return repository.findById(id); }
}
