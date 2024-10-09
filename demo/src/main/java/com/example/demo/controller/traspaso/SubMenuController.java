package com.example.demo.controller.traspaso;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.entity.SubMenu;
import com.example.demo.services.service.SubMenuService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/submenu")
public class SubMenuController {

    @Autowired
    private SubMenuService subMenuService;

    // Obtener todos los submenús
    @GetMapping
    public ResponseEntity<List<SubMenu>> getAllSubMenus() {
        List<SubMenu> subMenus = subMenuService.findAll();
        return ResponseEntity.ok(subMenus);
    }

    // Obtener un submenú por ID
    @GetMapping("/{id}")
    public ResponseEntity<SubMenu> getSubMenuById(@PathVariable Integer id) {
        Optional<SubMenu> subMenu = subMenuService.findById(id);
        return subMenu.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un nuevo submenú
    @PostMapping
    public ResponseEntity<SubMenu> createSubMenu(@RequestBody SubMenu subMenu) {
        SubMenu nuevoSubMenu = subMenuService.save(subMenu);
        return ResponseEntity.ok(nuevoSubMenu);
    }

    // Actualizar un submenú existente
    @PutMapping("/{id}")
    public ResponseEntity<SubMenu> updateSubMenu(@PathVariable Integer id, @RequestBody SubMenu subMenuDetalles) {
        Optional<SubMenu> subMenuExistente = subMenuService.findById(id);
        if (subMenuExistente.isPresent()) {
            SubMenu subMenu = subMenuExistente.get();
            // Actualizar los campos necesarios
            subMenu.setNombre(subMenuDetalles.getNombre());
            subMenu.setNombreFormulario(subMenuDetalles.getNombreFormulario());
            subMenu.setAccion(subMenuDetalles.getAccion());
            subMenu.setActivo(subMenuDetalles.isActivo());
            SubMenu subMenuActualizado = subMenuService.save(subMenu);
            return ResponseEntity.ok(subMenuActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar un submenú por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubMenu(@PathVariable Integer id) {
        Optional<SubMenu> subMenu = subMenuService.findById(id);
        if (subMenu.isPresent()) {
            subMenuService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}