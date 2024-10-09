package com.example.demo.services.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Menu;
import com.example.demo.repositories.repository.MenuRepository;
import com.example.demo.services.service.MenuService;

import java.util.List;
import java.util.Optional;

@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    private MenuRepository menuRepository;

    @Override
    public List<Menu> findAll() {
        return menuRepository.findAll();
    }

    @Override
    public Optional<Menu> findById(Integer id) {
        return menuRepository.findById(id);
    }

    @Override
    public Menu save(Menu menu) {
        return menuRepository.save(menu);
    }

    @Override
    public void deleteById(Integer id) {
        menuRepository.deleteById(id);
    }
}
