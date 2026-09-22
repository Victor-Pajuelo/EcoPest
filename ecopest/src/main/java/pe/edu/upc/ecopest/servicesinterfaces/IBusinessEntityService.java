package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.BusinessEntity;
import java.util.List;
import java.util.Optional;

public interface IBusinessEntityService {
    void insert(BusinessEntity businessEntity);
    List<BusinessEntity> list();
    List<BusinessEntity> listByType(String type);
    Optional<BusinessEntity> findById(Long id);
    void update(BusinessEntity businessEntity);
    void delete(Long id);
    List<Object[]> countUsersByCompany();
}
