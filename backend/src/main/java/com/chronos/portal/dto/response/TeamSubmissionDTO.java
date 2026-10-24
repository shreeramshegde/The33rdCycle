package com.chronos.portal.dto.response;

import java.time.ZonedDateTime;

public class TeamSubmissionDTO {

    private String checkpointId;
    private String submittedValue;
    private Boolean isCorrect;
    private Integer pointsAwarded;
    private Integer attemptNumber;
    private ZonedDateTime submittedAt;

    public TeamSubmissionDTO() {
    }

    public TeamSubmissionDTO(String checkpointId, String submittedValue, Boolean isCorrect, Integer pointsAwarded, Integer attemptNumber, ZonedDateTime submittedAt) {
        this.checkpointId = checkpointId;
        this.submittedValue = submittedValue;
        this.isCorrect = isCorrect;
        this.pointsAwarded = pointsAwarded;
        this.attemptNumber = attemptNumber;
        this.submittedAt = submittedAt;
    }

    public String getCheckpointId() {
        return checkpointId;
    }

    public void setCheckpointId(String checkpointId) {
        this.checkpointId = checkpointId;
    }

    public String getSubmittedValue() {
        return submittedValue;
    }

    public void setSubmittedValue(String submittedValue) {
        this.submittedValue = submittedValue;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public Integer getPointsAwarded() {
        return pointsAwarded;
    }

    public void setPointsAwarded(Integer pointsAwarded) {
        this.pointsAwarded = pointsAwarded;
    }

    public Integer getAttemptNumber() {
        return attemptNumber;
    }

    public void setAttemptNumber(Integer attemptNumber) {
        this.attemptNumber = attemptNumber;
    }

    public ZonedDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(ZonedDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}
