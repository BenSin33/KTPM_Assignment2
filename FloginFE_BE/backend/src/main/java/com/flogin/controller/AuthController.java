package com.flogin.controller;

import com.flogin.entity.Account;
import com.flogin.service.AccountService;
import com.flogin.util.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;



@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    

    private final AccountService accountService;

    public AuthController(AccountService accountService) {
        this.accountService = accountService;
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        Map<String, Object> response = new HashMap<>();
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
            if(e.getMessage().contains("Invalid username or password")||e.getMessage().contains("Incorrect password")) {
                return ResponseEntity.status(401).body(response);
            } else {
                 return ResponseEntity.badRequest().body(response);
            }
        }
    }
}

