package com.chronos.portal.service;

import com.chronos.portal.dto.request.AdminLoginRequest;
import com.chronos.portal.dto.request.TeamLoginRequest;
import com.chronos.portal.dto.response.AuthResponse;
import com.chronos.portal.entity.Admin;
import com.chronos.portal.entity.Team;
import com.chronos.portal.repository.AdminRepository;
import com.chronos.portal.repository.TeamRepository;
import com.chronos.portal.security.JwtUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;

@Service
public class AuthService {

    private final TeamRepository teamRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(TeamRepository teamRepository,
                       AdminRepository adminRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.teamRepository = teamRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse teamLogin(TeamLoginRequest request) {
        String teamCode = request.getTeamCode().trim().toUpperCase();
        Team team = teamRepository.findByTeamCode(teamCode)
                .orElseThrow(() -> new BadCredentialsException("Invalid Team Code. Please check your assigned team code (e.g. TEAM_01)."));

        if (!Boolean.TRUE.equals(team.getIsActive())) {
            throw new BadCredentialsException("Team account is currently deactivated");
        }

        // First-Time Registration / Dynamic Password Claim
        if (team.getPasswordHash() == null || team.getPasswordHash().trim().isEmpty()) {
            if (request.getPassword() == null || request.getPassword().trim().length() < 3) {
                throw new IllegalArgumentException("First-time setup: please choose a password with at least 3 characters.");
            }
            team.setPasswordHash(passwordEncoder.encode(request.getPassword().trim()));
            team.setLastActive(ZonedDateTime.now());
            teamRepository.save(team);
        } else {
            // Existing team password verification
            if (!passwordEncoder.matches(request.getPassword(), team.getPasswordHash())) {
                throw new BadCredentialsException("Incorrect password for " + team.getTeamCode() + ". If your team forgot its password, request a reset from NISB Admin.");
            }
            team.setLastActive(ZonedDateTime.now());
            teamRepository.save(team);
        }

        String token = jwtUtil.generateToken(team.getTeamCode(), "ROLE_TEAM", team.getTeamName());

        return new AuthResponse(
                token,
                team.getTeamCode(),
                team.getTeamName(),
                "ROLE_TEAM",
                team.getTotalScore()
        );
    }

    public AuthResponse adminLogin(AdminLoginRequest request) {
        Admin admin = adminRepository.findByUsername(request.getUsername().trim())
                .orElseThrow(() -> new BadCredentialsException("Invalid Admin Credentials"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            throw new BadCredentialsException("Invalid Admin Credentials");
        }

        String token = jwtUtil.generateToken(admin.getUsername(), admin.getRole(), admin.getFullName());

        return new AuthResponse(
                token,
                admin.getUsername(),
                admin.getFullName(),
                admin.getRole(),
                0
        );
    }
}
