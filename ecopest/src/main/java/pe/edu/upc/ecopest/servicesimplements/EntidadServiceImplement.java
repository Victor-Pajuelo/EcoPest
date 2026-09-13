package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.Entidad;
import pe.edu.upc.ecopest.repositories.IEntidadRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IEntidadService;

import java.util.List;
import java.util.Optional;

@Service
public class EntidadServiceImplement implements IEntidadService {
    private final IEntidadRepository eR;

    public EntidadServiceImplement(IEntidadRepository eR) { this.eR = eR; }

    @Override public void insert(Entidad e) { eR.save(e); }
    @Override public List<Entidad> list() { return eR.findAll(); }
    @Override public List<Entidad> listByTipo(String tipo) { return eR.findByTypeEntidad(tipo); }
    @Override public Optional<Entidad> listId(Long id) { return eR.findById(id); }
    @Override public void update(Entidad e) { eR.save(e); }
    @Override public void delete(Long id) { eR.deleteById(id); }
    @Override public List<Object[]> countUsuariosPorEmpresa() { return eR.countUsuariosPorEmpresa(); }
}
