package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.Rol;
import java.util.List;
import java.util.Optional;

public interface IRolService {
    void insert(Rol r);
    List<Rol> list();
    List<Rol> listByStatus(boolean status);
    Optional<Rol> listId(Long id);
}
