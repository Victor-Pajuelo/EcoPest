package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.User;
import pe.edu.upc.ecopest.repositories.IUserRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IUserService;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImplement implements IUserService {
    private final IUserRepository repository;
    public UserServiceImplement(IUserRepository repository) { this.repository = repository; }
    @Override public void insert(User user) { repository.save(user); }
    @Override public List<User> list() { return repository.findAll(); }
    @Override public List<User> listByBusinessEntity(Long businessEntityId) { return repository.findByBusinessEntity_IdBusinessEntity(businessEntityId); }
    @Override public Optional<User> findById(Long id) { return repository.findById(id); }
}
