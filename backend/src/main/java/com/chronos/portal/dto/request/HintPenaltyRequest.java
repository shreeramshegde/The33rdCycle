package com.chronos.portal.dto.request;

import jakarta.validation.constraints.NotBlank;

public class HintPenaltyRequest {

    @NotBlank(message = "Team Code is required (e.g. TEAM_01)")
    private String teamCode;

    @NotBlank(message = "Checkpoint ID is required (e.g. CP_1)")
    private String checkpointId;

    public HintPenaltyRequest() {
    }

    public HintPenaltyRequest(String teamCode, String checkpointId) {
        this.teamCode = teamCode;
        this.checkpointId = checkpointId;
    }

    public String getTeamCode() {
        return teamCode;
    }

    public void setTeamCode(String teamCode) {
        this.teamCode = teamCode;
    }

    public String getCheckpointId() {
        return checkpointId;
    }

    public void setCheckpointId(String checkpointId) {
        this.checkpointId = checkpointId;
    }
}
