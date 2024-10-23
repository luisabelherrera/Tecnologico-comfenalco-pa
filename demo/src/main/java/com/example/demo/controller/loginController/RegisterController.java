package com.example.demo.controller.loginController;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.exceptions.ConflictException;
import com.example.demo.exceptions.NotFoundException;
import com.example.demo.model.login.Rol;
import com.example.demo.model.login.dto.RegisterDto;
import com.example.demo.model.login.dto.UserDto;
import com.example.demo.services.userservice.RolService;
import com.example.demo.services.userservice.UserService;

import jakarta.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("/api/register")
public class RegisterController {

    @Autowired
    private UserService userService;

    @Autowired
    private RolService rolService;

    private static final Logger logger = LoggerFactory.getLogger(RegisterController.class);

    @PostMapping
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterDto registerDto) {
        if (registerDto.getRoles() == null || registerDto.getRoles().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "¡Los roles deben ser proporcionados!"));
        }

        try {
            userService.register(registerDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "¡Usuario registrado exitosamente!"));
        } catch (ConflictException e) {
            logger.error("Conflicto al registrar usuario: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (NotFoundException e) {
            logger.error("No encontrado al registrar usuario: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            logger.error("Error interno del servidor al registrar usuario: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error interno del servidor"));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        logger.info("Intentando eliminar usuario con ID: {}", id);
        try {
            userService.deleteUserById(id);
            return ResponseEntity.ok(new ApiResponse(true, "¡Usuario eliminado exitosamente!"));
        } catch (NotFoundException e) {
            logger.error("Usuario no encontrado al intentar eliminar: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            logger.error("Error interno del servidor al eliminar usuario: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error interno del servidor"));
        }
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Rol>> getAllRoles() {
        List<Rol> roles = rolService.findAll();
        return ResponseEntity.ok(roles);
    }
    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Long id, @Valid @RequestBody RegisterDto updateDto) {
        try {
            userService.updateUser(id, updateDto);
            return ResponseEntity.ok(new ApiResponse(true, "¡Usuario actualizado exitosamente!"));
        } catch (NotFoundException e) {
            logger.error("Usuario no encontrado al intentar actualizar: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (ConflictException e) {
            logger.error("Conflicto al actualizar usuario: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            logger.error("Error interno del servidor al actualizar usuario: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error interno del servidor"));
        }
    }

    @PostMapping("/roles")
    public ResponseEntity<ApiResponse> createRole(@RequestBody Rol rol) {
        try {
            Rol newRole = rolService.save(rol);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "¡Rol creado exitosamente!"));
        } catch (ConflictException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error interno del servidor"));
        }
    }

    public static class ApiResponse {
        private boolean success;
        private String message;

        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }
    }
}
