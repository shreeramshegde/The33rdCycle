package com.chronos.portal.entity;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "team_code", nullable = false, unique = true, length = 30)
    private String teamCode;

    @Column(name = "team_name", nullable = false, length = 100)
    private String teamName;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore = 100;

    @Column(name = "completed_checkpoints", nullable = false)
    private Integer completedCheckpoints = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "last_active")
    private ZonedDateTime lastActive;

    public Team() {
    }

    public Team(String teamCode, String teamName, String passwordHash) {
        this.teamCode = teamCode;
        this.teamName = teamName;
        this.passwordHash = passwordHash;
        this.totalScore = 100;
        this.completedCheckpoints = 0;
        this.isActive = true;
        this.createdAt = ZonedDateTime.now();
        this.lastActive = ZonedDateTime.now();
    }

    @PrePersist
    public void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = ZonedDateTime.now();
        }
        this.lastActive = ZonedDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
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

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getLastActive() {
        return lastActive;
    }

    public void setLastActive(ZonedDateTime lastActive) {
        this.lastActive = lastActive;
    }
}
