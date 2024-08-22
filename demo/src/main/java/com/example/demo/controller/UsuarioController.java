package com.example.demo.controller;


import com.example.demo.model.dto.RegistroUsuario;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.ui.Model;

import com.example.demo.model.dto.Login;
import com.example.demo.model.entities.Usuario;
import com.example.demo.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;


    @PostMapping("/process/login")
    public String login(@ModelAttribute Login login, Model model, HttpServletResponse response) {
        Usuario usuario = usuarioService.findByUserAndPassword(login.getUser(), login.getPassword());
        if (usuario != null) {
            model.addAttribute("usuario", usuario);

            Cookie cookie = new Cookie("username", usuario.getNombre());
            cookie.setSecure(true);
            cookie.setHttpOnly(true);
            cookie.setMaxAge(3600);
            cookie.setPath("/");
            response.addCookie(cookie);

            return "Administrador/html/ventanaprincipalAdmin";
        } else {
            model.addAttribute("error", "Nombre de usuario o contraseña incorrectos.");
            return "login/Inicio";
        }
    }



    @GetMapping("/pagina-principal")
    public String paginaPrincipal(HttpSession session, Model model) {
        String nombreUsuario = (String) session.getAttribute("nombreUsuario");
        if (nombreUsuario != null) {

            model.addAttribute("nombreUsuario", nombreUsuario);
            return "Administrador/html/ventanaprincipalAdmin";
        } else {
            return "redirect:/usuario/login";
        }
    }



    @GetMapping("/login")
    public String crearFormLogin(Model model) {
        model.addAttribute("login", new Login());
        return "login/Inicio";
    }



    @PostMapping("/process/registro")
    public String registrarUsuario(@ModelAttribute RegistroUsuario registroUsuario, Model model) {
        try {

            Usuario usuarioExistente = usuarioService.findByUserName(registroUsuario.getUsuario());
            if (usuarioExistente != null) {
                model.addAttribute("error", "El nombre de usuario ya está en uso. Por favor, elige otro.");
                return "Administrador/html/Usuario/CrearUsuario";
            }

            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setNombre(registroUsuario.getNombre());
            nuevoUsuario.setUsuario(registroUsuario.getUsuario());
            nuevoUsuario.setClave(registroUsuario.getClave());


            usuarioService.registrar(nuevoUsuario);

            model.addAttribute("mensaje", "Usuario registrado con éxito. Ahora puedes iniciar sesión.");
            return "Administrador/html/Usuario/CrearUsuario";
        } catch (Exception e) {
            model.addAttribute("error", "Hubo un problema al registrar el usuario. Inténtalo de nuevo.");
            return "Administrador/html/Usuario/CrearUsuario";
        }
    }


    @GetMapping("/registro")
    public String crearFormRegistro(Model model) {
        model.addAttribute("registroUsuario", new RegistroUsuario());
        return "Administrador/html/Usuario/CrearUsuario";
    }
}