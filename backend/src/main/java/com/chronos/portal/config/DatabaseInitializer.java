package com.chronos.portal.config;

import com.chronos.portal.entity.Admin;
import com.chronos.portal.entity.SystemConfig;
import com.chronos.portal.repository.AdminRepository;
import com.chronos.portal.repository.CheckpointRepository;
import com.chronos.portal.repository.SystemConfigRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final AdminRepository adminRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final CheckpointRepository checkpointRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.default.admin.username:admin}")
    private String defaultAdminUsername;

    @Value("${app.default.admin.password:admin123}")
    private String defaultAdminPassword;

    public DatabaseInitializer(AdminRepository adminRepository,
                               SystemConfigRepository systemConfigRepository,
                               CheckpointRepository checkpointRepository,
                               PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
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

        // Ensure default Admin exists with guaranteed BCrypt hash
        if (!adminRepository.existsByUsername(defaultAdminUsername)) {
            Admin admin = new Admin(
                    defaultAdminUsername,
                    passwordEncoder.encode(defaultAdminPassword),
                    "IEEE Core Administrator"
            );
            adminRepository.save(admin);
            log.info("Initialized default admin account: {} / [PROTECTED]", defaultAdminUsername);
        }

        long count = checkpointRepository.count();
        log.info("CHRONOS Engine Ready. Checkpoints configured: {}", count);
    }
}
