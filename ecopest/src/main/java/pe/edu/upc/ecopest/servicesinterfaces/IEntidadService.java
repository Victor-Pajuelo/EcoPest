package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.Entidad;
import java.util.List;
import java.util.Optional;

public interface IEntidadService {
    void insert(Entidad e);
    List<Entidad> list();
    List<Entidad> listByTipo(String tipo);
    Optional<Entidad> listId(Long id);
    void update(Entidad e);
    void delete(Long id);
    List<Object[]> countUsuariosPorEmpresa();
}
