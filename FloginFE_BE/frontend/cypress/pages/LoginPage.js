// frontend/cypress/pages/LoginPage.js

class LoginPage {
    // 1. Định nghĩa các Locators (bộ định vị phần tử)
    // Sử dụng data-testid mà bạn đã thêm vào Login.jsx
    elements = {
        usernameInput: () => cy.get('[data-testid="username-input"]'),
        passwordInput: () => cy.get('[data-testid="password-input"]'),
        loginButton: () => cy.get('[data-testid="login-button"]'),
        usernameError: () => cy.get('[data-testid="username-error"]'), // Lỗi validation client-side
        loginMessage: () => cy.get('[data-testid="login-message"]'),   // Thông báo chung từ API
    };

    // ------------------- HÀNH ĐỘNG (Actions) -------------------

    visit() {
        // Điều hướng đến trang đăng nhập
        cy.visit('/login');
    }

    fillLoginForm(username, password) {
        // Điền username và password vào các trường input
        this.elements.usernameInput().type(username);
        this.elements.passwordInput().type(password);
    }

    submitLogin() {
        // Click nút đăng nhập
        this.elements.loginButton().click();
    }

    login(username, password) {
        // Phương thức tổng hợp thực hiện cả quá trình đăng nhập
        this.visit();
        this.fillLoginForm(username, password);
        this.submitLogin();
    }

    // ------------------- LOCATORS & GETTERS (Lấy giá trị) -------------------

    getLoginMessage() {
        // Lấy phần tử thông báo chung (thành công/thất bại API)
        return this.elements.loginMessage();
    }

    getUsernameValidationError() {
        // Lấy phần tử chứa lỗi validation của Username
        return this.elements.usernameError();
    }
}

export default LoginPage;