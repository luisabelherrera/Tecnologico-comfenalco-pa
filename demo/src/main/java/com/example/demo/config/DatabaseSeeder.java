package com.example.demo.config;

import com.example.demo.model.login.Rol;
import com.example.demo.model.login.UserEntity;
import net.datafaker.Faker;
import com.example.demo.model.entity.*;
import com.example.demo.repositories.jpa.*; 
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

@Component
@ConditionalOnProperty(name = "app.seeder.enabled", havingValue = "true")
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final EstudianteRepository estudianteRepository;
    private final DocenteRepository docenteRepository;
    private final CursoRepository cursoRepository;
    private final PeriodoRepository periodoRepository;
    private final NivelRepository nivelRepository;
    private final GradoSeccionRepository gradoSeccionRepository;
    private final PasswordEncoder passwordEncoder;

    private final Faker faker = new Faker(new Locale("es", "CO"));

    @Override
    public void run(String... args) throws Exception {
        if (0 < userRepository.count()) {
            log.info("La base de datos ya contiene registros. Omitiendo el Seeder.");
            return;
        }

        log.info("Iniciando la generación de datos de prueba con Datafaker...");

        Rol rolAdmin = new Rol();
        rolAdmin.setName("ROLE_ADMIN");
        rolAdmin = roleRepository.save(rolAdmin);

        Rol rolDocente = new Rol();
        rolDocente.setName("ROLE_DOCENTE");
        rolDocente = roleRepository.save(rolDocente);

        Rol rolEstudiante = new Rol();
        rolEstudiante.setName("ROLE_ESTUDIANTE");
        rolEstudiante = roleRepository.save(rolEstudiante);

        // 1. Periodo y Nivel
        Periodo periodo = new Periodo();
        periodo.setDescripcion("Periodo Académico 2026-I");
        periodo.setFechaInicio(LocalDate.now().minusMonths(1));
        periodo.setFechaFin(LocalDate.now().plusMonths(5));
        periodo.setActivo(true);
        periodo = periodoRepository.save(periodo);

        Nivel nivel = new Nivel();
        nivel.setDescripcionNivel("Bachillerato");
        nivel.setDescripcionTurno("Mañana");
        nivel.setHoraInicio(LocalTime.of(7, 0));
        nivel.setHoraFin(LocalTime.of(13, 0));
        nivel.setPeriodo(periodo);
        nivel.setActivo(true);
        nivelRepository.save(nivel);

        // 2. Grado y Sección
        GradoSeccion gradoSeccion = new GradoSeccion();
        gradoSeccion.setDescripcionGrado("10mo Grado");
        gradoSeccion.setDescripcionSeccion("Sección A");
        gradoSeccion.setActivo(true);
        gradoSeccionRepository.save(gradoSeccion);

        // 3. Cursos
        String[] cursosNombres = {"Matemáticas", "Física", "Programación", "Historia", "Lenguaje", "Inglés"};
        for (String nombre : cursosNombres) {
            Curso curso = new Curso();
            curso.setDescripcion(nombre);
            curso.setActivo(true);
            cursoRepository.save(curso);
        }

        // 4. Docentes
        for (int i = 0; i < 5; i++) {
            UserEntity newUser = new UserEntity();
            newUser.setUsername(faker.name().username() + "_doc");
            newUser.setEmail(faker.internet().emailAddress());
            newUser.setPassword(passwordEncoder.encode("123456")); 
            Set<Rol> roles = new HashSet<>();
            roles.add(rolDocente);
            newUser.setRoles(roles);
            UserEntity savedUser = userRepository.save(newUser);

            Docente docente = new Docente();
            docente.setNombres(faker.name().firstName());
            docente.setApellidos(faker.name().lastName());
            docente.setDocumentoIdentidad(faker.number().digits(10));
            docente.setCodigo("DOC-" + faker.number().numberBetween(1000, 9999));
            docente.setValorCodigo(i + 1);
            docente.setSexo(faker.options().option("M", "F"));
            docente.setGradoEstudio(faker.options().option("Magister", "Doctorado", "Licenciado"));
            docente.setCiudad("Cartagena");
            docente.setDireccion(faker.address().streetAddress());
            docente.setEmail(savedUser.getEmail());
            docente.setNumeroTelefono(faker.phoneNumber().cellPhone());
            
            LocalDate birthday = faker.date().birthday(25, 60).toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            docente.setFechaNacimiento(birthday);
            
            docente.setActivo(true);
            docente.setUser(savedUser);
            docenteRepository.save(docente);
        }

        // 5. Estudiantes
        for (int i = 0; i < 50; i++) {
            UserEntity newUser = new UserEntity();
            newUser.setUsername(faker.name().username() + "_est");
            newUser.setEmail(faker.internet().emailAddress());
            newUser.setPassword(passwordEncoder.encode("123456")); 
            
            Set<Rol> roles = new HashSet<>();
            roles.add(rolEstudiante);
            newUser.setRoles(roles);

            UserEntity savedUser = userRepository.save(newUser);

            Estudiante estudiante = new Estudiante();
            estudiante.setActivo(true);
            estudiante.setNombres(faker.name().firstName());
            estudiante.setApellidos(faker.name().lastName());
            estudiante.setCiudad("Cartagena");
            estudiante.setDireccion(faker.address().streetAddress());
            estudiante.setDocumentoIdentidad(faker.number().digits(10));

            LocalDate birthday = faker.date().birthday(10, 18).toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            estudiante.setFechaNacimiento(birthday);

            estudiante.setSexo(faker.options().option("M", "F"));
            estudiante.setCodigo("EST-" + faker.number().numberBetween(1000, 9999));
            estudiante.setValorCodigo(i + 1);

            estudiante.setUser(savedUser);

            estudianteRepository.save(estudiante);
        }

        // 6. Admin
        UserEntity adminUser = new UserEntity();
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@admin.com");
        adminUser.setPassword(passwordEncoder.encode("admin123"));
        Set<Rol> adminRoles = new HashSet<>();
        adminRoles.add(rolAdmin);
        adminUser.setRoles(adminRoles);
        userRepository.save(adminUser);

        log.info("¡Generación de datos finalizada con éxito! Se insertaron estudiantes, docentes, cursos, nivel, y un usuario admin.");
    }
}