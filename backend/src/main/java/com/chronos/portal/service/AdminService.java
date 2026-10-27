package com.chronos.portal.service;

import com.chronos.portal.dto.request.CreateTeamRequest;
import com.chronos.portal.dto.request.ScoreAdjustRequest;
import com.chronos.portal.dto.request.UpdateCheckpointRequest;
import com.chronos.portal.dto.response.HintPenaltyResponse;
import com.chronos.portal.dto.response.LeaderboardEntryDTO;
import com.chronos.portal.dto.response.LiveSubmissionDTO;
import com.chronos.portal.entity.Checkpoint;
import com.chronos.portal.entity.Submission;
import com.chronos.portal.entity.SystemConfig;
import com.chronos.portal.entity.Team;
import com.chronos.portal.repository.CheckpointRepository;
import com.chronos.portal.repository.SubmissionRepository;
import com.chronos.portal.repository.SystemConfigRepository;
import com.chronos.portal.repository.TeamRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final TeamRepository teamRepository;
    private final CheckpointRepository checkpointRepository;
    private final SubmissionRepository submissionRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(TeamRepository teamRepository,
                        CheckpointRepository checkpointRepository,
                        SubmissionRepository submissionRepository,
                        SystemConfigRepository systemConfigRepository,
                        PasswordEncoder passwordEncoder) {
        this.teamRepository = teamRepository;
        this.checkpointRepository = checkpointRepository;
        this.submissionRepository = submissionRepository;
        this.systemConfigRepository = systemConfigRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public boolean setPortalFrozen(boolean frozen) {
        SystemConfig config = systemConfigRepository.findByConfigKey("PORTAL_FROZEN")
                .orElse(new SystemConfig("PORTAL_FROZEN", "FALSE", "Event submission lock"));
        config.setConfigValue(frozen ? "TRUE" : "FALSE");
        systemConfigRepository.save(config);
        return frozen;
    }

    public boolean isPortalFrozen() {
        return systemConfigRepository.findByConfigKey("PORTAL_FROZEN")
                .map(config -> "TRUE".equalsIgnoreCase(config.getConfigValue()))
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public List<LeaderboardEntryDTO> getLeaderboard() {
        List<Team> teams = teamRepository.findAllByOrderByTotalScoreDescLastActiveAsc();
        List<LeaderboardEntryDTO> leaderboard = new ArrayList<>();
        int rank = 1;

        for (Team team : teams) {
            leaderboard.add(new LeaderboardEntryDTO(
                    rank++,
                    team.getId(),
                    team.getTeamCode(),
                    team.getTeamName(),
                    team.getTotalScore(),
                    team.getCompletedCheckpoints(),
                    team.getLastActive()
            ));
        }

        return leaderboard;
    }

    @Transactional(readOnly = true)
    public List<LiveSubmissionDTO> getLiveSubmissions() {
        List<Submission> submissions = submissionRepository.findTop100ByOrderBySubmittedAtDesc();
        Map<UUID, Team> teamMap = teamRepository.findAll().stream()
                .collect(Collectors.toMap(Team::getId, t -> t, (a, b) -> a));

        List<LiveSubmissionDTO> list = new ArrayList<>();
        for (Submission sub : submissions) {
            Team t = teamMap.get(sub.getTeamId());
            String teamCode = t != null ? t.getTeamCode() : "UNKNOWN";
            String teamName = t != null ? t.getTeamName() : "Unknown Team";

            list.add(new LiveSubmissionDTO(
                    sub.getId(),
                    teamCode,
                    teamName,
                    sub.getCheckpointId(),
                    sub.getRawSubmittedValue(),
                    sub.getIsCorrect(),
                    sub.getPointsAwarded(),
                    sub.getAttemptNumber(),
                    sub.getSubmittedAt()
            ));
        }

        return list;
    }

    @Transactional
    public Team adjustTeamScore(ScoreAdjustRequest request) {
        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found: " + request.getTeamId()));

        team.setTotalScore(team.getTotalScore() + request.getPointsDelta());
        team.setLastActive(ZonedDateTime.now());
        return teamRepository.save(team);
    }

    @Transactional
    public Team createTeam(CreateTeamRequest request) {
        String code = request.getTeamCode().trim().toUpperCase();
        if (teamRepository.existsByTeamCode(code)) {
            throw new IllegalArgumentException("Team Code already exists: " + code);
        }

        Team team = new Team(
                code,
                request.getTeamName().trim(),
                passwordEncoder.encode(request.getPassword())
        );

        return teamRepository.save(team);
    }

    @Transactional
    public void deleteTeam(UUID teamId) {
        teamRepository.deleteById(teamId);
    }

    @Transactional
    public void resetTeamPassword(UUID teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        team.setPasswordHash(null);
        teamRepository.save(team);
    }

    @Transactional
    public void resetTeamPasswordByCode(String teamCode) {
        Team team = teamRepository.findByTeamCode(teamCode.trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Team not found with code: " + teamCode));
        team.setPasswordHash(null);
        teamRepository.save(team);
    }

    @Transactional(readOnly = true)
    public List<Checkpoint> getAllCheckpoints() {
        return checkpointRepository.findAllByOrderByOrderIndexAsc();
    }

    @Transactional
    public Checkpoint updateCheckpoint(String id, UpdateCheckpointRequest request) {
        Checkpoint cp = checkpointRepository.findById(id.trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Checkpoint not found: " + id));

        if (request.getTitle() != null) cp.setTitle(request.getTitle());
        if (request.getStageLabel() != null) cp.setStageLabel(request.getStageLabel());
        if (request.getNormalizedAnswer() != null) cp.setNormalizedAnswer(request.getNormalizedAnswer());
        if (request.getAcceptedAliases() != null) cp.setAcceptedAliases(request.getAcceptedAliases());
        if (request.getMaxPoints() != null) cp.setMaxPoints(request.getMaxPoints());
        if (request.getPenaltyPoints() != null) cp.setPenaltyPoints(request.getPenaltyPoints());
        if (request.getIsActive() != null) cp.setIsActive(request.getIsActive());

        return checkpointRepository.save(cp);
    }

    @Transactional
    public void resetCheckpointForTeam(UUID teamId, String checkpointId) {
        List<Submission> teamSubs = submissionRepository.findByTeamIdAndCheckpointId(teamId, checkpointId);
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        for (Submission sub : teamSubs) {
            if (Boolean.TRUE.equals(sub.getIsCorrect())) {
                team.setTotalScore(team.getTotalScore() - sub.getPointsAwarded());
                team.setCompletedCheckpoints(Math.max(0, team.getCompletedCheckpoints() - 1));
            }
        }

        submissionRepository.deleteAll(teamSubs);
        teamRepository.save(team);
    }

    @Transactional
    public HintPenaltyResponse issueHintPenalty(String teamCode, String checkpointId) {
        String cleanCode = teamCode.trim().toUpperCase();
        String cleanCp = checkpointId.trim().toUpperCase();

        Team team = teamRepository.findByTeamCode(cleanCode)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with code: " + cleanCode));

        int deduction = 2;
        team.setTotalScore(team.getTotalScore() - deduction);
        team.setLastActive(ZonedDateTime.now());
        teamRepository.save(team);

        int attemptNumber = submissionRepository.countByTeamIdAndCheckpointId(team.getId(), cleanCp) + 1;
        Submission hintRecord = new Submission(
                team.getId(),
                cleanCp,
                "[HINT ISSUED: -2 PTS]",
                "ADMIN_HINT",
                false,
                -deduction,
                attemptNumber
        );
        submissionRepository.save(hintRecord);

        return new HintPenaltyResponse(
                true,
                "Official hint penalty registered. -2 points applied to " + team.getTeamCode() + ".",
                team.getTeamCode(),
                team.getTeamName(),
                cleanCp,
                deduction,
                team.getTotalScore()
        );
    }
}
