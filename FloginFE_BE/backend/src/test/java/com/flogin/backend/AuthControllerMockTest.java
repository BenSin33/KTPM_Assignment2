package com.flogin.backend;
import com.flogin.controller.AuthController;
import com.flogin.entity.Account;
import com.flogin.service.AccountService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.HashMap;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.*;
import org.mockito.MockedStatic;
import static org.mockito.Mockito.mockStatic;
import static org.junit.jupiter.api.Assertions.*;
import com.flogin.util.JwtUtil;

import io.jsonwebtoken.Jwt;

class AuthControllerMockTest {

    private AuthController authController;
    private AccountService accountService; // mock thủ công
    public Map<String, String> createLoginRequest (String username, String password) {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", username);
        loginRequest.put("password", password);
        return loginRequest;
    }

    @BeforeEach
    void setUp() {
        accountService = mock(AccountService.class);
        authController = new AuthController(accountService); // inject mock vào controller
    }
    @Test 
    @DisplayName("Test case 1: AuthController.login - Success Case")
    void login_succes(){
        Account account =  new Account("Test123","test123","gmail@gmail.com",1);
        when(accountService.login(anyString(), anyString())).thenReturn(account);
        ResponseEntity<Map<String, Object>> response = authController.login(createLoginRequest("Test123", "test123"));
        Map<String, Object> body = response.getBody();
        assertAll("response",
                () -> assertEquals(200, response.getStatusCodeValue()),
                () -> assertNotNull(body),
                () -> assertEquals(true, body.get("success")),
                () -> assertEquals("Login successful", body.get("message")),
                () -> assertNotNull(body.get("token"))

        );
        verify(accountService, times(1)).login(anyString(),anyString());
    }
    @Test
    @DisplayName("Test case 2: AuthController.login - Empty Username")
    void login_emptyUsername(){
        when(accountService.login(anyString(), anyString())).thenThrow(new IllegalArgumentException("Username is required"));
        ResponseEntity<Map<String, Object>> response = authController.login(createLoginRequest("","test123"));
        Map<String, Object> body = response.getBody();
        assertAll("response",
            () -> assertEquals(400, response.getStatusCodeValue()),
            ()-> assertNotNull(body),
            ()->assertEquals("Username is required",body.get("message")),
            ()->assertEquals(false,body.get("success"))
        );
        verify(accountService,times(1)).login(anyString(), anyString());
    }
    @Test
    @DisplayName("Test case 3: AuthController.login - Short Password")  
    void login_shortPassword(){
        when(accountService.login(anyString(), anyString())).thenThrow(new IllegalArgumentException("Password must be at least 6 characters"));
        ResponseEntity<Map<String, Object>> response = authController.login(createLoginRequest
        ("Test123","123"));
        Map<String, Object> body = response.getBody();  
        assertAll("response",
            () -> assertEquals(400, response.getStatusCodeValue()),
            ()-> assertNotNull(body),
            ()->assertEquals("Password must be at least 6 characters",body.get("message")),
            ()->assertEquals(false,body.get("success"))
        );
        verify(accountService,times(1)).login(anyString(), anyString());

    }
    @Test
    @DisplayName("Test case 4: AuthController.login - Username can only contain letters, numbers, ., -, _")
    void login_invalidUsername(){
        when(accountService.login(anyString(), anyString())).thenThrow(new IllegalArgumentException("Username can only contain letters, numbers, ., -, _"));
        ResponseEntity<Map<String, Object>> response = authController.login(createLoginRequest("Test@123","test123"));
        Map<String, Object> body = response.getBody();
        assertAll("response",
            () -> assertEquals(400, response.getStatusCodeValue()),
            ()-> assertNotNull(body),
            ()->assertEquals("Username can only contain letters, numbers, ., -, _",body.get("message")),
            ()->assertEquals(false,body.get("success"))
        );
        verify(accountService,times(1)).login(anyString(), anyString());

    }

    @Test 
    @DisplayName("Test case 5: AuthController.login - Account Not Found")
    void login_accountNotFound(){
        when(accountService.login(anyString(), anyString())).thenThrow(new IllegalArgumentException("Invalid username or password"));
        ResponseEntity<Map<String,Object>> response = authController.login(createLoginRequest("wrongusername","wrongpassword"));
        Map<String, Object> body = response.getBody();
        assertAll("response",
            ()->assertEquals(401, response.getStatusCodeValue()),
            ()->assertNotNull(body),
            ()->assertEquals(false, body.get("success")),
            ()->assertEquals("Invalid username or password", body.get("message"))
        );
        verify(accountService, times(1)).login(anyString(), anyString());
    }
    @Test
    @DisplayName("Test case 6: AuthController.login - Short Username")
    void login_shortUsername(){
        when(accountService.login(anyString(), anyString())).thenThrow(new IllegalArgumentException("Username must be longer than 3 characters"));
        ResponseEntity<Map<String, Object>> response = authController.login(createLoginRequest("ab", "test123"));
        Map<String, Object> body = response.getBody();
        assertAll("reponse",
            () -> assertEquals(400, response.getStatusCodeValue()),
            ()->assertNotNull(body),
            ()->assertEquals("Username must be longer than 3 characters",body.get("message")),
            ()->assertEquals(false, body.get("success"))
        );
        verify(accountService,times(1)).login(anyString(), anyString());

    }
    @Test 
    @DisplayName("Test case 7: AuthController.login - Empty Password")
    void login_emptyPassword(){
        when(accountService.login(anyString(), anyString())).thenThrow(new IllegalArgumentException("Password is required"));
        ResponseEntity<Map<String, Object>> response = authController.login(createLoginRequest("Test123",""));
        Map<String, Object> body = response.getBody();
        assertAll("response",
            () -> assertEquals(400, response.getStatusCodeValue()),
            ()-> assertNotNull(body),
            ()->assertEquals("Password is required",body.get("message")),
            ()->assertEquals(false,body.get("success"))
        );
        verify(accountService,times(1)).login(anyString(), anyString());

    }
    
    @Test
    @DisplayName("Test case 8: AuthController.login - Wrong Password")
    void login_wrongPassword(){
        when(accountService.login(anyString(),anyString())).thenThrow(new IllegalArgumentException("Incorrect password"));
        ResponseEntity<Map<String, Object>> response = authController.login(createLoginRequest("Test123", "wrongpassword"));
        Map<String, Object> body = response.getBody();
        assertAll("response",
            ()->assertEquals(401, response.getStatusCodeValue()),
            ()->assertNotNull(body),
            ()->assertEquals(false,body.get("success")),
            ()->assertEquals("Incorrect password",body.get("message"))
        );
        verify(accountService, times(1)).login(anyString(), anyString());
    }
    @Test 
    @DisplayName("Test case 9: AuthController.login - Username is Null")
    void login_usernameNull(){
        when(accountService.login(isNull(), anyString())).thenThrow(new IllegalArgumentException("Username is required"));
        ResponseEntity<Map<String, Object>> response = authController.login(createLoginRequest(null, "test123"));
        Map<String, Object> body = response.getBody();  
        assertAll("response",
            () -> assertEquals(400, response.getStatusCodeValue()),
            ()-> assertNotNull(body),
            ()->assertEquals("Username is required",body.get("message")),
            ()->assertEquals(false,body.get("success"))
        );
        verify(accountService,times(1)).login(isNull(), anyString());
    }
    @Test
    @DisplayName("Test case 10: AuthController.login - Password is Null")
    void login_passwordNull(){
        when(accountService.login(anyString(), isNull())).thenThrow(new IllegalArgumentException("Password is required"));
        ResponseEntity<Map<String, Object>> response = authController.login(createLoginRequest("Test123", null));
        Map<String, Object> body = response.getBody();  
        assertAll("response",
            () -> assertEquals(400, response.getStatusCodeValue()),
            ()-> assertNotNull(body),
            ()->assertEquals("Password is required",body.get("message")),
            ()->assertEquals(false,body.get("success"))
        );
        verify(accountService,times(1)).login(anyString(), isNull());
    }   
}
