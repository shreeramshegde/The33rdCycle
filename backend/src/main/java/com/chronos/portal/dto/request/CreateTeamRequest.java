package com.chronos.portal.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CreateTeamRequest {

    @NotBlank(message = "Team code is required")
    private String teamCode;

    @NotBlank(message = "Team name is required")
    private String teamName;

    @NotBlank(message = "Password is required")
    private String password;

    public CreateTeamRequest() {
    }

    public CreateTeamRequest(String teamCode, String teamName, String password) {
        this.teamCode = teamCode;
        this.teamName = teamName;
        this.password = password;
    }

    public String getTeamCode() {
        return teamCode;
    }

    public void setTeamCode(String teamCode) {
        this.teamCode = teamCode;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
