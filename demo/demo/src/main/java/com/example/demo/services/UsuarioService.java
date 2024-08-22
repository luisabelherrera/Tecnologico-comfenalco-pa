package com.example.demo.services;


import com.example.demo.model.entities.Usuario;

public interface UsuarioService {
    void registrar(Usuario usuario);
    Usuario findByUserAndPassword(String usuario, String clave);
    Usuario findByUserName(String usuario);

    String getNombreAdministrador();
}