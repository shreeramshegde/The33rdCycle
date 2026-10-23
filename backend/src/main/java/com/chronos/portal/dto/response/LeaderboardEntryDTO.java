package com.chronos.portal.dto.response;

import java.time.ZonedDateTime;
import java.util.UUID;

public class LeaderboardEntryDTO {

    private Integer rank;
    private UUID teamId;
    private String teamCode;
    private String teamName;
    private Integer totalScore;
    private Integer completedCheckpoints;
    private ZonedDateTime lastActive;

    public LeaderboardEntryDTO() {
    }

    public LeaderboardEntryDTO(Integer rank, UUID teamId, String teamCode, String teamName, Integer totalScore, Integer completedCheckpoints, ZonedDateTime lastActive) {
        this.rank = rank;
        this.teamId = teamId;
        this.teamCode = teamCode;
        this.teamName = teamName;
        this.totalScore = totalScore;
        this.completedCheckpoints = completedCheckpoints;
        this.lastActive = lastActive;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public UUID getTeamId() {
        return teamId;
    }

    public void setTeamId(UUID teamId) {
        this.teamId = teamId;
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

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public Integer getCompletedCheckpoints() {
        return completedCheckpoints;
    }

    public void setCompletedCheckpoints(Integer completedCheckpoints) {
        this.completedCheckpoints = completedCheckpoints;
    }

    public ZonedDateTime getLastActive() {
        return lastActive;
    }

    public void setLastActive(ZonedDateTime lastActive) {
        this.lastActive = lastActive;
    }
}
