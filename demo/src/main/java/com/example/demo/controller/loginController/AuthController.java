package com.example.demo.controller.loginController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.example.demo.model.login.dto.JwtResponseDto;
import com.example.demo.model.login.dto.LoginDto;
import com.example.demo.model.login.dto.UserDto;
import com.example.demo.security.JwtGenerator;
import com.example.demo.services.userservice.RolService;
import com.example.demo.services.userservice.UserService;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;
    @Autowired
    private RolService rolService;
    @Autowired
    private JwtGenerator jwtGenerator;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
            JwtResponseDto response = userService.login(loginDto);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Correo electrónico o contraseña inválidos");
        } catch (Exception e) {

            logger.error("Error de inicio de sesión: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ocurrió un error durante el inicio de sesión");
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToke(Authentication authentication) {
        String token = jwtGenerator.refreshToken(authentication);
        JwtResponseDto jwtRefresh = new JwtResponseDto(token);
        return new ResponseEntity<>(jwtRefresh, HttpStatus.OK);
    }

    @GetMapping("/logued")
    public ResponseEntity<UserDto> getLoguedUser(@RequestHeader HttpHeaders headers) {
        return new ResponseEntity<>(userService.getLoguedUser(headers), HttpStatus.OK);
    }
}
