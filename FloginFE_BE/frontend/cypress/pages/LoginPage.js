// frontend/cypress/pages/LoginPage.js

class LoginPage {
    // Định nghĩa Locators (Selectors)
    elements = {
        usernameInput: () => cy.get('[data-testid="username-input"]'),
        passwordInput: () => cy.get('[data-testid="password-input"]'),
        loginButton: () => cy.get('[data-testid="login-button"]'),
        
        // Selector thông báo lỗi/thành công (Dựa trên code React và đề bài)
        // Lưu ý: Đề bài dùng 'login-message' nhưng code React dùng div style, ta dùng data-testid để dễ test E2E.
        loginMessage: () => cy.get('[data-testid="login-message"]'), 
        
        // Selector cho lỗi validation (Dựa trên ví dụ đề bài)
        usernameError: () => cy.get('[data-testid="username-error"]'),
    };

    // Hành động: Điều hướng đến trang đăng nhập. Giả định trang login là trang gốc (/)
    visit() {
        cy.visit('/'); 
    }

    // Hành động: Điền thông tin đăng nhập
    fillLoginForm(username, password) {
        this.elements.usernameInput().clear().type(username);
        this.elements.passwordInput().clear().type(password);
    }

    // Hành động: Click nút đăng nhập
    submitLogin() {
        this.elements.loginButton().click();
    }

    // Phương thức tổng hợp thực hiện cả quá trình đăng nhập
    login(username, password) {
        // Không gọi visit() ở đây để các test case có thể tự gọi visit() hoặc mock API trước.
        this.fillLoginForm(username, password);
        this.submitLogin();
    }

    // Getters cho Assertions
    getNotificationMessage() {
        return this.elements.loginMessage();
    }
    
    getUsernameError() {
        return this.elements.usernameError();
    }
}

export default LoginPage; // Export class thay vì instance