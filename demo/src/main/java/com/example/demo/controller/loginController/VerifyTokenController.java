package com.example.demo.controller.loginController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.login.dto.UserDto;
import com.example.demo.services.service.EstudianteService;
import com.example.demo.services.userservice.UserService;

@CrossOrigin
@RestController
public class VerifyTokenController {

 @Autowired
    private UserService userService;


    @RequestMapping("/token")
    public String token() {
        return "Hola si funciona el token de acceso!";
    }

    @RequestMapping("/admin")
    public String admin() {
        return "Hola bienvenido Admin!";
    }

  

      @GetMapping("/estudiantee")
    public ResponseEntity<UserDto> getLoguedUser(@RequestHeader HttpHeaders headers) {
        UserDto userDto = userService.getLoguedUser(headers);
        return ResponseEntity.ok(userDto);
    }

    @RequestMapping("/docente")
    public String docente() {
        return "Hola bienvenido docente!";
    }
}
