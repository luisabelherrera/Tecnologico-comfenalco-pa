package com.example.demo.model.login;

import java.util.Set;

import com.example.demo.model.entity.Docente;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String email;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_rol", joinColumns = @JoinColumn(name = "id_user"), inverseJoinColumns = @JoinColumn(name = "id_rol"))
    private Set<Rol> roles;


    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Docente docente;


    public UserEntity(Long id, String username, String password, String email, Set<Rol> roles) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
    }

    public UserEntity() {
    }

}
