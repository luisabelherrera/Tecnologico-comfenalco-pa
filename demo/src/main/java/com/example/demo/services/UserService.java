package com.example.demo.services;

import org.springframework.http.HttpHeaders;

import com.example.demo.dto.JwtResponseDto;
import com.example.demo.dto.LoginDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.dto.UserDto;

public interface UserService {

    public UserDto register(RegisterDto registerDto);

    public JwtResponseDto login(LoginDto loginDto);

    UserDto getLoguedUser(HttpHeaders headers);
}
