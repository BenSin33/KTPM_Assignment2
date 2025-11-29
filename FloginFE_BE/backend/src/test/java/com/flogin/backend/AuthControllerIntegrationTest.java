package com.flogin.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;


import com.flogin.controller.AuthController;
import com.flogin.service.AccountService; // Sửa thành AccountService
import com.flogin.entity.Account;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@DisplayName("4.1.2 Backend API Integration - Login Tests")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AccountService accountService;

    @Test
    @DisplayName("Test POST /api/auth/login - Success Case")
    void testLogin_Success() throws Exception {
        // --- 1. GIVEN (Chuẩn bị dữ liệu) ---

        // Chuẩn bị Request
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", "testuser");
        loginRequest.put("password", "Test123456");

        // Chuẩn bị Account giả
        Account mockAccount = new Account();
        mockAccount.setUsername("testuser");
        mockAccount.setEmail("test@example.com");

        // Dạy cho Service giả (Mock)
        when(accountService.login("testuser", "Test123456")).thenReturn(mockAccount);

        // --- 2. WHEN & THEN (Thực hiện & Kiểm tra) ---
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .header("Origin", "http://localhost:5173"))

                // (b) Kiểm tra Status Code
                .andExpect(status().isOk())

                // (b) Kiểm tra Response JSON
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.token").exists())

                // (c) Kiểm tra Headers & CORS
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }
}