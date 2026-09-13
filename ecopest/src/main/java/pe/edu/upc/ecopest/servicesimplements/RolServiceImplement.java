package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.Rol;
import pe.edu.upc.ecopest.repositories.IRolRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IRolService;

import java.util.List;
import java.util.Optional;

@Service
public class RolServiceImplement implements IRolService {
    private final IRolRepository rR;

    public RolServiceImplement(IRolRepository rR) { this.rR = rR; }

    @Override public void insert(Rol r) { rR.save(r); }
    @Override public List<Rol> list() { return rR.findAll(); }
    @Override public List<Rol> listByStatus(boolean status) { return rR.findByStatusRol(status); }
    @Override public Optional<Rol> listId(Long id) { return rR.findById(id); }
}
