package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.BusinessEntity;
import pe.edu.upc.ecopest.repositories.IBusinessEntityRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IBusinessEntityService;
import java.util.List;
import java.util.Optional;

@Service
public class BusinessEntityServiceImplement implements IBusinessEntityService {
    private final IBusinessEntityRepository repository;
    public BusinessEntityServiceImplement(IBusinessEntityRepository repository) { this.repository = repository; }
    @Override public void insert(BusinessEntity businessEntity) { repository.save(businessEntity); }
    @Override public List<BusinessEntity> list() { return repository.findAll(); }
    @Override public List<BusinessEntity> listByType(String type) { return repository.findByType(type); }
    @Override public Optional<BusinessEntity> findById(Long id) { return repository.findById(id); }
    @Override public void update(BusinessEntity businessEntity) { repository.save(businessEntity); }
    @Override public void delete(Long id) { repository.deleteById(id); }
    @Override public List<Object[]> countUsersByCompany() { return repository.countUsersByCompany(); }
}
