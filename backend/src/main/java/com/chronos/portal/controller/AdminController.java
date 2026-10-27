package com.chronos.portal.controller;

import com.chronos.portal.dto.request.CreateTeamRequest;
import com.chronos.portal.dto.request.HintPenaltyRequest;
import com.chronos.portal.dto.request.ScoreAdjustRequest;
import com.chronos.portal.dto.request.UpdateCheckpointRequest;
import com.chronos.portal.dto.response.ApiResponse;
import com.chronos.portal.dto.response.HintPenaltyResponse;
import com.chronos.portal.dto.response.LeaderboardEntryDTO;
import com.chronos.portal.dto.response.LiveSubmissionDTO;
import com.chronos.portal.entity.Checkpoint;
import com.chronos.portal.entity.Team;
import com.chronos.portal.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Operations", description = "Complete administrative control cockpit for IEEE organizers via Swagger UI")
@SecurityRequirement(name = "BearerAuth")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // -------------------------------------------------------------------------
    // 1. SYSTEM CONTROLS (FREEZE / UNFREEZE)
    // -------------------------------------------------------------------------

    @GetMapping("/portal/status")
    @Operation(summary = "Check Portal Freeze Status", description = "Returns true if the portal is currently locked for submissions")
    public ResponseEntity<ApiResponse> getPortalStatus() {
        boolean frozen = adminService.isPortalFrozen();
        return ResponseEntity.ok(new ApiResponse(true, "Portal is currently " + (frozen ? "FROZEN (Locked)" : "ACTIVE (Open)")));
    }

    @PostMapping("/portal/freeze")
    @Operation(summary = "Freeze Portal Submissions", description = "Instantly blocks all teams from submitting answers (used at 7:30 PM deadline)")
    public ResponseEntity<ApiResponse> freezePortal() {
        adminService.setPortalFrozen(true);
        return ResponseEntity.ok(new ApiResponse(true, "PORTAL FROZEN: All incoming submissions locked."));
    }

    @PostMapping("/portal/unfreeze")
    @Operation(summary = "Unfreeze Portal Submissions", description = "Re-opens the portal to allow teams to submit answers")
    public ResponseEntity<ApiResponse> unfreezePortal() {
        adminService.setPortalFrozen(false);
        return ResponseEntity.ok(new ApiResponse(true, "PORTAL ACTIVE: Submissions are now open."));
    }

    // -------------------------------------------------------------------------
    // 2. LEADERBOARD & LIVE AUDIT FEED
    // -------------------------------------------------------------------------

    @GetMapping("/leaderboard")
    @Operation(summary = "Live Leaderboard", description = "Returns all teams ranked by score and completion timestamps")
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard() {
        return ResponseEntity.ok(adminService.getLeaderboard());
    }

    @GetMapping("/live-submissions")
    @Operation(summary = "Live Submissions Audit Stream", description = "Returns the 100 most recent submission attempts across all teams")
    public ResponseEntity<List<LiveSubmissionDTO>> getLiveSubmissions() {
        return ResponseEntity.ok(adminService.getLiveSubmissions());
    }

    // -------------------------------------------------------------------------
    // 3. TEAM MANAGEMENT
    // -------------------------------------------------------------------------

    @PostMapping("/teams")
    @Operation(summary = "Register New Team", description = "Creates a new team with code, name, and password")
    public ResponseEntity<Team> createTeam(@Valid @RequestBody CreateTeamRequest request) {
        return ResponseEntity.ok(adminService.createTeam(request));
    }

    @DeleteMapping("/teams/{teamId}")
    @Operation(summary = "Delete Team", description = "Removes a team and all its submission records")
    public ResponseEntity<ApiResponse> deleteTeam(@PathVariable UUID teamId) {
        adminService.deleteTeam(teamId);
        return ResponseEntity.ok(new ApiResponse(true, "Team removed successfully."));
    }

    @PostMapping("/score/adjust")
    @Operation(summary = "Adjust Team Score (Penalty / Bonus)", description = "Manually adds or deducts points (e.g. -5 for hint penalty)")
    public ResponseEntity<Team> adjustScore(@Valid @RequestBody ScoreAdjustRequest request) {
        return ResponseEntity.ok(adminService.adjustTeamScore(request));
    }

    @PostMapping("/hint")
    @Operation(summary = "Deduct Hint Penalty (-2 pts)", description = "Applies -2 points penalty to a team for taking a checkpoint hint")
    public ResponseEntity<HintPenaltyResponse> issueHint(@Valid @RequestBody HintPenaltyRequest request) {
        return ResponseEntity.ok(adminService.issueHintPenalty(request.getTeamCode(), request.getCheckpointId()));
    }

    @PostMapping("/teams/{teamId}/checkpoints/{checkpointId}/reset")
    @Operation(summary = "Reset Checkpoint for Team", description = "Clears previous attempts for a team on a specific checkpoint")
    public ResponseEntity<ApiResponse> resetTeamCheckpoint(
            @PathVariable UUID teamId,
            @PathVariable String checkpointId) {
        adminService.resetCheckpointForTeam(teamId, checkpointId);
        return ResponseEntity.ok(new ApiResponse(true, "Checkpoint reset for team."));
    }

    @PostMapping("/teams/{teamId}/reset-password")
    @Operation(summary = "Reset Team Password (by UUID)", description = "Clears the password hash so the team can set a new password upon login")
    public ResponseEntity<ApiResponse> resetTeamPassword(@PathVariable UUID teamId) {
        adminService.resetTeamPassword(teamId);
        return ResponseEntity.ok(new ApiResponse(true, "Team password cleared. Team can set a new password on login."));
    }

    @PostMapping("/teams/code/{teamCode}/reset-password")
    @Operation(summary = "Reset Team Password (by Team Code, e.g. TEAM_01)", description = "Convenient shortcut to clear password by team code like TEAM_01")
    public ResponseEntity<ApiResponse> resetTeamPasswordByCode(@PathVariable String teamCode) {
        adminService.resetTeamPasswordByCode(teamCode);
        return ResponseEntity.ok(new ApiResponse(true, "Password cleared for " + teamCode.toUpperCase() + ". Team can set a new password on login."));
    }

    // -------------------------------------------------------------------------
    // 4. CHECKPOINT & ANSWER MANAGEMENT
    // -------------------------------------------------------------------------

    @GetMapping("/checkpoints")
    @Operation(summary = "List All Checkpoints & Answers", description = "View current answers, points, and configurations")
    public ResponseEntity<List<Checkpoint>> getAllCheckpoints() {
        return ResponseEntity.ok(adminService.getAllCheckpoints());
    }

    @PutMapping("/checkpoints/{id}")
    @Operation(summary = "Update Checkpoint Ground Truth", description = "Modify the correct answer or point weights dynamically")
    public ResponseEntity<Checkpoint> updateCheckpoint(
            @PathVariable String id,
            @RequestBody UpdateCheckpointRequest request) {
        return ResponseEntity.ok(adminService.updateCheckpoint(id, request));
    }
}
