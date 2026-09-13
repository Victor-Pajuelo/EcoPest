package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.Inspeccion;
import pe.edu.upc.ecopest.repositories.IInspeccionRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IInspeccionService;

import java.util.List;
import java.util.Optional;

@Service
public class InspeccionServiceImplement implements IInspeccionService {
    private final IInspeccionRepository iR;

    public InspeccionServiceImplement(IInspeccionRepository iR) { this.iR = iR; }

    @Override public void insert(Inspeccion i) { iR.save(i); }
    @Override public List<Inspeccion> list() { return iR.findAll(); }
    @Override public List<Inspeccion> listByEstado(String estado) { return iR.findByEstadoInspeccion(estado); }
    @Override public Optional<Inspeccion> listId(Long id) { return iR.findById(id); }
    @Override public void update(Inspeccion i) { iR.save(i); }
    @Override public List<Object[]> countInspeccionesPorEmpresa() { return iR.countInspeccionesPorEmpresa(); }
}
