package com.security.springbootsecurityjwt.service.imple;

import com.security.springbootsecurityjwt.model.Rol;
import com.security.springbootsecurityjwt.repository.RoleRepository;
import com.security.springbootsecurityjwt.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RolServiceImple implements RolService {

    @Autowired
    private RoleRepository roleRepository;
    @Override
    public Optional<Rol> findByname(String name) {
        return roleRepository.findByName(name);
    }
}
