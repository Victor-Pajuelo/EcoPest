package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.Usuario;
import pe.edu.upc.ecopest.repositories.IUsuarioRepository;
import pe.edu.upc.ecopest.servicesinterfaces.IUsuarioService;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImplement implements IUsuarioService {
    private final IUsuarioRepository uR;

    public UsuarioServiceImplement(IUsuarioRepository uR) { this.uR = uR; }

    @Override public void insert(Usuario u) { uR.save(u); }
    @Override public List<Usuario> list() { return uR.findAll(); }
    @Override public List<Usuario> listByEntidad(Long idEntidad) { return uR.findByEntidad_IdEntidad(idEntidad); }
    @Override public Optional<Usuario> listId(Long id) { return uR.findById(id); }
}
