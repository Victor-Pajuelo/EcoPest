package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.PestType;
import java.util.List;

@Repository
public interface IPestTypeRepository extends JpaRepository<PestType, Long> {
    List<PestType> findByRiskLevel(String riskLevel);
}
