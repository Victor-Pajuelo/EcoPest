package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.Usuario;
import pe.edu.upc.ecopest.repositories.IUsuarioRepository;

@Service
public class JwtUserDetailsService implements UserDetailsService {
    private final IUsuarioRepository uR;

    public JwtUserDetailsService(IUsuarioRepository uR) {
        this.uR = uR;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = uR.findByEmailUsuario(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        return User.builder()
                .username(usuario.getEmailUsuario())
                .password(usuario.getPasswordUsuario())
                .authorities(usuario.getRol().getNameRol())
                .disabled(!usuario.isStatusUsuario())
                .build();
    }
}