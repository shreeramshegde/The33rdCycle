package com.chronos.portal.service;

import com.chronos.portal.dto.request.SubmitAnswerRequest;
import com.chronos.portal.dto.response.CheckpointStatusDTO;
import com.chronos.portal.dto.response.SubmissionResultResponse;
import com.chronos.portal.dto.response.TeamProgressResponse;
import com.chronos.portal.entity.Checkpoint;
import com.chronos.portal.entity.Submission;
import com.chronos.portal.entity.SystemConfig;
import com.chronos.portal.entity.Team;
import com.chronos.portal.repository.CheckpointRepository;
import com.chronos.portal.repository.SubmissionRepository;
import com.chronos.portal.repository.SystemConfigRepository;
import com.chronos.portal.repository.TeamRepository;
import com.chronos.portal.util.StringNormalizer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PortalService {

    private final TeamRepository teamRepository;
    private final CheckpointRepository checkpointRepository;
    private final SubmissionRepository submissionRepository;
    private final SystemConfigRepository systemConfigRepository;

    public PortalService(TeamRepository teamRepository,
                         CheckpointRepository checkpointRepository,
                         SubmissionRepository submissionRepository,
                         SystemConfigRepository systemConfigRepository) {
        this.teamRepository = teamRepository;
        this.checkpointRepository = checkpointRepository;
        this.submissionRepository = submissionRepository;
        this.systemConfigRepository = systemConfigRepository;
    }

    public boolean isPortalFrozen() {
        return systemConfigRepository.findByConfigKey("PORTAL_FROZEN")
                .map(config -> "TRUE".equalsIgnoreCase(config.getConfigValue()))
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public TeamProgressResponse getTeamProgress(String teamCode) {
        Team team = teamRepository.findByTeamCode(teamCode)
                .orElseThrow(() -> new IllegalArgumentException("Team not found: " + teamCode));

        boolean frozen = isPortalFrozen();
        List<Checkpoint> activeCheckpoints = checkpointRepository.findByIsActiveTrueOrderByOrderIndexAsc();
        List<CheckpointStatusDTO> checkpointStatuses = new ArrayList<>();

        for (Checkpoint cp : activeCheckpoints) {
            Optional<Submission> correctSub = submissionRepository
                    .findFirstByTeamIdAndCheckpointIdAndIsCorrectTrue(team.getId(), cp.getId());
            int attemptsCount = submissionRepository
                    .countByTeamIdAndCheckpointId(team.getId(), cp.getId());

            boolean isCompleted = correctSub.isPresent();
            int points = isCompleted ? correctSub.get().getPointsAwarded() : 0;

            checkpointStatuses.add(new CheckpointStatusDTO(
                    cp.getId(),
                    cp.getTitle(),
                    cp.getStageLabel(),
                    cp.getOrderIndex(),
                    isCompleted,
                    attemptsCount,
                    points
            ));
        }

        return new TeamProgressResponse(
                team.getTeamCode(),
                team.getTeamName(),
                team.getTotalScore(),
                team.getCompletedCheckpoints(),
                frozen,
                checkpointStatuses
        );
    }

    @Transactional
    public SubmissionResultResponse submitAnswer(String teamCode, SubmitAnswerRequest request) {
        if (isPortalFrozen()) {
            throw new IllegalStateException("SUBMISSION_FROZEN: The transmission window is closed by Control.");
        }

        Team team = teamRepository.findByTeamCode(teamCode)
                .orElseThrow(() -> new IllegalArgumentException("Team not found: " + teamCode));

        Checkpoint checkpoint = checkpointRepository.findById(request.getCheckpointId().trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Checkpoint ID: " + request.getCheckpointId()));

        if (!Boolean.TRUE.equals(checkpoint.getIsActive())) {
            throw new IllegalArgumentException("Checkpoint is currently inactive.");
        }

        // Check if already solved
        Optional<Submission> existingCorrect = submissionRepository
                .findFirstByTeamIdAndCheckpointIdAndIsCorrectTrue(team.getId(), checkpoint.getId());

        if (existingCorrect.isPresent()) {
            return new SubmissionResultResponse(
                    checkpoint.getId(),
                    true,
                    "ALREADY_VERIFIED: This checkpoint has already been solved by your team.",
                    existingCorrect.get().getPointsAwarded(),
                    team.getTotalScore(),
                    existingCorrect.get().getAttemptNumber(),
                    true
            );
        }

        int previousAttempts = submissionRepository.countByTeamIdAndCheckpointId(team.getId(), checkpoint.getId());
        int currentAttemptNumber = previousAttempts + 1;

        // Perform tolerant pattern matching
        boolean isCorrect = StringNormalizer.matches(
                request.getAnswer(),
                checkpoint.getNormalizedAnswer(),
                checkpoint.getAcceptedAliases()
        );

        int pointsAwarded = 0;
        String message;

        if (isCorrect) {
            pointsAwarded = checkpoint.getMaxPoints();
            team.setTotalScore(team.getTotalScore() + pointsAwarded);
            team.setCompletedCheckpoints(team.getCompletedCheckpoints() + 1);
            team.setLastActive(ZonedDateTime.now());
            teamRepository.save(team);
            message = "VERIFIED: Signal Accepted. +" + pointsAwarded + " Points awarded to team ledger!";
        } else {
            message = "SIGNAL REJECTED: Value mismatch. Review your evidence and try again. (Attempt #" + currentAttemptNumber + ")";
        }

        // Record submission
        Submission submission = new Submission(
                team.getId(),
                checkpoint.getId(),
                request.getAnswer().trim(),
                StringNormalizer.normalize(request.getAnswer()),
                isCorrect,
                pointsAwarded,
                currentAttemptNumber
        );
        submissionRepository.save(submission);

        return new SubmissionResultResponse(
                checkpoint.getId(),
                isCorrect,
                message,
                pointsAwarded,
                team.getTotalScore(),
                currentAttemptNumber,
                false
        );
    }
}
