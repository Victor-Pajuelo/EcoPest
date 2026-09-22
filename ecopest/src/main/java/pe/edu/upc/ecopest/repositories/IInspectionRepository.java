package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.Inspection;
import java.util.List;

@Repository
public interface IInspectionRepository extends JpaRepository<Inspection, Long> {
    List<Inspection> findByStatus(String status);

    @Query(value = "SELECT be.company_name, COUNT(i.id_inspection) " +
            "FROM business_entities be LEFT JOIN inspections i ON be.id_business_entity = i.id_business_entity " +
            "GROUP BY be.company_name", nativeQuery = true)
    List<Object[]> countInspectionsByCompany();
}
