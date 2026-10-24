package com.chronos.portal.dto.response;

import java.util.ArrayList;
import java.util.List;

public class TeamProgressResponse {

    private String teamCode;
    private String teamName;
    private Integer totalScore;
    private Integer completedCheckpoints;
    private Boolean isPortalFrozen;
    private List<CheckpointStatusDTO> checkpoints;
    private List<TeamSubmissionDTO> recentSubmissions = new ArrayList<>();

    public TeamProgressResponse() {
    }

    public TeamProgressResponse(String teamCode, String teamName, Integer totalScore, Integer completedCheckpoints, Boolean isPortalFrozen, List<CheckpointStatusDTO> checkpoints) {
        this.teamCode = teamCode;
        this.teamName = teamName;
        this.totalScore = totalScore;
        this.completedCheckpoints = completedCheckpoints;
        this.isPortalFrozen = isPortalFrozen;
        this.checkpoints = checkpoints;
        this.recentSubmissions = new ArrayList<>();
    }

    public TeamProgressResponse(String teamCode, String teamName, Integer totalScore, Integer completedCheckpoints, Boolean isPortalFrozen, List<CheckpointStatusDTO> checkpoints, List<TeamSubmissionDTO> recentSubmissions) {
        this.teamCode = teamCode;
        this.teamName = teamName;
        this.totalScore = totalScore;
        this.completedCheckpoints = completedCheckpoints;
        this.isPortalFrozen = isPortalFrozen;
        this.checkpoints = checkpoints;
        this.recentSubmissions = recentSubmissions != null ? recentSubmissions : new ArrayList<>();
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

    public Boolean getIsPortalFrozen() {
        return isPortalFrozen;
    }

    public void setIsPortalFrozen(Boolean isPortalFrozen) {
        this.isPortalFrozen = isPortalFrozen;
    }

    public List<CheckpointStatusDTO> getCheckpoints() {
        return checkpoints;
    }

    public void setCheckpoints(List<CheckpointStatusDTO> checkpoints) {
        this.checkpoints = checkpoints;
    }

    public List<TeamSubmissionDTO> getRecentSubmissions() {
        return recentSubmissions;
    }

    public void setRecentSubmissions(List<TeamSubmissionDTO> recentSubmissions) {
        this.recentSubmissions = recentSubmissions;
    }
}
