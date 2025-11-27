package com.flogin.controller;

import com.flogin.entity.Account;
import com.flogin.service.AccountService;
import com.flogin.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;



@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        Map<String, Object> response = new HashMap<>();

        if (username == null || username.trim().isEmpty()) {
            response.put("message", "Username is required");
            response.put("success",false);
            return ResponseEntity.badRequest().body(response);
        }

        if (username.length() < 3) {
            response.put("message", "Username must be longer than 3 characters");
            response.put("success",false);
            return ResponseEntity.badRequest().body(response);
        }

        if (password == null || password.trim().isEmpty()) {
            response.put("message", "Password is required");
            response.put("success",false);
            return ResponseEntity.badRequest().body(response);
        }

        if (password.length() < 6) {
            response.put("message", "Password must be at least 6 characters");
            response.put("success",false);
            return ResponseEntity.badRequest().body(response);
        }

        try {
            Account account = accountService.login(username, password);
            response.put("message", "Login successful");
            response.put("success",true);
            String token = JwtUtil.generateToken(username); // sử dụng JwtUtil
            response.put("token", token);
            response.put("username", account.getUsername());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("message", e.getMessage());
            response.put("success",false);
            return ResponseEntity.badRequest().body(response);
        }
    }
}

