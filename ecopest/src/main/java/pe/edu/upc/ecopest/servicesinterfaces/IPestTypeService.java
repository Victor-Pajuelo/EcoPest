package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.PestType;
import java.util.List;
import java.util.Optional;

public interface IPestTypeService {
    void insert(PestType pestType);
    List<PestType> list();
    List<PestType> listByRiskLevel(String riskLevel);
    Optional<PestType> findById(Long id);
}
