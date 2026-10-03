package com.example.demo.controller;

import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/protected")
public class ProtectedController {

    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getProtectedData(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "This is secured data accessible only with a valid JWT token!",
                "authenticatedUser", authentication.getName(),
                "authorities", authentication.getAuthorities()
        ));
    }

    @GetMapping("/admin-only")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> getAdminData() {
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Welcome Admin! You have access to this restricted endpoint."
        ));
    }

    @GetMapping("/error-test")
    public ResponseEntity<Void> triggerError(@RequestParam(defaultValue = "not-found") String type) {
        if ("not-found".equalsIgnoreCase(type)) {
            throw new ResourceNotFoundException("Resource with ID 999 was not found in our database");
        } else if ("bad-request".equalsIgnoreCase(type)) {
            throw new BadRequestException("The provided request parameters are invalid or malformed");
        } else {
            throw new RuntimeException("Simulated unexpected internal server error");
        }
    }
}
