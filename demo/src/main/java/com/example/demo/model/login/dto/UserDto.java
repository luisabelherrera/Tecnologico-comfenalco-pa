package com.example.demo.model.login.dto;

import java.util.Set;

import com.example.demo.model.entity.Docente;
import com.example.demo.model.entity.Estudiante;
import com.example.demo.model.login.Rol;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Set<Rol> roles;
    private String password;  // Agregar la contraseña aquí
private Estudiante estudiante; 
private Docente docente;

public Docente getDocente() {
    return docente;
}

public void setDocente(Docente docente) {
    this.docente = docente;
}
    public Estudiante getEstudiante() {
    return estudiante;
}

public void setEstudiante(Estudiante estudiante) {
    this.estudiante = estudiante;
}

    public UserDto() {
    }

    public UserDto(Long id, String username, String email, Set<Rol> roles, String password, 
    Estudiante estudiante, Docente docente) {
this.id = id;
this.username = username;
this.email = email;
this.roles = roles;
this.password = password;
this.estudiante = estudiante;
this.docente = docente;
}
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Set<Rol> getRoles() {
        return roles;
    }

    public void setRoles(Set<Rol> roles) {
        this.roles = roles;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "UserDto{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", roles=" + roles +
                ", password='" + password + '\'' +
                '}';
    }
}
