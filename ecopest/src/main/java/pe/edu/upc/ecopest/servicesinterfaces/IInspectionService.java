package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.Inspection;
import java.util.List;
import java.util.Optional;

public interface IInspectionService {
    void insert(Inspection inspection);
    List<Inspection> list();
    List<Inspection> listByStatus(String status);
    Optional<Inspection> findById(Long id);
    void update(Inspection inspection);
    List<Object[]> countInspectionsByCompany();
}
