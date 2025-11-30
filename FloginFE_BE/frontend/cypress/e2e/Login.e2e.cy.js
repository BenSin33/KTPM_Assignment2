// frontend/cypress/e2e/login.e2e.cy.js

describe('Login E2E Tests (Xác thực và Validation)', () => {

    // Test thành công (Happy Path)
    it('1. Nên đăng nhập thành công và chuyển hướng đến trang sản phẩm', () => {
        // Sử dụng một tài khoản hợp lệ
        const validUser = 'tester';
        const validPass = '123';

        cy.visit('/login');

        cy.get('[data-testid="username-input"]').type(validUser);
        cy.get('[data-testid="password-input"]').type(validPass);
        cy.get('[data-testid="login-button"]').click();

        // 1. Xác nhận thông báo thành công
        cy.get('[data-testid="login-message"]').should('contain', 'Đăng nhập thành công!');

        // 2. Xác nhận chuyển hướng
        cy.url().should('include', '/product');
    });

    // Test thất bại (Sai thông tin)
    it('2. Nên hiển thị thông báo lỗi khi đăng nhập thất bại', () => {
        cy.visit('/login');

        cy.get('[data-testid="username-input"]').type('invaliduser');
        cy.get('[data-testid="password-input"]').type('wrongpass');
        cy.get('[data-testid="login-button"]').click();

        // Xác nhận thông báo lỗi (từ API)
        cy.get('[data-testid="login-message"]').should('contain', 'Đăng nhập thất bại');
        // Hoặc thông báo lỗi hệ thống
    });

    // Test Validation (Client-side)
    it('3. Nên hiển thị lỗi validation khi bỏ trống username', () => {
        cy.visit('/login');

        // Bỏ trống username, điền password
        cy.get('[data-testid="password-input"]').type('anypassword');

        // Click nút đăng nhập
        cy.get('[data-testid="login-button"]').click();

        // Xác nhận lỗi validation client-side
        cy.get('[data-testid="username-error"]').should('be.visible')
            .and('contain', 'Vui lòng nhập username');

        // Kiểm tra không có cuộc gọi API nào được thực hiện (optional)
    });
});