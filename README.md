# Proyecto de Aula: Institución Educativa El Hobo

## Introducción

Este proyecto está destinado a una institución educativa ubicada en El Carmen de Bolívar, corregimiento El Hobo. Forma parte del proyecto de aula para el quinto semestre del programa tecnológico en Comfenalco.

## Tecnologías Utilizadas

- **Spring Boot**: Para el desarrollo del backend.
- **Angular 13.0.3**: Para el desarrollo del frontend.
- **PostgreSQL**: Como sistema de gestión de bases de datos.


### Requerimiento Funcionales

##Gestión de Estudiantes:
Registrar Estudiantes: El sistema debe permitir la creación de registros de estudiantes con información como nombre, apellido, dirección, correo electrónico, fecha de nacimiento, grado y tutor asignado.
Consultar, Modificar y Eliminar: Debe permitir consultar, modificar y eliminar registros de estudiantes.
Gestión de Profesores:

##Registrar Profesores:
El sistema debe permitir registrar profesores con datos como nombre, apellido, especialidad, correo electrónico, teléfono y departamento asignado.
Consultar, Modificar y Eliminar: Debe permitir consultar, modificar y eliminar registros de profesores.

##Gestión de Cursos:
Crear Cursos:El sistema debe permitir la creación de cursos con nombre, descripción, horario, aula asignada y profesor asignado.
Consultar, Modificar y Eliminar: Debe permitir consultar, modificar y eliminar registros de cursos.

##Gestión de Aulas:
Registrar Aulas: El sistema debe permitir registrar aulas con capacidad, nombre y ubicación.
Consultar, Modificar y Eliminar: Debe permitir consultar, modificar y eliminar registros de aulas.

##Asignaciones de Aulas:
Registrar Asignaciones de Aulas: Debe permitir registrar asignaciones de aulas para cursos específicos, incluyendo el día de la semana, hora de inicio y hora de fin.
Consultar y Modificar: Debe permitir consultar y modificar las asignaciones de aulas.

##Gestión de Inscripciones:
Registrar Inscripciones: El sistema debe permitir registrar la inscripción de estudiantes en cursos específicos, incluyendo calificación y fecha de inscripción.
Consultar y Modificar: Debe permitir consultar y modificar registros de inscripciones.

##Gestión de Tutores:
Registrar Tutores: El sistema debe permitir registrar tutores con nombre, apellido, correo electrónico y teléfono.
Consultar, Modificar y Eliminar: Debe permitir consultar, modificar y eliminar registros de tutores.

##Gestión de Departamentos:
Registrar Departamentos: Debe permitir registrar departamentos con nombre y descripción.
Consultar, Modificar y Eliminar: Debe permitir consultar, modificar y eliminar registros de departamentos.

##Chat en Tiempo Real:
Autenticación: El sistema debe permitir a los usuarios iniciar sesión para acceder al chat.
Mensajería en Tiempo Real: Los usuarios deben poder enviar y recibir mensajes en tiempo real.
Historial de Mensajes: El chat debe almacenar el historial de mensajes para que los usuarios puedan ver las conversaciones anteriores.
Gestión de Usuarios:
Registrar Usuarios: Debe permitir la creación de usuarios con nombre, usuario y clave.
Autenticación y Autorización: Debe gestionar el inicio de sesión y el control de acceso basado en roles.




## Estructura de la Base de Datos

A continuación se muestra el diagrama de relaciones de la base de datos (ERD):

![Diagrama de Relaciones](https://github.com/user-attachments/assets/3434e7ef-b768-42d8-bbb0-7be06b31a163)

)

## Etapa 1 

Creacion de login

creacion del header y columna 

![image](https://github.com/user-attachments/assets/1d577462-e3ef-487f-bc86-b4943ae4449a)

)
![image-1](https://github.com/user-attachments/assets/f08e4402-1512-451a-8d6c-4e8eaf6950ea)
)
![image-2](https://github.com/user-attachments/assets/033efc0e-0cd8-47b5-b0e5-4c6833cf3258)
)

## Etapa 2



Mejoramiento de las Rutas: Se han refinado las rutas y la navegación en la aplicación para una experiencia de usuario más fluida y coherente.

Chat en Tiempo Real: Se ha integrado un sistema de chat en tiempo real utilizando WebSockets y MongoDB como base de datos para almacenar los mensajes y gestionar la comunicación en tiempo real.

![image-3](https://github.com/user-attachments/assets/de6b66ce-555c-4edf-a6d7-a002a5657a95)

)


![image-4](https://github.com/user-attachments/assets/ec0a765b-160b-4be9-bd53-10b894311a2e)

![image-5](https://github.com/user-attachments/assets/308422b3-a353-408b-a556-38e0096f7cb0)



## Inicialización del Proyecto

### Enlaces Útiles

- [Google Fonts - Iconos](https://fonts.google.com/icons)
- [Angular Material](https://material.angular.io/)

### Pasos para la Inicialización

1. Clonar el repositorio del proyecto.
2. Navegar al directorio del proyecto.
3. Instalar las dependencias con `npm`:

   ```bash
   cd <nombre-del-directorio>
   npm install
