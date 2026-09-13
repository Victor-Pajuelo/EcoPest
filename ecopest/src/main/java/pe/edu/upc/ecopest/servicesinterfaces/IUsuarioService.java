package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.Usuario;
import java.util.List;
import java.util.Optional;

public interface IUsuarioService {
    void insert(Usuario u);
    List<Usuario> list();
    List<Usuario> listByEntidad(Long idEntidad);
    Optional<Usuario> listId(Long id);
}
