package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.Incidencia;
import java.util.List;
import java.util.Optional;

public interface IIncidenciaService {
    void insert(Incidencia inc);
    List<Incidencia> list();
    List<Incidencia> listByEntidad(Long idEntidad);
    Optional<Incidencia> listId(Long id);
    List<Object[]> countIncidenciasPorTipoPlaga();
}
