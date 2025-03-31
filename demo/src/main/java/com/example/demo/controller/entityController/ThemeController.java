package com.example.demo.controller.entityController;

import com.example.demo.model.entity.Theme;
import com.example.demo.repositories.mongo.ThemeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/themes")
@CrossOrigin(origins = "http://localhost:4200")
public class ThemeController {

    @Autowired
    private ThemeRepository themeRepository;

    @GetMapping
    public List<Theme> getAllThemes() {
        List<Theme> themes = themeRepository.findAll();
        if (themes.isEmpty()) {
            Theme defaultTheme = new Theme("Default", "rgb(0, 0, 0)", "white", true);
            return List.of(themeRepository.save(defaultTheme));
        }
        return themes;
    }

    @GetMapping("/active")
    public ResponseEntity<Theme> getActiveTheme() {
        try {
            List<Theme> themes = themeRepository.findAll();
            if (themes.isEmpty()) {
                Theme defaultTheme = new Theme("Default", "rgb(0, 0, 0)", "white", true);
                themeRepository.save(defaultTheme);
                return ResponseEntity.ok(defaultTheme);
            }

            Theme activeTheme = themeRepository.findByIsActiveTrue()
                    .orElse(themes.get(0));

            if (!activeTheme.isActive()) {
                activeTheme.setActive(true);
                themeRepository.save(activeTheme);
                for (Theme t : themes) {
                    if (!t.getId().equals(activeTheme.getId()) && t.isActive()) {
                        t.setActive(false);
                        themeRepository.save(t);
                    }
                }
            }

            return ResponseEntity.ok(activeTheme);
        } catch (Exception e) {
            System.err.println("Error en getActiveTheme: " + e.getMessage());
            e.printStackTrace();
            Theme defaultTheme = new Theme("Default", "rgb(0, 0, 0)", "white", true);
            return ResponseEntity.ok(defaultTheme);
        }
    }

    @DeleteMapping("/{id}")
public ResponseEntity<?> deleteTheme(@PathVariable String id) {
    try {
        Theme theme = themeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theme not found"));
        

        if (theme.isActive()) {
            List<Theme> themes = themeRepository.findAll();
            if (themes.size() > 1) {
                Theme newActiveTheme = themes.stream()
                        .filter(t -> !t.getId().equals(id))
                        .findFirst()
                        .orElse(null);
                if (newActiveTheme != null) {
                    newActiveTheme.setActive(true);
                    themeRepository.save(newActiveTheme);
                }
            }
        }

        themeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Error deleting theme: " + e.getMessage());
    }
}


    @PostMapping
    public Theme saveTheme(@RequestBody Theme theme) {
        List<Theme> existingThemes = themeRepository.findAll();
        for (Theme t : existingThemes) {
            if (t.isActive()) {
                t.setActive(false);
                themeRepository.save(t);
            }
        }
        theme.setActive(true);
        return themeRepository.save(theme);
    }
}