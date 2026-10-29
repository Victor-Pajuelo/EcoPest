package pe.edu.upc.ecopest.controllers;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.upc.ecopest.dtos.MeDTO;
import pe.edu.upc.ecopest.entities.User;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.repositories.IUserRepository;

@RestController
@RequestMapping("/api/me")
public class MeController {

    private final IUserRepository userRepository;

    public MeController(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Operation(summary = "Usuario autenticado", description = "Devuelve el id, nombre, correo, rol y empresa del usuario del token JWT.")
    @GetMapping
    public ResponseEntity<MeDTO> me(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(new MeDTO(
                user.getIdUser(),
                user.getName(),
                user.getEmail(),
                user.getRole().getName(),
                user.getBusinessEntity() == null ? null : user.getBusinessEntity().getIdBusinessEntity()));
    }
}
