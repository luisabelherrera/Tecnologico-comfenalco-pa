package com.example.demo.model.login.dto;

import java.util.List;

public class JwtResponseDto {
    private String accessToken;
    private String username;
    private List<String> roles;

    public JwtResponseDto(String accessToken, String username, List<String> roles) {
        this.accessToken = accessToken;
        this.username = username;
        this.roles = roles;
    }

    public JwtResponseDto(String accessToken) {
        this.accessToken = accessToken;
    }

    public JwtResponseDto() {
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
