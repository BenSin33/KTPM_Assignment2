package com.flogin.dto;

public class AccountDTO {
    private Long id;
    private String username;
    private String email;
    private String password;
    private int active;

    // Constructor mặc định
    public AccountDTO() {}

    // Constructor đầy đủ
    public AccountDTO(Long id, String username, String email, int active) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.active = active;
    }

    // Constructor cho getAllAccounts (không cần id)
    public AccountDTO(String username, String password) {
        this.username = username;
      this.password = password;
    }

    // Getter & Setter
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public int getActive() {
        return active;
    }
    public void setActive(int active) {
        this.active = active;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
