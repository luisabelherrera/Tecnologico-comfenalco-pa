package com.example.demo.services.userservice.impl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.JwtResponseDto;
import com.example.demo.dto.LoginDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.dto.UserDto;
import com.example.demo.exceptions.ConflictException;
import com.example.demo.exceptions.JwtAuthenticationException;
import com.example.demo.exceptions.NotFoundException;
import com.example.demo.model.entity.Docente;
import com.example.demo.model.entity.Estudiante;
import com.example.demo.model.login.Rol;
import com.example.demo.model.login.UserEntity;
import com.example.demo.repositories.UserRepository;
import com.example.demo.security.JwtGenerator;
import com.example.demo.services.userservice.RolService;
import com.example.demo.services.userservice.UserService;

import jakarta.validation.Valid;

@Service
public class UserServiceImple implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImple.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolService rolService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtGenerator jwtGenerator;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDto register(@Valid RegisterDto registerDto) {
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            logger.warn("Attempted to register an existing user: {}", registerDto.getEmail());
            throw new ConflictException("El usuario existe!");
        }

        UserEntity user = new UserEntity();
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setEmail(registerDto.getEmail());

        Set<Rol> roles = registerDto.getRoles().stream()
                .map(rol -> rolService.findByname(rol.getName())
                        .orElseThrow(() -> new NotFoundException("Rol no encontrado: " + rol.getName())))
                .collect(Collectors.toSet());
        user.setRoles(roles);

        if (registerDto.getDocente() != null) {
            Docente docente = new Docente();
            docente.setCodigo(registerDto.getDocente().getCodigo());
            docente.setDocumentoIdentidad(registerDto.getDocente().getDocumentoIdentidad());
            docente.setNombres(registerDto.getDocente().getNombres());
            docente.setApellidos(registerDto.getDocente().getApellidos());
            user.setDocente(docente);
        }

        if (registerDto.getEstudiante() != null) {
            Estudiante estudiante = new Estudiante();
            estudiante.setCodigo(registerDto.getEstudiante().getCodigo());
            estudiante.setDocumentoIdentidad(registerDto.getEstudiante().getDocumentoIdentidad());
            estudiante.setNombres(registerDto.getEstudiante().getNombres());
            estudiante.setApellidos(registerDto.getEstudiante().getApellidos());
            user.setEstudiante(estudiante);
        }

        userRepository.save(user);
        logger.info("User registered: {}", user.getEmail());

        return new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRoles());
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<UserEntity> users = userRepository.findAll();
        List<UserDto> userDtos = users.stream().map(user -> {
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setUsername(user.getUsername());
            userDto.setEmail(user.getEmail());
            userDto.setRoles(user.getRoles());
            return userDto;
        }).collect(Collectors.toList());

        return userDtos;
    }

    @Override
    public void deleteUserById(Long id) throws NotFoundException {
        logger.info("Deleting user with ID: {}", id);
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));

        userRepository.delete(user);
        logger.info("Deleted user with ID: {}", id);
    }

    @Override
    public JwtResponseDto login(LoginDto loginDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getEmail(),
                            loginDto.getPassword()));

            String token = jwtGenerator.generateToken(authentication);
            List<String> roles = authentication.getAuthorities().stream()
                    .map(auth -> auth.getAuthority())
                    .collect(Collectors.toList());

            String username = ((User) authentication.getPrincipal()).getUsername();

            return new JwtResponseDto(token, username, roles);
        } catch (AuthenticationException e) {
            logger.warn("Invalid login attempt for email: {}", loginDto.getEmail());
            throw new JwtAuthenticationException("Credenciales inválidas");
        }
    }

    @Override
    public UserDto getLoguedUser(HttpHeaders headers) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((User) authentication.getPrincipal()).getUsername();

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        UserDto userDto = new UserDto();
        userDto.setEmail(user.getEmail());
        userDto.setUsername(user.getUsername());
        userDto.setRoles(user.getRoles());
        return userDto;
    }
}
