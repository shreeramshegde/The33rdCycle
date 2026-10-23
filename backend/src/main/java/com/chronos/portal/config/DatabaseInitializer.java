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

        // Ensure starter teams have valid BCrypt hash for "team123"
        String teamHash = passwordEncoder.encode("team123");
        List<Team> teams = teamRepository.findAll();
        for (Team team : teams) {
            // Update password hash if needed
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
