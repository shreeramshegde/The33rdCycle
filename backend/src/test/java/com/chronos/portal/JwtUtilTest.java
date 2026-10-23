package com.chronos.portal;

import com.chronos.portal.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Unit Tests - JWT Token Lifecycle")
public class JwtUtilTest {

    private JwtUtil jwtUtil;
    private final String secret = "c3VwZXJzZWNyZXRjaHJvbm9zcHJvamVjdGtleTIwMjZpZWVlbmlzYm5zb2M=";
    private final long expirationMs = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil(secret, expirationMs);
    }

    @Test
    @DisplayName("Should generate a valid JWT token and extract subject and role correctly")
    void testTokenGenerationAndExtraction() {
        String token = jwtUtil.generateToken("TEAM_01", "ROLE_TEAM", "Paradox Seekers");

        assertNotNull(token);
        assertTrue(token.split("\\.").length == 3, "JWT should have three dot-separated segments");
        assertTrue(jwtUtil.isTokenValid(token));
        assertEquals("TEAM_01", jwtUtil.extractSubject(token));
        assertEquals("ROLE_TEAM", jwtUtil.extractRole(token));
    }

    @Test
    @DisplayName("Should reject malformed or invalid tokens")
    void testInvalidToken() {
        assertFalse(jwtUtil.isTokenValid("invalid.token.string"));
        assertFalse(jwtUtil.isTokenValid(""));
    }
}
