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
import com.flogin.service.AccountService;
import com.flogin.entity.Account; 

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@DisplayName("4.1.2 Backend API Integration - Login Tests (Full Coverage)")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AccountService accountService;

    // --- CASE 1: ĐĂNG NHẬP THÀNH CÔNG (Happy Path) ---
    @Test
    @DisplayName("1. Login Success: Trả về Token và thông tin User")
    void testLogin_Success() throws Exception {
        // Given
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", "testuser");
        loginRequest.put("password", "Test123456");

        Account mockAccount = new Account();
        mockAccount.setUsername("testuser");
        
        when(accountService.login("testuser", "Test123456")).thenReturn(mockAccount);

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .header("Origin", "http://localhost:5173"))
                
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.token").exists())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    // --- CASE 2: VALIDATION - USERNAME RỖNG ---
    @Test
    @DisplayName("2. Validation: Username rỗng -> Lỗi 400")
    void testLogin_UsernameEmpty() throws Exception {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", ""); // Rỗng
        loginRequest.put("password", "Test123456");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .header("Origin", "http://localhost:5173"))
                
                .andExpect(status().isBadRequest()) // 400
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Username is required"));
    }

    // --- CASE 3: VALIDATION - USERNAME QUÁ NGẮN ---
    @Test
    @DisplayName("3. Validation: Username ngắn (<3) -> Lỗi 400")
    void testLogin_UsernameShort() throws Exception {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", "ab"); // Ngắn
        loginRequest.put("password", "Test123456");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .header("Origin", "http://localhost:5173"))
                
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Username must be longer than 3 characters"));
    }

    // --- CASE 4: VALIDATION - PASSWORD RỖNG ---
    @Test
    @DisplayName("4. Validation: Password rỗng -> Lỗi 400")
    void testLogin_PasswordEmpty() throws Exception {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", "testuser");
        loginRequest.put("password", ""); // Rỗng

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .header("Origin", "http://localhost:5173"))
                
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Password is required"));
    }

    // --- CASE 5: VALIDATION - PASSWORD QUÁ NGẮN ---
    @Test
    @DisplayName("5. Validation: Password ngắn (<6) -> Lỗi 400")
    void testLogin_PasswordShort() throws Exception {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", "testuser");
        loginRequest.put("password", "123"); // Ngắn

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .header("Origin", "http://localhost:5173"))
                
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Password must be at least 6 characters"));
    }

    // --- CASE 6: SERVICE EXCEPTION (Sai pass / Không tìm thấy user) ---
    @Test
    @DisplayName("6. Service Error: Sai thông tin đăng nhập -> Lỗi 400")
    void testLogin_ServiceException() throws Exception {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", "wronguser");
        loginRequest.put("password", "wrongpass");

        // Giả lập Service ném lỗi (giống như khi nhập sai pass)
        when(accountService.login(anyString(), anyString()))
            .thenThrow(new IllegalArgumentException("Invalid username or password"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .header("Origin", "http://localhost:5173"))
                
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid username or password"));
    }
}