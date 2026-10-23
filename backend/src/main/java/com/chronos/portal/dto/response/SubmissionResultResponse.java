package com.chronos.portal.dto.response;

public class SubmissionResultResponse {

    private String checkpointId;
    private Boolean isCorrect;
    private String message;
    private Integer pointsAwarded;
    private Integer updatedTotalScore;
    private Integer attemptNumber;
    private Boolean alreadyCompleted;

    public SubmissionResultResponse() {
    }

    public SubmissionResultResponse(String checkpointId, Boolean isCorrect, String message, Integer pointsAwarded, Integer updatedTotalScore, Integer attemptNumber, Boolean alreadyCompleted) {
        this.checkpointId = checkpointId;
        this.isCorrect = isCorrect;
        this.message = message;
        this.pointsAwarded = pointsAwarded;
        this.updatedTotalScore = updatedTotalScore;
        this.attemptNumber = attemptNumber;
        this.alreadyCompleted = alreadyCompleted;
    }

    public String getCheckpointId() {
        return checkpointId;
    }

    public void setCheckpointId(String checkpointId) {
        this.checkpointId = checkpointId;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getPointsAwarded() {
        return pointsAwarded;
    }

    public void setPointsAwarded(Integer pointsAwarded) {
        this.pointsAwarded = pointsAwarded;
    }

    public Integer getUpdatedTotalScore() {
        return updatedTotalScore;
    }

    public void setUpdatedTotalScore(Integer updatedTotalScore) {
        this.updatedTotalScore = updatedTotalScore;
    }

    public Integer getAttemptNumber() {
        return attemptNumber;
    }

    public void setAttemptNumber(Integer attemptNumber) {
        this.attemptNumber = attemptNumber;
    }

    public Boolean getAlreadyCompleted() {
        return alreadyCompleted;
    }

    public void setAlreadyCompleted(Boolean alreadyCompleted) {
        this.alreadyCompleted = alreadyCompleted;
    }
}
