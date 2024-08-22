package com.example.demo.services.impl;

import com.example.demo.model.entities.Usuario;
import com.example.demo.repositories.UsuarioRepository;
import com.example.demo.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UsuarioServiceImpl implements UsuarioService {

    private static final String NOMBRE_ADMINISTRADOR = "ADMINISTRADOR";

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void registrar(Usuario usuario) {
        usuarioRepository.save(usuario);
    }

    @Override
    public Usuario findByUserAndPassword(String usuario, String clave) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findByUsuarioAndClave(usuario, clave);
        return optionalUsuario.orElse(null);
    }

    @Override
    public Usuario findByUserName(String usuario) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findByUsuario(usuario);
        return optionalUsuario.orElse(null);
    }

    @Override
    public String getNombreAdministrador() {
        return NOMBRE_ADMINISTRADOR;
    }

}