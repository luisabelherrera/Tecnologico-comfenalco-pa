# Proyecto de Aula: Institución Educativa El Hobo

Este repositorio contiene el código fuente y la documentación del sistema de gestión educativa desarrollado para la **Institución Educativa El Hobo**. El proyecto forma parte del quinto semestre del programa tecnológico en Comfenalco.

## Tecnologías Utilizadas

- **Spring Boot**: Framework para el backend.
- **Angular 13.0.3**: Framework para el frontend.
- **PostgreSQL**: Base de datos relacional.
- **MongoDB**: Base de datos NoSQL utilizada para el chat en tiempo real.
- **WebSockets**: Tecnología utilizada para la mensajería en tiempo real.

## Requerimientos Funcionales

### Gestión de Estudiantes
- **Registrar, Consultar, Modificar y Eliminar Estudiantes**: Gestión completa de los registros de estudiantes.

### Gestión de Profesores
- **Registrar, Consultar, Modificar y Eliminar Profesores**: Gestión completa de los registros de profesores.

### Gestión de Cursos
- **Crear, Consultar, Modificar y Eliminar Cursos**: Administración de cursos incluyendo asignación de aulas y profesores.

### Gestión de Aulas
- **Registrar, Consultar, Modificar y Eliminar Aulas**: Gestión de las aulas disponibles en la institución.

### Asignaciones de Aulas
- **Registrar, Consultar y Modificar Asignaciones**: Gestión de la asignación de aulas para cursos.

### Gestión de Inscripciones
- **Registrar, Consultar y Modificar Inscripciones**: Manejo de la inscripción de estudiantes en cursos.

### Gestión de Tutores
- **Registrar, Consultar, Modificar y Eliminar Tutores**: Administración de los tutores asignados a estudiantes.

### Gestión de Departamentos
- **Registrar, Consultar, Modificar y Eliminar Departamentos**: Gestión de departamentos académicos.

### Chat en Tiempo Real
- **Autenticación, Mensajería y Historial**: Sistema de chat en tiempo real con almacenamiento de mensajes.

## Estructura de la Base de Datos

El proyecto utiliza una base de datos relacional con PostgreSQL para la mayoría de las funcionalidades, y MongoDB para el almacenamiento del historial de mensajes del chat.

## Inicialización del Proyecto

### Prerrequisitos

- Node.js y npm instalados.
- Java JDK 8 o superior.
- PostgreSQL y MongoDB instalados y configurados.

### Instalación

1. **Clonar el repositorio**:

    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2. **Backend**:
    - Navegar al directorio `backend` y ejecutar el siguiente comando para construir el proyecto:

        ```bash
        ./mvnw clean install
        ```

    - Configurar la base de datos en `src/main/resources/application.properties`.
    - Ejecutar el servidor con:

        ```bash
        ./mvnw spring-boot:run
        ```

3. **Frontend**:
    - Navegar al directorio `frontend` e instalar las dependencias:

        ```bash
        npm install
        ```

    - Ejecutar la aplicación Angular:

        ```bash
        ng serve
        ```

### Enlaces Útiles

- [Google Fonts - Iconos](https://fonts.google.com/icons)
- [Angular Material](https://material.angular.io/)

### Diagrama de Relaciones

![Diagrama de Relaciones](https://github.com/user-attachments/assets/3434e7ef-b768-42d8-bbb0-7be06b31a163)

## Capturas de Pantalla

### Login
![Interfaz de Login](https://github.com/user-attachments/assets/1d577462-e3ef-487f-bc86-b4943ae4449a)

### Dashboard
![Vista del Dashboard](https://github.com/user-attachments/assets/033efc0e-0cd8-47b5-b0e5-4c6833cf3258)

### Chat en Tiempo Real
![Interfaz del Chat](https://github.com/user-attachments/assets/de6b66ce-555c-4edf-a6d7-a002a5657a95)

