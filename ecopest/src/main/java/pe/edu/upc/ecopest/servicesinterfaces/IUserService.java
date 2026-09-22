package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.User;
import java.util.List;
import java.util.Optional;

public interface IUserService {
    void insert(User user);
    List<User> list();
    List<User> listByBusinessEntity(Long businessEntityId);
    Optional<User> findById(Long id);
}
