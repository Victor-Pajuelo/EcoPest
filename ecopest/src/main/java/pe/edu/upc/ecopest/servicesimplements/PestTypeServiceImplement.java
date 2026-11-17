package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.clients.INaturalistClient;
import pe.edu.upc.ecopest.entities.PestType;
import pe.edu.upc.ecopest.repositories.IPestTypeRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IPestTypeService;
import java.util.List;
import java.util.Optional;

@Service
public class PestTypeServiceImplement implements IPestTypeService {
    private final IPestTypeRepository repository;
    private final INaturalistClient iNaturalistClient;

    public PestTypeServiceImplement(IPestTypeRepository repository, INaturalistClient iNaturalistClient) {
        this.repository = repository;
        this.iNaturalistClient = iNaturalistClient;
    }

    @Override
    public void insert(PestType pestType) {
        repository.save(pestType);
    }

    @Override
    public List<PestType> list() {
        return repository.findAll();
    }

    @Override
    public List<PestType> listByRiskLevel(String riskLevel) {
        return repository.findByRiskLevel(riskLevel);
    }

    @Override
    public Optional<PestType> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public void update(PestType pestType) {
        repository.save(pestType);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<INaturalistClient.Taxon> searchSpecies(String query) {
        if (query == null || query.trim().length() < 3) {
            throw new IllegalArgumentException("The search must have at least 3 characters");
        }
        return iNaturalistClient.search(query.trim());
    }
}
