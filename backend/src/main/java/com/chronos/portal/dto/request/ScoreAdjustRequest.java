package com.chronos.portal.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class ScoreAdjustRequest {

    @NotNull(message = "Team ID is required")
    private UUID teamId;

    @NotNull(message = "Points delta is required (can be positive or negative)")
    private Integer pointsDelta;

    private String reason;

    public ScoreAdjustRequest() {
    }

    public ScoreAdjustRequest(UUID teamId, Integer pointsDelta, String reason) {
        this.teamId = teamId;
        this.pointsDelta = pointsDelta;
        this.reason = reason;
    }

    public UUID getTeamId() {
        return teamId;
    }

    public void setTeamId(UUID teamId) {
        this.teamId = teamId;
    }

    public Integer getPointsDelta() {
        return pointsDelta;
    }

    public void setPointsDelta(Integer pointsDelta) {
        this.pointsDelta = pointsDelta;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
