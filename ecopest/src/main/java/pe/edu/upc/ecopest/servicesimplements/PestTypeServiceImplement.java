package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.PestType;
import pe.edu.upc.ecopest.repositories.IPestTypeRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IPestTypeService;
import java.util.List;
import java.util.Optional;

@Service
public class PestTypeServiceImplement implements IPestTypeService {
    private final IPestTypeRepository repository;
    public PestTypeServiceImplement(IPestTypeRepository repository) { this.repository = repository; }
    @Override public void insert(PestType pestType) { repository.save(pestType); }
    @Override public List<PestType> list() { return repository.findAll(); }
    @Override public List<PestType> listByRiskLevel(String riskLevel) { return repository.findByRiskLevel(riskLevel); }
    @Override public Optional<PestType> findById(Long id) { return repository.findById(id); }
}
