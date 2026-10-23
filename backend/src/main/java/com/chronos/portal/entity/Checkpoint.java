package com.chronos.portal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "checkpoints")
public class Checkpoint {

    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(name = "stage_label", nullable = false, length = 50)
    private String stageLabel;

    @Column(name = "normalized_answer", nullable = false, length = 100)
    private String normalizedAnswer;

    @Column(name = "accepted_aliases", columnDefinition = "text[]")
    private String[] acceptedAliases;

    @Column(name = "max_points", nullable = false)
    private Integer maxPoints = 20;

    @Column(name = "penalty_points", nullable = false)
    private Integer penaltyPoints = 5;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public Checkpoint() {
    }

    public Checkpoint(String id, String title, String stageLabel, String normalizedAnswer, String[] acceptedAliases, Integer maxPoints, Integer orderIndex) {
        this.id = id;
        this.title = title;
        this.stageLabel = stageLabel;
        this.normalizedAnswer = normalizedAnswer;
        this.acceptedAliases = acceptedAliases;
        this.maxPoints = maxPoints;
        this.orderIndex = orderIndex;
        this.isActive = true;
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

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
