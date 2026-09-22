package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.Incident;
import pe.edu.upc.ecopest.repositories.IIncidentRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IIncidentService;
import java.util.List;
import java.util.Optional;

@Service
public class IncidentServiceImplement implements IIncidentService {
    private final IIncidentRepository repository;
    public IncidentServiceImplement(IIncidentRepository repository) { this.repository = repository; }
    @Override public void insert(Incident incident) { repository.save(incident); }
    @Override public List<Incident> list() { return repository.findAll(); }
    @Override public List<Incident> listByBusinessEntity(Long businessEntityId) { return repository.findByInspection_BusinessEntity_IdBusinessEntity(businessEntityId); }
    @Override public Optional<Incident> findById(Long id) { return repository.findById(id); }
    @Override public List<Object[]> countIncidentsByPestType() { return repository.countIncidentsByPestType(); }
}
