package com.example.demo.dto;

import java.util.Set;

import com.example.demo.model.entity.dto.DocenteDto;
import com.example.demo.model.entity.dto.EstudianteDto;
import com.example.demo.model.login.Rol;

public class RegisterDto {
    private Long id;
    private String username;
    private String email;
    private String password;
    private Set<Rol> roles; // Asegúrate de usar Set<Rol>
    private DocenteDto docente; // Field for Docente details
    private EstudianteDto estudiante; // Field for Estudiante details

    // Getters y Setters
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Rol> getRoles() {
        return roles;
    }

    public void setRoles(Set<Rol> roles) {
        this.roles = roles;
    }

    public DocenteDto getDocente() {
        return docente;
    }

    public void setDocente(DocenteDto docente) {
        this.docente = docente;
    }

    public EstudianteDto getEstudiante() {
        return estudiante; // Getter for Estudiante
    }

    public void setEstudiante(EstudianteDto estudiante) {
        this.estudiante = estudiante; // Setter for Estudiante
    }
}
