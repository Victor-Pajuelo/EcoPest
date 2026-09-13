package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.Incidencia;
import pe.edu.upc.ecopest.repositories.IIncidenciaRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IIncidenciaService;

import java.util.List;
import java.util.Optional;

@Service
public class IncidenciaServiceImplement implements IIncidenciaService {
    private final IIncidenciaRepository iR;

    public IncidenciaServiceImplement(IIncidenciaRepository iR) { this.iR = iR; }

    @Override public void insert(Incidencia inc) { iR.save(inc); }
    @Override public List<Incidencia> list() { return iR.findAll(); }
    @Override public List<Incidencia> listByEntidad(Long idEntidad) { return iR.findByInspeccion_Entidad_IdEntidad(idEntidad); }
    @Override public Optional<Incidencia> listId(Long id) { return iR.findById(id); }
    @Override public List<Object[]> countIncidenciasPorTipoPlaga() { return iR.countIncidenciasPorTipoPlaga(); }
}
