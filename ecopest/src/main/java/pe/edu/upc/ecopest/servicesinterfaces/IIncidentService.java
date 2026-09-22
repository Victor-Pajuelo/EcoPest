package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.Incident;
import java.util.List;
import java.util.Optional;

public interface IIncidentService {
    void insert(Incident incident);
    List<Incident> list();
    List<Incident> listByBusinessEntity(Long businessEntityId);
    Optional<Incident> findById(Long id);
    List<Object[]> countIncidentsByPestType();

    // Nuevos métodos para JOIN y DeleteBy
    List<Incident> findByPestNameAndCompany(String pestName, String companyName);
    void deleteByBusinessEntity(Long businessEntityId);
}