package com.example.demo.dev;

import com.example.demo.model.login.Rol;
import com.example.demo.model.login.UserEntity;
import com.example.demo.repositories.jpa.RoleRepository;
import com.example.demo.repositories.jpa.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, RoleRepository rolRepository) {
        return args -> {

            Rol adminRole = rolRepository.findByName("Administracion").orElseGet(() -> {
                Rol role = new Rol();
                role.setName("Administracion");
                return rolRepository.save(role);
            });

            Rol docenteRole = rolRepository.findByName("Docente").orElseGet(() -> {
                Rol role = new Rol();
                role.setName("Docente");
                return rolRepository.save(role);
            });

            Rol estudianteRole = rolRepository.findByName("Estudiante").orElseGet(() -> {
                Rol role = new Rol();
                role.setName("Estudiante");
                return rolRepository.save(role);
            });

            if (!userRepository.existsByEmail("admin@example.com")) {
                UserEntity adminUser = new UserEntity();
                adminUser.setUsername("admin");
                adminUser.setEmail("admin@example.com");
                adminUser.setPassword(new BCryptPasswordEncoder().encode("admin_password"));
                adminUser.setRoles(Set.of(adminRole));
                userRepository.save(adminUser);
                System.out.println("Admin user created: admin@example.com / admin_password");
            } else {
                System.out.println("Admin user already exists.");
            }

            if (!userRepository.existsByEmail("docente@example.com")) {
                UserEntity docenteUser = new UserEntity();
                docenteUser.setUsername("docente");
                docenteUser.setEmail("docente@example.com");
                    docenteUser.setPassword(new BCryptPasswordEncoder().encode("docente_password"));
                docenteUser.setRoles(Set.of(docenteRole));
                userRepository.save(docenteUser);
                System.out.println("Docente user created: docente@example.com / docente_password");
            } else {
                System.out.println("Docente user already exists.");
            }

            if (!userRepository.existsByEmail("estudiante@example.com")) {
                UserEntity estudianteUser = new UserEntity();
                estudianteUser.setUsername("estudiante");
                estudianteUser.setEmail("estudiante@example.com");
                estudianteUser.setPassword(new BCryptPasswordEncoder().encode("estudiante_password"));
                estudianteUser.setRoles(Set.of(estudianteRole));
                userRepository.save(estudianteUser);
                System.out.println("Estudiante user created: estudiante@example.com / estudiante_password");
            } else {
                System.out.println("Estudiante user already exists.");
            }
        };
    }
}
