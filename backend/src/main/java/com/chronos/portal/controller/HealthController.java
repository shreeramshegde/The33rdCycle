package com.chronos.portal.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@Tag(name = "Health", description = "Application and database health monitoring")
public class HealthController {

    @GetMapping("/api/health")
    @Operation(summary = "Healthcheck Endpoint", description = "Pings service status for Render and monitoring")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "CHRONOS Submission Engine");
        status.put("timestamp", ZonedDateTime.now());
        status.put("environment", "production");
        return ResponseEntity.ok(status);
    }
}
