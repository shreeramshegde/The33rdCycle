package com.chronos.portal.config;

import com.chronos.portal.entity.Admin;
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

    private record TeamSeedDef(String code, String name) {}

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

    @Value("${app.default.admin.username:admin}")
    private String defaultAdminUsername;

    @Value("${app.default.admin.password:admin123}")
    private String defaultAdminPassword;

    public DatabaseInitializer(AdminRepository adminRepository,
                               TeamRepository teamRepository,
                               SystemConfigRepository systemConfigRepository,
                               CheckpointRepository checkpointRepository,
                               PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.teamRepository = teamRepository;
        this.systemConfigRepository = systemConfigRepository;
        this.checkpointRepository = checkpointRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("Checking CHRONOS Database status...");

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
        String teamHash = passwordEncoder.encode("team123");
        for (TeamSeedDef seed : REQUIRED_TEAMS) {
            if (teamRepository.findByTeamCode(seed.code()).isEmpty()) {
                Team team = new Team(seed.code(), seed.name(), teamHash);
                teamRepository.save(team);
                log.info("Seeded initial team: {} - {}", seed.code(), seed.name());
            }
        }

        // Verify existing teams password hash
        List<Team> teams = teamRepository.findAll();
        for (Team team : teams) {
            if (!passwordEncoder.matches("team123", team.getPasswordHash())) {
                team.setPasswordHash(teamHash);
                teamRepository.save(team);
                log.info("Updated password hash for team: {}", team.getTeamCode());
            }
        }

        long count = checkpointRepository.count();
        log.info("CHRONOS Engine Ready. Checkpoints configured: {}", count);
    }
}
