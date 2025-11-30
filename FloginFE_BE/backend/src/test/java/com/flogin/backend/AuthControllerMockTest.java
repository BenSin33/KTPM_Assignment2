package com.flogin.backend; // Hoặc package tương ứng trong project của bạn

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.controller.AuthController;
import com.flogin.entity.Account;
import com.flogin.service.AccountService;
import com.flogin.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController Tests")
class AuthControllerMockTest {

    private MockMvc mockMvc;

    @Mock
    private AccountService accountService;

    @InjectMocks
    private AuthController authController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    // Helper method để tạo request body
    private String createLoginRequestBody(String username, String password) throws Exception {
        Map<String, String> loginRequest = new HashMap<>();
        if (username != null) {
            loginRequest.put("username", username);
        }
        if (password != null) {
            loginRequest.put("password", password);
        }
        return objectMapper.writeValueAsString(loginRequest);
    }

    @Nested
    @DisplayName("Success and Service Logic Scenarios")
    class SuccessAndServiceLogic {

        @Test
        @DisplayName("Should return 200 OK with token when login is successful")
        void login_Successful() throws Exception {
            // Arrange
            String username = "testuser";
            String password = "password123";
            String fakeToken = "fake.jwt.token";
            Account account = new Account();
            account.setUsername(username);
            when(accountService.login(username, password)).thenReturn(account);

            // Act & Assert
            try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
                mockedJwtUtil.when(() -> JwtUtil.generateToken(anyString())).thenReturn(fakeToken);

                mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createLoginRequestBody(username, password)))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.success").value(true))
                        .andExpect(jsonPath("$.message").value("Login successful"))
                        .andExpect(jsonPath("$.username").value(username))
                        .andExpect(jsonPath("$.token").value(fakeToken));
            }
        }

        @Test
        @DisplayName("Should return 400 Bad Request when AccountService throws an exception")
        void login_WhenServiceThrowsException() throws Exception {
            // Arrange
            String username = "user";
            String password = "wrongpassword";
            String errorMessage = "Invalid username or password";
            when(accountService.login(username, password)).thenThrow(new IllegalArgumentException(errorMessage));

            // Act & Assert
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(createLoginRequestBody(username, password)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value(errorMessage));
        }
    }

    @Nested
    @DisplayName("Input Validation Scenarios")
    class InputValidation {

        @Test
        @DisplayName("Should return 400 Bad Request for null username")
        void login_WithNullUsername() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(createLoginRequestBody(null, "password123")))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Username is required"));
        }

        @Test
        @DisplayName("Should return 400 Bad Request for empty username")
        void login_WithEmptyUsername() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(createLoginRequestBody(" ", "password123")))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Username is required"));
        }

        @Test
        @DisplayName("Should return 400 Bad Request for short username")
        void login_WithShortUsername() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(createLoginRequestBody("us", "password123")))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Username must be longer than 3 characters"));
        }

        @Test
        @DisplayName("Should return 400 Bad Request for null password")
        void login_WithNullPassword() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(createLoginRequestBody("testuser", null)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Password is required"));
        }

        @Test
        @DisplayName("Should return 400 Bad Request for empty password")
        void login_WithEmptyPassword() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(createLoginRequestBody("testuser", "")))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Password is required"));
        }

        @Test
        @DisplayName("Should return 400 Bad Request for short password")
        void login_WithShortPassword() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(createLoginRequestBody("testuser", "12345")))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Password must be at least 6 characters"));
        }
    }
}
