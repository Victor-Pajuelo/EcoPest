package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.UsuarioDTO;
import pe.edu.upc.ecopest.dtos.UserResponseDTO;
import pe.edu.upc.ecopest.entities.Entidad;
import pe.edu.upc.ecopest.entities.Rol;
import pe.edu.upc.ecopest.entities.Usuario;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IEntidadService;
import pe.edu.upc.ecopest.servicesinterfaces.IRolService;
import pe.edu.upc.ecopest.servicesinterfaces.IUsuarioService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final IUsuarioService uS;
    private final IRolService rS;
    private final IEntidadService eS;
    private final ModelMapper modelMapper;

    public UsuarioController(IUsuarioService uS, IRolService rS, IEntidadService eS, ModelMapper modelMapper) {
        this.uS = uS; this.rS = rS; this.eS = eS; this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> listar() {
        List<UserResponseDTO> lista = uS.list()
                .stream().map(this::toResponseDTO).toList();
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> registrar(@Valid @RequestBody UsuarioDTO dto) {
        Rol rol = rS.listId(dto.getIdRol())
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra el rol"));
        Entidad entidad = eS.listId(dto.getIdEntidad())
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra la entidad"));
        Usuario usuario = modelMapper.map(dto, Usuario.class);
        usuario.setRol(rol);
        usuario.setEntidad(entidad);
        uS.insert(usuario);
        UserResponseDTO responseDTO = toResponseDTO(usuario);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(usuario.getIdUsuario()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping("/por-entidad")
    public ResponseEntity<List<UserResponseDTO>> buscarPorEntidad(@RequestParam Long idEntidad) {
        List<UserResponseDTO> lista = uS.listByEntidad(idEntidad)
                .stream().map(this::toResponseDTO).toList();
        return ResponseEntity.ok(lista);
    }

    private UserResponseDTO toResponseDTO(Usuario usuario) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setNameUsuario(usuario.getNameUsuario());
        dto.setEmailUsuario(usuario.getEmailUsuario());
        if (usuario.getRol() != null) {
            dto.setIdRol(usuario.getRol().getIdRol());
            dto.setNombreRol(usuario.getRol().getNameRol());
        }
        return dto;
    }
}
