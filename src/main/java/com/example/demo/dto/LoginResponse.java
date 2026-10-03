package com.example.demo.dto;

import java.util.List;

public class LoginResponse {

    private String token;
    private String type = "Bearer";
    private String username;
    private List<String> roles;
    private long expiresInMs;

    public LoginResponse() {
    }

    public LoginResponse(String token, String username, List<String> roles, long expiresInMs) {
        this.token = token;
        this.username = username;
        this.roles = roles;
        this.expiresInMs = expiresInMs;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public long getExpiresInMs() {
        return expiresInMs;
    }

    public void setExpiresInMs(long expiresInMs) {
        this.expiresInMs = expiresInMs;
    }
}
