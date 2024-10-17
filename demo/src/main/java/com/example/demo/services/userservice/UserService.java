package com.example.demo.services.userservice;

import java.util.List;

import org.springframework.http.HttpHeaders;

import com.example.demo.exceptions.NotFoundException;
import com.example.demo.model.login.dto.JwtResponseDto;
import com.example.demo.model.login.dto.LoginDto;
import com.example.demo.model.login.dto.RegisterDto;
import com.example.demo.model.login.dto.UserDto;

public interface UserService {
    UserDto register(RegisterDto registerDto);

    JwtResponseDto login(LoginDto loginDto);

    List<UserDto> getAllUsers();

    UserDto getLoguedUser(HttpHeaders headers);

    void deleteUserById(Long id) throws NotFoundException;
}
