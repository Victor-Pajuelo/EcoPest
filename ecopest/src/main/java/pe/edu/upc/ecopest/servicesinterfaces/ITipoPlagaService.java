package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.TipoPlaga;
import java.util.List;
import java.util.Optional;

public interface ITipoPlagaService {
    void insert(TipoPlaga tp);
    List<TipoPlaga> list();
    List<TipoPlaga> listByNivelRiesgo(String nivelRiesgo);
    Optional<TipoPlaga> listId(Long id);
}
