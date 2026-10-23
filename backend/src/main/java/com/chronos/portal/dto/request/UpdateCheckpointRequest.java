package com.chronos.portal.dto.request;

public class UpdateCheckpointRequest {

    private String title;
    private String stageLabel;
    private String normalizedAnswer;
    private String[] acceptedAliases;
    private Integer maxPoints;
    private Integer penaltyPoints;
    private Boolean isActive;

    public UpdateCheckpointRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStageLabel() {
        return stageLabel;
    }

    public void setStageLabel(String stageLabel) {
        this.stageLabel = stageLabel;
    }

    public String getNormalizedAnswer() {
        return normalizedAnswer;
    }

    public void setNormalizedAnswer(String normalizedAnswer) {
        this.normalizedAnswer = normalizedAnswer;
    }

    public String[] getAcceptedAliases() {
        return acceptedAliases;
    }

    public void setAcceptedAliases(String[] acceptedAliases) {
        this.acceptedAliases = acceptedAliases;
    }

    public Integer getMaxPoints() {
        return maxPoints;
    }

    public void setMaxPoints(Integer maxPoints) {
        this.maxPoints = maxPoints;
    }

    public Integer getPenaltyPoints() {
        return penaltyPoints;
    }

    public void setPenaltyPoints(Integer penaltyPoints) {
        this.penaltyPoints = penaltyPoints;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
