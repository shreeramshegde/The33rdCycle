package com.chronos.portal;

import com.chronos.portal.entity.SystemConfig;
import com.chronos.portal.entity.Team;
import com.chronos.portal.repository.SubmissionRepository;
import com.chronos.portal.repository.SystemConfigRepository;
import com.chronos.portal.repository.TeamRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("Integration Tests - Full API Lifecycle")
public class ChronosPortalIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private SystemConfigRepository systemConfigRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static String teamToken;
    private static String adminToken;

    @BeforeEach
    void ensureCleanState() {
        // Ensure portal is unfrozen at start
        SystemConfig config = systemConfigRepository.findByConfigKey("PORTAL_FROZEN")
                .orElse(new SystemConfig("PORTAL_FROZEN", "FALSE", "Event lock"));
        if (!"FALSE".equalsIgnoreCase(config.getConfigValue())) {
            config.setConfigValue("FALSE");
            systemConfigRepository.save(config);
        }

        // Ensure TEAM_01 has active account with known test password
        teamRepository.findByTeamCode("TEAM_01").ifPresent(team -> {
            team.setPasswordHash(passwordEncoder.encode("team123"));
            team.setIsActive(true);
            teamRepository.save(team);
        });
    }

    @Test
    @Order(1)
    @DisplayName("1. Health Endpoint should return UP")
    void testHealthCheck() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")))
                .andExpect(jsonPath("$.service", containsString("CHRONOS")));
    }

    @Test
    @Order(2)
    @DisplayName("2. Team Login with valid credentials should return JWT")
    void testTeamLoginSuccess() throws Exception {
        Map<String, String> creds = new HashMap<>();
        creds.put("teamCode", "TEAM_01");
        creds.put("password", "team123");

        MvcResult result = mockMvc.perform(post("/api/auth/team/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creds)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.identifier", is("TEAM_01")))
                .andExpect(jsonPath("$.role", is("ROLE_TEAM")))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        teamToken = objectMapper.readTree(responseBody).get("token").asText();
    }

    @Test
    @Order(3)
    @DisplayName("3. Team Login with invalid credentials should return 401 Unauthorized")
    void testTeamLoginFailure() throws Exception {
        Map<String, String> creds = new HashMap<>();
        creds.put("teamCode", "TEAM_01");
        creds.put("password", "wrongpassword");

        mockMvc.perform(post("/api/auth/team/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creds)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @Order(4)
    @DisplayName("4. Admin Login should return JWT with ROLE_ADMIN")
    void testAdminLoginSuccess() throws Exception {
        Map<String, String> creds = new HashMap<>();
        creds.put("username", "admin");
        creds.put("password", "admin123");

        MvcResult result = mockMvc.perform(post("/api/auth/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creds)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.role", is("ROLE_ADMIN")))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        adminToken = objectMapper.readTree(responseBody).get("token").asText();
    }

    @Test
    @Order(5)
    @DisplayName("5. Team Portal Status should list all 6 checkpoints")
    void testGetPortalStatus() throws Exception {
        mockMvc.perform(get("/api/portal/status")
                        .header("Authorization", "Bearer " + teamToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.teamCode", is("TEAM_01")))
                .andExpect(jsonPath("$.totalScore", greaterThanOrEqualTo(100)))
                .andExpect(jsonPath("$.checkpoints", hasSize(6)))
                .andExpect(jsonPath("$.isPortalFrozen", is(false)));
    }

    @Test
    @Order(6)
    @DisplayName("6. Team Submit Correct Answer for CP_4 (CH-0-33) should award 20 points")
    void testSubmitCorrectAnswer() throws Exception {
        // Clean previous submissions for CP_4 by TEAM_01 to ensure idempotent test
        Team team = teamRepository.findByTeamCode("TEAM_01").orElseThrow();
        submissionRepository.deleteAll(submissionRepository.findByTeamIdAndCheckpointId(team.getId(), "CP_4"));

        Map<String, String> submission = new HashMap<>();
        submission.put("checkpointId", "CP_4");
        submission.put("answer", "CH-0-33");

        mockMvc.perform(post("/api/portal/submit")
                        .header("Authorization", "Bearer " + teamToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(submission)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isCorrect", is(true)))
                .andExpect(jsonPath("$.pointsAwarded", is(20)))
                .andExpect(jsonPath("$.message", containsString("VERIFIED")));
    }

    @Test
    @Order(7)
    @DisplayName("7. Duplicate submission for already-solved checkpoint should return alreadyCompleted=true")
    void testSubmitDuplicateAnswer() throws Exception {
        Map<String, String> submission = new HashMap<>();
        submission.put("checkpointId", "CP_4");
        submission.put("answer", "CH-0-33");

        mockMvc.perform(post("/api/portal/submit")
                        .header("Authorization", "Bearer " + teamToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(submission)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.alreadyCompleted", is(true)))
                .andExpect(jsonPath("$.message", containsString("ALREADY_VERIFIED")));
    }

    @Test
    @Order(8)
    @DisplayName("8. Submit Incorrect Answer should reject and deduct 5 points penalty")
    void testSubmitIncorrectAnswer() throws Exception {
        // Clean previous submissions for CP_5 by TEAM_01 to ensure idempotent test
        Team team = teamRepository.findByTeamCode("TEAM_01").orElseThrow();
        submissionRepository.deleteAll(submissionRepository.findByTeamIdAndCheckpointId(team.getId(), "CP_5"));

        Map<String, String> submission = new HashMap<>();
        submission.put("checkpointId", "CP_5");
        submission.put("answer", "2054"); // Incorrect, correct is 23:59:33

        mockMvc.perform(post("/api/portal/submit")
                        .header("Authorization", "Bearer " + teamToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(submission)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isCorrect", is(false)))
                .andExpect(jsonPath("$.pointsAwarded", is(-5)))
                .andExpect(jsonPath("$.message", containsString("SIGNAL REJECTED")));
    }

    @Test
    @Order(9)
    @DisplayName("9. Admin Portal Freeze should block team submissions")
    void testAdminFreezeAndBlockSubmissions() throws Exception {
        // Admin freezes the portal
        mockMvc.perform(post("/api/admin/portal/freeze")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        // Team attempts to submit while frozen -> Expect 403 Forbidden
        Map<String, String> submission = new HashMap<>();
        submission.put("checkpointId", "CP_5");
        submission.put("answer", "23:59:33");

        mockMvc.perform(post("/api/portal/submit")
                        .header("Authorization", "Bearer " + teamToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(submission)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("SUBMISSION_FROZEN")));

        // Admin unfreezes the portal for normal operations
        mockMvc.perform(post("/api/admin/portal/unfreeze")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));
    }

    @Test
    @Order(10)
    @DisplayName("10. Admin Leaderboard should return ranked teams")
    void testAdminLeaderboard() throws Exception {
        mockMvc.perform(get("/api/admin/leaderboard")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(5))))
                .andExpect(jsonPath("$[0].totalScore", greaterThanOrEqualTo(100)));
    }
}
