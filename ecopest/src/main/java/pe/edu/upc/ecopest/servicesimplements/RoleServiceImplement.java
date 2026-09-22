package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.Role;
import pe.edu.upc.ecopest.repositories.IRoleRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IRoleService;
import java.util.List;
import java.util.Optional;

@Service
public class RoleServiceImplement implements IRoleService {
    private final IRoleRepository repository;
    public RoleServiceImplement(IRoleRepository repository) { this.repository = repository; }
    @Override public void insert(Role role) { repository.save(role); }
    @Override public List<Role> list() { return repository.findAll(); }
    @Override public List<Role> listByActive(boolean active) { return repository.findByActive(active); }
    @Override public Optional<Role> findById(Long id) { return repository.findById(id); }
}
