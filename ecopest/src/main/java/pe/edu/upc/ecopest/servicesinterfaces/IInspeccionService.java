package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.entities.Inspeccion;
import java.util.List;
import java.util.Optional;

public interface IInspeccionService {
    void insert(Inspeccion i);
    List<Inspeccion> list();
    List<Inspeccion> listByEstado(String estado);
    Optional<Inspeccion> listId(Long id);
    void update(Inspeccion i);
    List<Object[]> countInspeccionesPorEmpresa();
}
