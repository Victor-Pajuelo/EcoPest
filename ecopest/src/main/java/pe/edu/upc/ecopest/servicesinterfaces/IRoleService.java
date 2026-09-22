package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.Role;
import java.util.List;
import java.util.Optional;

public interface IRoleService {
    void insert(Role role);
    List<Role> list();
    List<Role> listByActive(boolean active);
    Optional<Role> findById(Long id);
}
