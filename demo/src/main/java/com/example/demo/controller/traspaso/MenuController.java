package com.example.demo.controller.traspaso;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.entity.Menu;
import com.example.demo.services.service.MenuService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping
    public ResponseEntity<List<Menu>> getAllMenus() {
        List<Menu> menus = menuService.findAll();
        return ResponseEntity.ok(menus);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Menu> getMenuById(@PathVariable Integer id) {
        Optional<Menu> menu = menuService.findById(id);
        return menu.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Menu> createMenu(@RequestBody Menu menu) {
        Menu nuevoMenu = menuService.save(menu);
        return ResponseEntity.ok(nuevoMenu);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Menu> updateMenu(@PathVariable Integer id, @RequestBody Menu menuDetalles) {
        Optional<Menu> menuExistente = menuService.findById(id);
        if (menuExistente.isPresent()) {
            Menu menu = menuExistente.get();
  
            menu.setNombre(menuDetalles.getNombre());
            menu.setIcono(menuDetalles.getIcono());
            menu.setActivo(menuDetalles.isActivo());
            Menu menuActualizado = menuService.save(menu);
            return ResponseEntity.ok(menuActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Integer id) {
        Optional<Menu> menu = menuService.findById(id);
        if (menu.isPresent()) {
            menuService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
