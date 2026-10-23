package com.chronos.portal.dto.response;

public class CheckpointStatusDTO {

    private String id;
    private String title;
    private String stageLabel;
    private Integer orderIndex;
    private Boolean isCompleted;
    private Integer attemptsCount;
    private Integer pointsAwarded;

    public CheckpointStatusDTO() {
    }

    public CheckpointStatusDTO(String id, String title, String stageLabel, Integer orderIndex, Boolean isCompleted, Integer attemptsCount, Integer pointsAwarded) {
        this.id = id;
        this.title = title;
        this.stageLabel = stageLabel;
        this.orderIndex = orderIndex;
        this.isCompleted = isCompleted;
        this.attemptsCount = attemptsCount;
        this.pointsAwarded = pointsAwarded;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public Integer getAttemptsCount() {
        return attemptsCount;
    }

    public void setAttemptsCount(Integer attemptsCount) {
        this.attemptsCount = attemptsCount;
    }

    public Integer getPointsAwarded() {
        return pointsAwarded;
    }

    public void setPointsAwarded(Integer pointsAwarded) {
        this.pointsAwarded = pointsAwarded;
    }
}
