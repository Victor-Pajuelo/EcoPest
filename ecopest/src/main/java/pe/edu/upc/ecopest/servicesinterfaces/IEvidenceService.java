package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.Evidence;
import java.util.List;
import java.util.Optional;

public interface IEvidenceService {
    void insert(Evidence evidence);
    List<Evidence> list();
    List<Evidence> listByIncident(Long incidentId);
    Optional<Evidence> findById(Long id);
}
