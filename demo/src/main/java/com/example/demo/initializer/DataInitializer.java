package com.example.demo.initializer;

import java.util.Arrays;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.model.entity.Docente;
import com.example.demo.model.login.Rol;
import com.example.demo.model.login.UserEntity;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.repositories.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public void run(String... args) throws Exception {

        if (roleRepository.count() == 0) {
            Rol docenteRole = new Rol();
            docenteRole.setName("Docente");
            roleRepository.save(docenteRole);

            Rol estudianteRole = new Rol();
            estudianteRole.setName("Estudiante");
            roleRepository.save(estudianteRole);

            Rol adminRole = new Rol();
            adminRole.setName("Administracion");
            roleRepository.save(adminRole);
        }

        if (userRepository.count() == 0) {
            Rol adminRole = roleRepository.findByName("Administracion")
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

            UserEntity adminUser = new UserEntity();
            adminUser.setUsername("abel");
            adminUser.setEmail("abel@example.com");
            adminUser.setPassword(passwordEncoder.encode("abel"));
            adminUser.setRoles(new HashSet<>(Arrays.asList(adminRole)));

            userRepository.save(adminUser);
        }

        if (userRepository.count() == 1) {
            Rol docenteRole = roleRepository.findByName("Docente")
                    .orElseThrow(() -> new RuntimeException("Rol Docente no encontrado"));

            UserEntity docenteUser1 = new UserEntity();
            docenteUser1.setUsername("docente1");
            docenteUser1.setEmail("docente1@example.com");
            docenteUser1.setPassword(passwordEncoder.encode("docente1"));
            docenteUser1.setRoles(new HashSet<>(Arrays.asList(docenteRole)));

            Docente docente1 = new Docente();
            docente1.setNombres("NombreDocente1");
            docente1.setApellidos("ApellidoDocente1");

            userRepository.save(docenteUser1);      }

        if (userRepository.count() == 2) {
            Rol docenteRole = roleRepository.findByName("Docente")
                    .orElseThrow(() -> new RuntimeException("Rol Docente no encontrado"));

            UserEntity docenteUser2 = new UserEntity();
            docenteUser2.setUsername("docente2");
            docenteUser2.setEmail("docente2@example.com");
            docenteUser2.setPassword(passwordEncoder.encode("docente2"));
            docenteUser2.setRoles(new HashSet<>(Arrays.asList(docenteRole)));

            userRepository.save(docenteUser2);
        }
    }
}
