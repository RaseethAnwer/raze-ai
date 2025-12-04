package com.heythere.controller;

import com.heythere.model.User;
import com.heythere.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            String token = authService.register(user);
            return ResponseEntity.ok(Map.of("token", token, "userId", authService.getUserByEmail(user.getEmail()).getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String token = authService.login(loginRequest.get("email"), loginRequest.get("password"));
            return ResponseEntity.ok(Map.of("token", token, "userId", authService.getUserByEmail(loginRequest.get("email")).getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
    }
}
