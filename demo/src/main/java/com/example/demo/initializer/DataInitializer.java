package com.example.demo.initializer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.model.login.Rol;
import com.example.demo.model.login.UserEntity;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.repositories.UserRepository;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        if (roleRepository.count() == 0) {
            Rol docente = new Rol();
            docente.setName("Docente");

            Rol estudiante = new Rol();
            estudiante.setName("Estudiante");

            Rol administracion = new Rol();
            administracion.setName("Administracion");

            List<Rol> defaultRoles = Arrays.asList(docente, estudiante, administracion);
            roleRepository.saveAll(defaultRoles);
        }

        if (userRepository.count() == 0) {
            Rol adminRole = roleRepository.findByName("Administracion")
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

            UserEntity adminUser = new UserEntity();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin");
            adminUser.setPassword(passwordEncoder.encode("admin"));
            adminUser.setRoles(new HashSet<>(Arrays.asList(adminRole)));

            userRepository.save(adminUser);
        }
    }
}
