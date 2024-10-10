package com.example.demo.initializer;

import java.util.Arrays;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

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

    @Override
    public void run(String... args) throws Exception {
        // Check and create roles if they don't exist
        if (roleRepository.count() == 0) {
            Rol docente = new Rol();
            docente.setName("Docente");
            roleRepository.save(docente);

            Rol estudiante = new Rol();
            estudiante.setName("Estudiante");
            roleRepository.save(estudiante);

            Rol administracion = new Rol();
            administracion.setName("Administracion");
            roleRepository.save(administracion);
        }

        // Save user with existing role
        if (userRepository.count() == 0) {
            Rol adminRole = roleRepository.findByName("Administracion")
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

            UserEntity adminUser = new UserEntity();
            adminUser.setUsername("abel");
            adminUser.setEmail("abel");
            adminUser.setPassword(passwordEncoder.encode("abel"));
            adminUser.setRoles(new HashSet<>(Arrays.asList(adminRole))); // Use existing role

            userRepository.save(adminUser);
        }
    }

}