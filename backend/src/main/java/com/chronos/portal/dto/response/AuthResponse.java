package com.chronos.portal.dto.response;

public class AuthResponse {

    private String token;
    private String identifier;
    private String displayName;
    private String role;
    private Integer totalScore;

    public AuthResponse() {
    }

    public AuthResponse(String token, String identifier, String displayName, String role, Integer totalScore) {
        this.token = token;
        this.identifier = identifier;
        this.displayName = displayName;
        this.role = role;
        this.totalScore = totalScore;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }
}
