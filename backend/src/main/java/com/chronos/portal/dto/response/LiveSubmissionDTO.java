package com.chronos.portal.dto.response;

import java.time.ZonedDateTime;

public class LiveSubmissionDTO {

    private Long id;
    private String teamCode;
    private String teamName;
    private String checkpointId;
    private String rawSubmittedValue;
    private Boolean isCorrect;
    private Integer pointsAwarded;
    private Integer attemptNumber;
    private ZonedDateTime submittedAt;

    public LiveSubmissionDTO() {
    }

    public LiveSubmissionDTO(Long id, String teamCode, String teamName, String checkpointId, String rawSubmittedValue, Boolean isCorrect, Integer pointsAwarded, Integer attemptNumber, ZonedDateTime submittedAt) {
        this.id = id;
        this.teamCode = teamCode;
        this.teamName = teamName;
        this.checkpointId = checkpointId;
        this.rawSubmittedValue = rawSubmittedValue;
        this.isCorrect = isCorrect;
        this.pointsAwarded = pointsAwarded;
        this.attemptNumber = attemptNumber;
        this.submittedAt = submittedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getCheckpointId() {
        return checkpointId;
    }

    public void setCheckpointId(String checkpointId) {
        this.checkpointId = checkpointId;
    }

    public String getRawSubmittedValue() {
        return rawSubmittedValue;
    }

    public void setRawSubmittedValue(String rawSubmittedValue) {
        this.rawSubmittedValue = rawSubmittedValue;
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
