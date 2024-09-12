package com.security.springbootsecurityjwt.dto;

import com.security.springbootsecurityjwt.model.Rol;

import java.util.List;

public class JwtResponseDto {

    private String accessToken;
    public JwtResponseDto(String accessToken){
        this.accessToken = accessToken;
    }

    public JwtResponseDto(){}

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

}
