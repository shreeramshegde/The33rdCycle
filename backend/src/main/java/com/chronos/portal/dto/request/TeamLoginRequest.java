package com.chronos.portal.dto.request;

import jakarta.validation.constraints.NotBlank;

public class TeamLoginRequest {

    @NotBlank(message = "Team code is required")
    private String teamCode;

    @NotBlank(message = "Password is required")
    private String password;

    public TeamLoginRequest() {
    }

    public TeamLoginRequest(String teamCode, String password) {
        this.teamCode = teamCode;
        this.password = password;
    }

    public String getTeamCode() {
        return teamCode;
    }

    public void setTeamCode(String teamCode) {
        this.teamCode = teamCode;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
