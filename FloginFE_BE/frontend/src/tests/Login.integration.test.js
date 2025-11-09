import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import Login from './Login';
import * as authService from '../services/authService';
import { beforeEach, test, expect, describe, jest } from '@jest/globals';

// Mock service (Đây là mấu chốt của "Integration Test với API service")
jest.mock('../services/authService');

describe('Login Component Integration Tests', () => {

  // Xóa tất cả các mock sau mỗi test để tránh ảnh hưởng lẫn nhau
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case 1: Yêu cầu (a) và (c)
  test('Hien thi loi khi submit form rong (Client-side Validation)', async () => {
    
    // Phải render component <Login>
    render(<Login />); 

    // (a) User Interaction: Tìm và nhấn nút
    const submitButton = screen.getByTestId('login-button');
    fireEvent.click(submitButton);

    // (c) Error Handling: Đợi và kiểm tra thông báo lỗi
    await waitFor(() => {
      // Giả sử component có validation và hiển thị lỗi qua testId này
      expect(screen.getByTestId('username-error'))
        .toBeInTheDocument();
    });

    // Đảm bảo API KHÔNG bị gọi nếu form không hợp lệ
    expect(authService.loginUser).not.toHaveBeenCalled();
  });

  // Test case 2: Yêu cầu (a), (b), và (c)
  test('Goi API khi submit form hop le (API Integration)', async () => {
    
    // Giả lập API trả về thành công cho test case này
    authService.loginUser.mockResolvedValue({ success: true });

    // Phải render component <Login>
    render(<Login />); 

    // (a) User Interaction: Tìm và điền thông tin
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, {
      target: { value: 'testuser' }
    });
    fireEvent.change(passwordInput, {
      target: { value: 'Test123' }
    });

    // (b) Form Submission: Nhấn nút
    fireEvent.click(submitButton);

    // Đợi...
    await waitFor(() => {
      // (b) API Calls: Kiểm tra xem service có được gọi với đúng data không
      expect(authService.loginUser).toHaveBeenCalledWith('testuser', 'Test123');

      // (c) Success Messages: Kiểm tra thông báo thành công
      expect(screen.getByTestId('login-message'))
        .toHaveTextContent('thanh cong');
    });
  });
});