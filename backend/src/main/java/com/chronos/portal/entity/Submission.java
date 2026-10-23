package com.chronos.portal.entity;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "team_id", nullable = false)
    private UUID teamId;

    @Column(name = "checkpoint_id", nullable = false, length = 20)
    private String checkpointId;

    @Column(name = "raw_submitted_value", nullable = false, columnDefinition = "TEXT")
    private String rawSubmittedValue;

    @Column(name = "normalized_value", nullable = false, length = 100)
    private String normalizedValue;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect;

    @Column(name = "points_awarded", nullable = false)
    private Integer pointsAwarded = 0;

    @Column(name = "attempt_number", nullable = false)
    private Integer attemptNumber = 1;

    @Column(name = "submitted_at")
    private ZonedDateTime submittedAt;

    public Submission() {
    }

    public Submission(UUID teamId, String checkpointId, String rawSubmittedValue, String normalizedValue, Boolean isCorrect, Integer pointsAwarded, Integer attemptNumber) {
        this.teamId = teamId;
        this.checkpointId = checkpointId;
        this.rawSubmittedValue = rawSubmittedValue;
        this.normalizedValue = normalizedValue;
        this.isCorrect = isCorrect;
        this.pointsAwarded = pointsAwarded;
        this.attemptNumber = attemptNumber;
        this.submittedAt = ZonedDateTime.now();
    }

    @PrePersist
    public void onCreate() {
        if (this.submittedAt == null) {
            this.submittedAt = ZonedDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getTeamId() {
        return teamId;
    }

    public void setTeamId(UUID teamId) {
        this.teamId = teamId;
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

    public String getNormalizedValue() {
        return normalizedValue;
    }

    public void setNormalizedValue(String normalizedValue) {
        this.normalizedValue = normalizedValue;
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
