package com.example.demo.dto;

import java.util.List;

public class UserProfileResponse {

    private String username;
    private List<String> authorities;
    private String message;

    public UserProfileResponse() {
    }

    public UserProfileResponse(String username, List<String> authorities, String message) {
        this.username = username;
        this.authorities = authorities;
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(List<String> authorities) {
        this.authorities = authorities;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
