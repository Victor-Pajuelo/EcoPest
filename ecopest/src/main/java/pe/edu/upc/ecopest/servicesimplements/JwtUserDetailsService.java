package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.User;
import pe.edu.upc.ecopest.repositories.IUserRepository;

@Service
public class JwtUserDetailsService implements UserDetailsService {
    private final IUserRepository userRepository;

    public JwtUserDetailsService(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRole().getName())
                .disabled(!user.isActive())
                .build();
    }
}