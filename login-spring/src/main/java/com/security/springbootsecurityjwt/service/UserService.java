package com.security.springbootsecurityjwt.service;


import com.security.springbootsecurityjwt.dto.JwtResponseDto;
import com.security.springbootsecurityjwt.dto.LoginDto;
import com.security.springbootsecurityjwt.dto.RegisterDto;
import com.security.springbootsecurityjwt.dto.UserDto;
import com.security.springbootsecurityjwt.model.UserEntity;
import org.springframework.http.HttpHeaders;

public interface UserService {

    public UserDto register(RegisterDto registerDto);

    public JwtResponseDto login(LoginDto loginDto);

    UserDto getLoguedUser(HttpHeaders headers);
}
