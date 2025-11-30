// frontend/cypress/e2e/Login.e2e.cy.js
import LoginPage from '../pages/LoginPage'; // Import class LoginPage

describe('🚀 Login E2E Tests (6.1.2 - 2.5 diem)', () => {

  const loginPage = new LoginPage();
  
  // Giả định tài khoản hợp lệ: user_valid / Test123456
  const validUser = 'user1'; 
  const validUser1 = ' '; 
  const validPass = 'abc123'; 
  const invalidPass = 'wrongpass';

  beforeEach(() => {
    loginPage.visit(); // Truy cập trang Login (sử dụng baseUrl)
  });

  // --- 1. Yêu cầu d) Test UI elements interactions (0.5 điểm) ---
  it('1. [UI] Nen hien thi form login va cho phep tuong tac', () => {
    // a. Kiểm tra hiển thị
    loginPage.elements.usernameInput().should('be.visible');
    loginPage.elements.passwordInput().should('be.visible');
    loginPage.elements.loginButton().should('be.visible').and('contain', 'Đăng nhập');
    
    // b. Kiểm tra tương tác (Điền dữ liệu)
    loginPage.fillLoginForm('test_user', 'test_pass');
    loginPage.elements.usernameInput().should('have.value', 'test_user');
  });

// 2. [SUCCESS] Nen login thanh cong voi credentials hop le (Complete Flow)
it('2. [SUCCESS] Nen login thanh cong voi credentials hop le', () => {
    // 1. Hành động: Đăng nhập (sẽ gửi request và kích hoạt chuyển hướng)
    loginPage.login(validUser, validPass); 
    
    // 2. KHẲNG ĐỊNH QUAN TRỌNG NHẤT (QUYẾT ĐỊNH TEST PASS): 
    // Cypress sẽ chờ cho đến khi URL thay đổi thành URL đích (/products)
    cy.url().should('include', '/products'); 
    
    // 3. KHẲNG ĐỊNH THÔNG BÁO (TÙY CHỌN):
    // Vì thông báo "Login successful" xuất hiện trên trang Login quá nhanh 
    // và bị thay thế bởi trang Product Manager, chúng ta LOẠI BỎ Assertion đó 
    // để tránh lỗi Timing không cần thiết.
    
    // --- LƯU Ý BỔ SUNG NẾU BẠN MUỐN KIỂM TRA MỘT PHẦN TỬ TRÊN TRANG MỚI ---
    // Ví dụ: Kiểm tra xem tiêu đề Product Manager có hiển thị không
    cy.contains('Product Manager').should('be.visible'); 
});


// 3.1. [VALIDATION] Nen hien thi loi khi Username < 3 ky tu
it('3.1. [VALIDATION] Nen hien thi loi khi Username < 3 ky tu', () => {
    loginPage.login('ab', validPass); 
    
    // SỬA: Bỏ selector usernameError, dùng NotificationMessage và check nội dung lỗi
    loginPage.getNotificationMessage()
        .should('be.visible')
        .and('contain', 'Username must be longer than 3 characters'); // <--- SỬA CHUỖI
});
// Test 3.2: Password vi phạm độ dài tối thiểu (< 6)
  it('3.2. [VALIDATION] Nen hien thi loi khi Password < 6 ky tu', () => {
    loginPage.login(validUser, '12345'); 
    
    // Khẳng định chuỗi lỗi chi tiết từ Backend/Service
    loginPage.getNotificationMessage()
        .should('be.visible')
        .and('contain', 'Password must be at least 6 characters');
  });


// 4.1. [ERROR] Nen hien thi loi khi sai mat khau
it('4.1. [ERROR] Nen hien thi loi khi sai mat khau', () => {
    loginPage.login(validUser, invalidPass); 
    
    // SỬA: Kiểm tra chuỗi lỗi cụ thể từ AccountService
    loginPage.getNotificationMessage()
        .should('be.visible')
        .and('contain', 'Incorrect password'); // <--- SỬA CHUỖI
});

// 4.2. [ERROR] Nen hien thi loi voi credentials khong hop le
it('4.2. [ERROR] Nen hien thi loi voi credentials khong hop le', () => {
    loginPage.login('nonexistentuser', invalidPass); 
    
    // SỬA: Kiểm tra chuỗi lỗi không hợp lệ chung
    loginPage.getNotificationMessage()
        .should('be.visible')
        .and('contain', 'Invalid username or password'); // <--- SỬA CHUỖI
});

  // Kiểm tra lỗi client-side (nếu có) hoặc server-side validation cho Username rỗng.
it('3.3. [VALIDATION] Nen hien thi loi khi bo trong Username', () => {
    // 1. Chuẩn bị (Điền Password, bỏ trống Username)
    loginPage.elements.passwordInput().clear().type(validPass);
    loginPage.elements.usernameInput().clear(); // Đảm bảo Username trống

    // 2. Kích hoạt Validation Client-side
    loginPage.elements.loginButton().click(); 

    // Assertion: Kiểm tra lỗi Client-side hiển thị ngay lập tức (sử dụng data-testid="username-error")
    loginPage.getUsernameError()
        .should('be.visible')
        .and('contain', 'Vui lòng nhập username'); // <-- Khẳng định chuỗi lỗi Client-side

    // Đảm bảo không có chuyển hướng/gọi API
    cy.url().should('not.include', '/products');
  });

  // Kiểm tra lỗi client-side (nếu có) hoặc server-side validation cho Password rỗng.
it('3.4. [VALIDATION] Nen hien thi loi khi chi bo trong Password', () => {
    // 1. Chuẩn bị (Bỏ trống Password, điền Username)
    loginPage.elements.usernameInput().clear().type(validUser);
    loginPage.elements.passwordInput().clear();
    
    // 2. Kích hoạt Validation Client-side
    loginPage.elements.loginButton().click(); 

    // ✅ SỬA: Khẳng định lỗi Client-side ngay tại vị trí của nó (dưới input Password)
    loginPage.getPasswordError() // <-- SỬ DỤNG GETTER MỚI
        .should('be.visible')
        .and('contain', 'Vui lòng nhập password'); // <-- Khẳng định nội dung lỗi
    
    // Đảm bảo không có chuyển hướng
    cy.url().should('not.include', '/products');
});
});