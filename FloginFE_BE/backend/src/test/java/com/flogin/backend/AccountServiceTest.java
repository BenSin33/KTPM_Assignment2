package com.flogin.backend;

import com.flogin.entity.Account;
import com.flogin.repository.AccountRepository;
import com.flogin.service.AccountService;

import org.junit.jupiter.api.BeforeEach;
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
    void testLogin_success() {
        when(this.accountRepository.findByUsername("ronaldo")).thenReturn(Optional.of(this.account));
        Account result = accountService.login(this.account.getUsername(), this.account.getPassword());
        assertAll("account",
                () -> assertNotNull(result),
                () -> assertEquals(this.account.getUsername(), result.getUsername()),
                () -> assertEquals(this.account.getPassword(), result.getPassword()));
        verify(accountRepository, times(1)).findByUsername("ronaldo");
    }

    @Test
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
    void testLogin_accountNotFound() {
        when(this.accountRepository.findByUsername(account.getUsername())).thenReturn(Optional.empty());
        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            accountService.login(account.getUsername(), account.getPassword());
        });
        assertEquals(ex.getMessage(), "Invalid username or password");
        verify(accountRepository, times(1)).findByUsername("ronaldo");
    }

    @Test
    void testLogin_wrongPassword() {
        when(this.accountRepository.findByUsername("ronaldo"))
                .thenReturn(Optional.of(new Account("ronaldo", "nogoat", "chibay@gmail.com", 1)));

        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            accountService.login("ronaldo", "iamgoat"); // mật khẩu sai
        });

        assertEquals("Incorrect password", ex.getMessage());
        verify(accountRepository, times(1)).findByUsername("ronaldo");
    }

    @Test
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
    void testLogin_shortUsername() {
        String username = "ro";
        String password = "nogoat";
        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            accountService.login(username, password);
        });
        assertEquals(ex.getMessage(), "Username must be longer than 3 characters");
        verify(accountRepository, never()).findByUsername(anyString());
    }

}
