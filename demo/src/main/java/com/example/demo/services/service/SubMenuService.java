package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.SubMenu;

public interface SubMenuService {
    List<SubMenu> findAll();

    Optional<SubMenu> findById(Integer id);

    SubMenu save(SubMenu subMenu);

    void deleteById(Integer id);
}
