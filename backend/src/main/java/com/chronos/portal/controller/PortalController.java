package com.chronos.portal.controller;

import com.chronos.portal.dto.request.SubmitAnswerRequest;
import com.chronos.portal.dto.response.SubmissionResultResponse;
import com.chronos.portal.dto.response.TeamProgressResponse;
import com.chronos.portal.service.PortalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portal")
@Tag(name = "Team Submission Portal", description = "Endpoints for participating teams to view status and submit answers")
@SecurityRequirement(name = "BearerAuth")
public class PortalController {

    private final PortalService portalService;

    public PortalController(PortalService portalService) {
        this.portalService = portalService;
    }

    @GetMapping({"/status", "/progress"})
    @Operation(summary = "Get Team Progress", description = "Retrieves current completion status and points across all 6 checkpoints")
    public ResponseEntity<TeamProgressResponse> getStatus(Authentication authentication) {
        String teamCode = authentication.getName();
        return ResponseEntity.ok(portalService.getTeamProgress(teamCode));
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit Checkpoint Answer", description = "Validates the submitted answer against ground truth and updates score")
    public ResponseEntity<SubmissionResultResponse> submitAnswer(
            Authentication authentication,
            @Valid @RequestBody SubmitAnswerRequest request) {
        String teamCode = authentication.getName();
        return ResponseEntity.ok(portalService.submitAnswer(teamCode, request));
    }
}
