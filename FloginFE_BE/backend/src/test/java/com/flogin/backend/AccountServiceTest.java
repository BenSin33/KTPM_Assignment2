package com.flogin.backend;

import com.flogin.entity.Account;
import com.flogin.repository.AccountRepository;
import com.flogin.service.AccountService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class AccountServiceTest {

    private AccountService accountService;
    private AccountRepository accountRepository;
    private Account account;

    @BeforeEach
    void setUp() {
        this.accountRepository = mock(AccountRepository.class);
        this.accountService = new AccountService(this.accountRepository);
        this.account = new Account("ronaldo", "chibay", "vapco@gmail.com", 1);
    }

    
    @Test
    @DisplayName("Test case 1: AccountService.login - Success Case")
    void testLogin_success() {
        when(this.accountRepository.findByUsername(anyString())).thenReturn(Optional.of(this.account));
        Account result = accountService.login("ronaldo", "chibay");
        assertAll("account",
                () -> assertNotNull(result),
                () -> assertEquals("ronaldo", result.getUsername()),
                () -> assertEquals("chibay", result.getPassword()),
                () -> assertEquals("vapco@gmail.com", result.getEmail()),
                () -> assertEquals(1, result.getActive())

            );
        verify(accountRepository, times(1)).findByUsername(anyString());
    }

    @Test
    @DisplayName("Test case 2: AccountService.login - Empty Username")
    void testLogin_emptyUsername() {
        String username = "";
        String password = "nogoat";
        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            accountService.login(username, password);
        });
        assertEquals(ex.getMessage(), "Username is required");
        verify(accountRepository, never()).findByUsername(anyString());
    }

    @Test
    @DisplayName("Test case 3: AccountService.login - Short Password")
    void testLogin_shortPassword() {
        String username = "ronaldo";
        String password = "no";
        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            accountService.login(username, password);
        });
        assertEquals(ex.getMessage(), "Password must be at least 6 characters");
        verify(accountRepository, never()).findByUsername(anyString());
    }

    @Test
    @DisplayName("Test case 4: AccountService.login - Invalid Username Format")
    void testLogin_invalidUsername() {
        String username = "ronaldo@ronaldo";
        String password = "nogoat";

        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            accountService.login(username, password);
        });
        assertEquals(ex.getMessage(), "Username can only contain letters, numbers, ., -, _");
        verify(accountRepository, never()).findByUsername(anyString());
    }

    @Test
    @DisplayName("Test case 5: AccountService.login - Account Not Found")
    void testLogin_accountNotFound() {
        when(this.accountRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            accountService.login("wrongusername", "nogoat");
        });
        assertEquals(ex.getMessage(), "Invalid username or password");
        verify(accountRepository, times(1)).findByUsername(anyString());
    }
    @Test
    @DisplayName("Test case 6: AccountService.login - Short Username")
    void testLogin_shortUsername() {
        String username = "ro";
        String password = "nogoat";
        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            accountService.login(username, password);
        });
        assertEquals(ex.getMessage(), "Username must be longer than 3 characters");
        verify(accountRepository, never()).findByUsername(anyString());
    }

    

    @Test
    @DisplayName("Test case 7: Test AccountService.login - Empty Password")
    void testLogin_emptyPassword() {
        String username = "ronaldo";
        String password = "";
        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            accountService.login(username, password);
        });
        assertEquals(ex.getMessage(), "Password is required");
        verify(accountRepository, never()).findByUsername(anyString());
    }

    @Test
    @DisplayName("Test case 8: AccountService.login - Wrong Password")
    void testLogin_wrongPassword() {
        when(this.accountRepository.findByUsername(anyString()))
                .thenReturn(Optional.of(new Account("ronaldo", "nogoat", "chibay@gmail.com", 1)));

        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            accountService.login("ronaldo", "iamgoat"); // mật khẩu sai
        });

        assertEquals("Incorrect password", ex.getMessage());
        verify(accountRepository, times(1)).findByUsername(anyString());
    }
    @Test
    @DisplayName("Test case 9: AccountService.login - Username is Null")
    void testLogin_usernameNull(){
        String username = null;
        String password = "nogoat";
        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            accountService.login(username, password);
        });
        assertEquals(ex.getMessage(), "Username is required");
        verify(accountRepository, never()).findByUsername(isNull());
    }
    @Test 
    @DisplayName("Test case 10: AccountService.login - Password is Null")
    void testLogin_passwordNull(){
        String username = "ronaldo";
        String password = null;
        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            accountService.login(username, password);
        });
        assertEquals(ex.getMessage(), "Password is required");
        verify(accountRepository, never()).findByUsername(anyString());
    }

}
