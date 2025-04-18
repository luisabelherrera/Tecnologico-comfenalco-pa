package com.example.demo.controller.entityController;

import com.example.demo.model.entity.PrecioNivelEducativo;
import com.example.demo.services.service.PrecioNivelEducativoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/precios")
@CrossOrigin
public class PrecioNivelEducativoController {

    @Autowired
    private PrecioNivelEducativoService service;

    // Endpoint protegido para administradores
    @GetMapping
    public List<PrecioNivelEducativo> getAll() {
        return service.findAll();
    }

    // Endpoint público para todos los usuarios
    @GetMapping("/public")
    public List<PrecioNivelEducativo> getAllPublic() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public PrecioNivelEducativo getById(@PathVariable String id) {
        return service.findById(id).orElse(null);
    }

    @PostMapping(value = "/crear", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PrecioNivelEducativo> create(
            @RequestParam("nivel") String nivel,
            @RequestParam("concepto") String concepto,
            @RequestParam("monto") double monto,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam(value = "periodicidad", required = false) String periodicidad,
            @RequestParam(value = "fechaInicio", required = false) String fechaInicio,
            @RequestParam(value = "fechaFin", required = false) String fechaFin,
            @RequestParam(value = "descuento", required = false) Double descuento,
            @RequestParam(value = "categoria", required = false) String categoria,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        try {
            PrecioNivelEducativo precio = new PrecioNivelEducativo();
            precio.setNivel(nivel);
            precio.setConcepto(concepto);
            precio.setMonto(monto);
            precio.setDescripcion(descripcion);
            precio.setPeriodicidad(periodicidad);

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            if (fechaInicio != null && !fechaInicio.isEmpty()) {
                try {
                    precio.setFechaInicio(sdf.parse(fechaInicio));
                } catch (Exception e) {
                    System.err.println("Error parsing fechaInicio: " + fechaInicio);
                    e.printStackTrace();
                }
            }
            if (fechaFin != null && !fechaFin.isEmpty()) {
                try {
                    precio.setFechaFin(sdf.parse(fechaFin));
                } catch (Exception e) {
                    System.err.println("Error parsing fechaFin: " + fechaFin);
                    e.printStackTrace();
                }
            }
            precio.setDescuento(descuento);
            precio.setCategoria(categoria);

            PrecioNivelEducativo savedPrecio = service.saveWithImage(precio, imagen);
            return new ResponseEntity<>(savedPrecio, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error in create endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PrecioNivelEducativo> update(
            @PathVariable String id,
            @RequestParam("nivel") String nivel,
            @RequestParam("concepto") String concepto,
            @RequestParam("monto") double monto,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam(value = "periodicidad", required = false) String periodicidad,
            @RequestParam(value = "fechaInicio", required = false) String fechaInicio,
            @RequestParam(value = "fechaFin", required = false) String fechaFin,
            @RequestParam(value = "descuento", required = false) Double descuento,
            @RequestParam(value = "categoria", required = false) String categoria,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        try {
            PrecioNivelEducativo precio = new PrecioNivelEducativo();
            precio.setId(id);
            precio.setNivel(nivel);
            precio.setConcepto(concepto);
            precio.setMonto(monto);
            precio.setDescripcion(descripcion);
            precio.setPeriodicidad(periodicidad);

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            if (fechaInicio != null && !fechaInicio.isEmpty()) {
                try {
                    precio.setFechaInicio(sdf.parse(fechaInicio));
                } catch (Exception e) {
                    System.err.println("Error parsing fechaInicio: " + fechaInicio);
                    e.printStackTrace();
                }
            }
            if (fechaFin != null && !fechaFin.isEmpty()) {
                try {
                    precio.setFechaFin(sdf.parse(fechaFin));
                } catch (Exception e) {
                    System.err.println("Error parsing fechaFin: " + fechaFin);
                    e.printStackTrace();
                }
            }
            precio.setDescuento(descuento);
            precio.setCategoria(categoria);

            PrecioNivelEducativo updatedPrecio = service.saveWithImage(precio, imagen);
            return new ResponseEntity<>(updatedPrecio, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error in update endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint protegido para imágenes
    @GetMapping("/imagen/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable String id) {
        PrecioNivelEducativo precio = service.findById(id).orElse(null);
        if (precio == null || precio.getImagenPath() == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            byte[] imageBytes = Files.readAllBytes(Paths.get(precio.getImagenPath()));
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            System.err.println("Error serving image: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint público para imágenes
    @GetMapping("/imagen/public/{id}")
    public ResponseEntity<byte[]> getImagePublic(@PathVariable String id) {
        PrecioNivelEducativo precio = service.findById(id).orElse(null);
        if (precio == null || precio.getImagenPath() == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            byte[] imageBytes = Files.readAllBytes(Paths.get(precio.getImagenPath()));
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            System.err.println("Error serving public image: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}