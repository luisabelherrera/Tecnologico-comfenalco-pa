package com.example.demo.repositories.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.SubMenu;

@Repository
public interface SubMenuRepository extends JpaRepository<SubMenu, Integer> {
}
