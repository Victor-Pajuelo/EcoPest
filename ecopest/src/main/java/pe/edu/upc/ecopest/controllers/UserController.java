package pe.edu.upc.ecopest.controllers;

import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.edu.upc.ecopest.dtos.UserDTO;
import pe.edu.upc.ecopest.entities.BusinessEntity;
import pe.edu.upc.ecopest.entities.Role;
import pe.edu.upc.ecopest.entities.User;
import pe.edu.upc.ecopest.exceptions.ResourceNotFoundException;
import pe.edu.upc.ecopest.servicesinterfaces.IBusinessEntityService;
import pe.edu.upc.ecopest.servicesinterfaces.IRoleService;
import pe.edu.upc.ecopest.servicesinterfaces.IUserService;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final IUserService userService;
    private final IRoleService roleService;
    private final IBusinessEntityService businessEntityService;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    public UserController(IUserService userService, IRoleService roleService, IBusinessEntityService businessEntityService, ModelMapper modelMapper, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.businessEntityService = businessEntityService;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> list() {
        return ResponseEntity.ok(userService.list().stream().map(item -> modelMapper.map(item, UserDTO.class)).toList());
    }

    @PostMapping
    public ResponseEntity<UserDTO> register(@Valid @RequestBody UserDTO dto) {
        Role role = roleService.findById(dto.getRoleId()).orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        BusinessEntity businessEntity = businessEntityService.findById(dto.getBusinessEntityId())
                .orElseThrow(() -> new ResourceNotFoundException("Business entity not found"));
        User user = modelMapper.map(dto, User.class);
        user.setRole(role);
        user.setBusinessEntity(businessEntity);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        userService.insert(user);
        UserDTO responseDTO = modelMapper.map(user, UserDTO.class);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(user.getIdUser()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping("/by-business-entity")
    public ResponseEntity<List<UserDTO>> findByBusinessEntity(@RequestParam Long businessEntityId) {
        return ResponseEntity.ok(userService.listByBusinessEntity(businessEntityId).stream().map(item -> modelMapper.map(item, UserDTO.class)).toList());
    }
}