package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Menu;

public interface MenuService {
    List<Menu> findAll();

    Optional<Menu> findById(Integer id);

    Menu save(Menu menu);

    void deleteById(Integer id);
}
