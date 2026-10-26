package com.chronos.portal.config;

import com.chronos.portal.entity.Admin;
import com.chronos.portal.entity.Checkpoint;
import com.chronos.portal.entity.SystemConfig;
import com.chronos.portal.entity.Team;
import com.chronos.portal.repository.AdminRepository;
import com.chronos.portal.repository.CheckpointRepository;
import com.chronos.portal.repository.SystemConfigRepository;
import com.chronos.portal.repository.TeamRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final AdminRepository adminRepository;
    private final TeamRepository teamRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final CheckpointRepository checkpointRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    private record TeamSeedDef(String code, String name) {}

    private record CheckpointSeedDef(
            String id,
            String title,
            String stageLabel,
            String normalizedAnswer,
            String[] acceptedAliases,
            Integer maxPoints,
            Integer penaltyPoints,
            Integer orderIndex
    ) {}

    private static final List<TeamSeedDef> REQUIRED_TEAMS = List.of(
            new TeamSeedDef("TEAM_01", "Paradox Seekers"),
            new TeamSeedDef("TEAM_02", "Quantum Observers"),
            new TeamSeedDef("TEAM_03", "Temporal Shift"),
            new TeamSeedDef("TEAM_04", "Entropy Wardens"),
            new TeamSeedDef("TEAM_05", "Chronos Vanguard"),
            new TeamSeedDef("TEAM_06", "Singularity Unit"),
            new TeamSeedDef("TEAM_07", "Event Horizon"),
            new TeamSeedDef("TEAM_08", "Causal Loop"),
            new TeamSeedDef("TEAM_09", "Tachyon Pulse"),
            new TeamSeedDef("TEAM_10", "Zero Point"),
            new TeamSeedDef("DUMMY_01", "IEEE Test Alpha"),
            new TeamSeedDef("DUMMY_02", "IEEE Test Beta"),
            new TeamSeedDef("DUMMY_03", "IEEE Test Gamma"),
            new TeamSeedDef("DUMMY_04", "IEEE Test Delta"),
            new TeamSeedDef("DUMMY_05", "IEEE Test Epsilon")
    );

    private static final List<CheckpointSeedDef> REQUIRED_CHECKPOINTS = List.of(
            new CheckpointSeedDef(
                    "ROUND_0",
                    "Incident Log Clock Calibration",
                    "Opening Case Dossier",
                    "23:59:33",
                    new String[]{"23:59:33", "11:59:33", "11:59:33 PM", "235933", "115933", "23:59:33 PM", "23.59.33", "11.59.33", "23 59 33", "11 59 33"},
                    20, 5, 0
            ),
            new CheckpointSeedDef(
                    "CP_1",
                    "The Last Transmission (Hamming Parity)",
                    "Checkpoint 1",
                    "1993AND2059",
                    new String[]{
                            "1993 and 2059", "1993 & 2059", "1993, 2059", "1993 2059", "1993-2059", "1993/2059",
                            "19932059", "1993AND2059", "2059 and 1993", "2059 & 1993", "2059, 1993", "2059 1993",
                            "2059-1993", "2059AND1993", "YEAR 1993 AND YEAR 2059", "1993,2059"
                    },
                    20, 5, 1
            ),
            new CheckpointSeedDef(
                    "CP_2",
                    "The Unreliable Witness (Elias Verification)",
                    "Checkpoint 2",
                    "1993AND2059",
                    new String[]{
                            "1993 and 2059", "1993 & 2059", "1993, 2059", "1993 2059", "1993-2059", "1993/2059",
                            "19932059", "1993AND2059", "2059 and 1993", "2059 & 1993", "2059, 1993", "2059 1993",
                            "2059-1993", "2059AND1993", "YEAR 1993 AND YEAR 2059", "1993,2059"
                    },
                    20, 5, 2
            ),
            new CheckpointSeedDef(
                    "CP_3",
                    "The CHRONOS Terminal (FSM Sequence)",
                    "Checkpoint 3",
                    "1101",
                    new String[]{"1101", "1-1-0-1", "1 1 0 1", "1,1,0,1"},
                    20, 5, 3
            ),
            new CheckpointSeedDef(
                    "CP_4",
                    "The Secondary Override (Logic & Timing)",
                    "Checkpoint 4",
                    "CH033",
                    new String[]{"CH-0-33", "CH033", "CH 0 33", "CH-033", "CH_0_33"},
                    20, 5, 4
            ),
            new CheckpointSeedDef(
                    "CP_5",
                    "The Archival Grid (Sudoku Consensus)",
                    "Checkpoint 5",
                    "23:59:33",
                    new String[]{"23:59:33", "235933", "11:59:33", "11:59:33 PM", "115933", "23:59:33 PM", "23.59.33", "11.59.33", "23 59 33", "11 59 33"},
                    20, 5, 5
            )
    );

    @Value("${app.default.admin.username:admin}")
    private String defaultAdminUsername;

    @Value("${app.default.admin.password:admin123}")
    private String defaultAdminPassword;

    public DatabaseInitializer(AdminRepository adminRepository,
                               TeamRepository teamRepository,
                               SystemConfigRepository systemConfigRepository,
                               CheckpointRepository checkpointRepository,
                               PasswordEncoder passwordEncoder,
                               JdbcTemplate jdbcTemplate) {
        this.adminRepository = adminRepository;
        this.teamRepository = teamRepository;
        this.systemConfigRepository = systemConfigRepository;
        this.checkpointRepository = checkpointRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        log.info("Checking CHRONOS Database status...");

        // Ensure PostgreSQL table allows NULL for password_hash so teams can dynamically claim password
        try {
            jdbcTemplate.execute("ALTER TABLE teams ALTER COLUMN password_hash DROP NOT NULL");
            log.info("Ensured teams.password_hash allows NULL for first-time login claim.");
        } catch (Exception e) {
            log.warn("Notice checking teams column constraint: {}", e.getMessage());
        }

        // Ensure SystemConfig key exists
        if (systemConfigRepository.findByConfigKey("PORTAL_FROZEN").isEmpty()) {
            systemConfigRepository.save(new SystemConfig("PORTAL_FROZEN", "FALSE", "Event submission lock status"));
            log.info("Initialized default system config: PORTAL_FROZEN = FALSE");
        }

        // Ensure default Admin exists with guaranteed valid BCrypt hash
        Admin admin = adminRepository.findByUsername(defaultAdminUsername)
                .orElseGet(() -> new Admin(defaultAdminUsername, "", "IEEE Core Administrator"));
        admin.setPasswordHash(passwordEncoder.encode(defaultAdminPassword));
        adminRepository.save(admin);
        log.info("Verified and updated admin account: {} / {}", defaultAdminUsername, defaultAdminPassword);

        // Ensure all 10 Competition Teams + 5 Dummy Teams exist
        for (TeamSeedDef seed : REQUIRED_TEAMS) {
            if (teamRepository.findByTeamCode(seed.code()).isEmpty()) {
                Team team = new Team(seed.code(), seed.name(), null);
                teamRepository.save(team);
                log.info("Seeded initial team: {} - {} (Password: Unclaimed)", seed.code(), seed.name());
            }
        }

        // Transition teams with legacy default "team123" to NULL so participants can claim their own unique passwords
        for (Team team : teamRepository.findAll()) {
            if (team.getPasswordHash() != null && passwordEncoder.matches("team123", team.getPasswordHash())) {
                team.setPasswordHash(null);
                teamRepository.save(team);
                log.info("Reset default password to NULL for team: {} (Ready for unique password claim)", team.getTeamCode());
            }
        }

        // Synchronize and seed checkpoints to ensure answers match latest specification
        for (CheckpointSeedDef def : REQUIRED_CHECKPOINTS) {
            Checkpoint cp = checkpointRepository.findById(def.id())
                    .orElseGet(() -> new Checkpoint(def.id(), def.title(), def.stageLabel(), def.normalizedAnswer(), def.acceptedAliases(), def.maxPoints(), def.orderIndex()));
            cp.setTitle(def.title());
            cp.setStageLabel(def.stageLabel());
            cp.setNormalizedAnswer(def.normalizedAnswer());
            cp.setAcceptedAliases(def.acceptedAliases());
            cp.setMaxPoints(def.maxPoints());
            cp.setPenaltyPoints(def.penaltyPoints());
            cp.setOrderIndex(def.orderIndex());
            cp.setIsActive(true);
            checkpointRepository.save(cp);
            log.info("Synchronized checkpoint {}: answer='{}', aliases={}", def.id(), def.normalizedAnswer(), def.acceptedAliases().length);
        }

        long count = checkpointRepository.count();
        log.info("CHRONOS Engine Ready. Checkpoints configured: {}", count);
    }
}
