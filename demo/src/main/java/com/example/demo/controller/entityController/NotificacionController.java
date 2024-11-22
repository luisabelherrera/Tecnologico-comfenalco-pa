package com.example.demo.controller.entityController;

import com.example.demo.model.entity.dto.NotificacionDTO;
import com.example.demo.services.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @GetMapping
    public ResponseEntity<List<NotificacionDTO>> obtenerTodas() {
        try {
            List<NotificacionDTO> notificaciones = notificacionService.obtenerTodas();
            return ResponseEntity.ok(notificaciones);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/{id}/marcar-como-leida")
    public ResponseEntity<String> marcarComoLeida(@PathVariable String id) {
        try {
            NotificacionDTO notificacion = notificacionService.marcarComoLeida(id);
            if (notificacion == null) {
                return ResponseEntity.notFound().build(); // Si no existe, devuelve 404
            }
            return ResponseEntity.ok("Notificación marcada como leída.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al marcar como leída la notificación.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarNotificacion(@PathVariable String id) {
        try {
            notificacionService.eliminarNotificacion(id); // Llama al servicio para eliminar
            return ResponseEntity.ok("Notificación eliminada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al eliminar la notificación.");
        }
    }
    @PostMapping
    public ResponseEntity<String> enviarNotificacion(@RequestBody Map<String, String> mensaje) {
        String contenido = mensaje.get("mensaje");
        if (contenido == null || contenido.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El mensaje no puede estar vacío.");
        }

        // Lógica para procesar el mensaje
        NotificacionDTO notificacion = new NotificacionDTO(null, "Mensaje del Usuario", contenido, false, null);
        notificacionService.crearNotificacion(notificacion);

        return ResponseEntity.ok("{\"status\": \"Mensaje enviado correctamente.\"}");
    }

}