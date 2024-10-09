package com.example.demo.services.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.SubMenu;
import com.example.demo.repositories.repository.SubMenuRepository;
import com.example.demo.services.service.SubMenuService;

import java.util.List;
import java.util.Optional;

@Service
public class SubMenuServiceImpl implements SubMenuService {

    @Autowired
    private SubMenuRepository subMenuRepository;

    @Override
    public List<SubMenu> findAll() {
        return subMenuRepository.findAll();
    }

    @Override
    public Optional<SubMenu> findById(Integer id) {
        return subMenuRepository.findById(id);
    }

    @Override
    public SubMenu save(SubMenu subMenu) {
        return subMenuRepository.save(subMenu);
    }

    @Override
    public void deleteById(Integer id) {
        subMenuRepository.deleteById(id);
    }
}
