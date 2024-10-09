package com.example.demo.services.userservice;

import java.util.List;

import org.springframework.http.HttpHeaders;

import com.example.demo.dto.JwtResponseDto;
import com.example.demo.dto.LoginDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.dto.UserDto;
import com.example.demo.exceptions.NotFoundException;

public interface UserService {
    UserDto register(RegisterDto registerDto);

    JwtResponseDto login(LoginDto loginDto);

    List<UserDto> getAllUsers();

    UserDto getLoguedUser(HttpHeaders headers);

    void deleteUserById(Long id) throws NotFoundException;
}
