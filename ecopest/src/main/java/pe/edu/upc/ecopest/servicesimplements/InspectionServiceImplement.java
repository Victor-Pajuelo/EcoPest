package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upc.ecopest.entities.Inspection;
import pe.edu.upc.ecopest.repositories.IInspectionRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IInspectionService;
import java.util.List;
import java.util.Optional;

@Service
public class InspectionServiceImplement implements IInspectionService {

    private final IInspectionRepository repository;

    public InspectionServiceImplement(IInspectionRepository repository) {
        this.repository = repository;
    }

    @Override
    public void insert(Inspection inspection) {
        repository.save(inspection);
    }

    @Override
    public List<Inspection> list() {
        return repository.findAll();
    }

    @Override
    public List<Inspection> listByStatus(String status) {
        return repository.findByStatus(status);
    }

    @Override
    public Optional<Inspection> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public void update(Inspection inspection) {
        repository.save(inspection);
    }

    @Override
    public List<Object[]> countInspectionsByCompany() {
        return repository.countInspectionsByCompany();
    }

    @Override
    public List<Inspection> findWithPendingIncidentsByCompany(String incidentStatus, String companyName) {
        return repository.findWithPendingIncidentsByCompany(incidentStatus, companyName);
    }

    @Override
    @Transactional
    public void deleteByStatus(String status) {
        repository.deleteByStatus(status);
    }
}