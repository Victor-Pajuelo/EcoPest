package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.BusinessEntity;
import java.util.List;

@Repository
public interface IBusinessEntityRepository extends JpaRepository<BusinessEntity, Long> {
    List<BusinessEntity> findByType(String type);

    @Query(value = "SELECT be.company_name, COUNT(u.id_user) " +
            "FROM business_entities be LEFT JOIN users u ON be.id_business_entity = u.id_business_entity " +
            "GROUP BY be.company_name", nativeQuery = true)
    List<Object[]> countUsersByCompany();
}
