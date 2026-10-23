package com.chronos.portal.controller;

import com.chronos.portal.dto.request.AdminLoginRequest;
import com.chronos.portal.dto.request.TeamLoginRequest;
import com.chronos.portal.dto.response.AuthResponse;
import com.chronos.portal.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Login endpoints for Teams and IEEE Administrators")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/team/login")
    @Operation(summary = "Team Login", description = "Authenticates a participant team via team code and PIN")
    public ResponseEntity<AuthResponse> teamLogin(@Valid @RequestBody TeamLoginRequest request) {
        return ResponseEntity.ok(authService.teamLogin(request));
    }

    @PostMapping("/admin/login")
    @Operation(summary = "Admin Login", description = "Authenticates an IEEE Core administrator")
    public ResponseEntity<AuthResponse> adminLogin(@Valid @RequestBody AdminLoginRequest request) {
        return ResponseEntity.ok(authService.adminLogin(request));
    }
}
