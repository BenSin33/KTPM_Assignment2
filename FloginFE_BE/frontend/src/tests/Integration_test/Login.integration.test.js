import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'; 
import Login from '../../component/Login';
import * as authService from '../../services/authService';
import { beforeEach, test, expect, describe, jest } from '@jest/globals';

jest.mock('../../services/authService');

describe('Login Component Integration Tests', () => {

  // Xóa tất cả các mock sau mỗi test để tránh ảnh hưởng lẫn nhau
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case 1: Yêu cầu (a) và (c)
  test('Hien thi loi khi submit form rong (Client-side Validation)', async () => {
    
    render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
    ); 

    // (a) User Interaction: Tìm và nhấn nút
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(submitButton);

    // (c) Error Handling: Đợi và kiểm tra thông báo lỗi
    await waitFor(() => {
      expect(screen.getByTestId('username-error'))
        .toBeInTheDocument();
    });

    expect(authService.loginUser).not.toHaveBeenCalled();
  });

  // Test case 2: Yêu cầu (a), (b), và (c)
  test('Goi API khi submit form hop le (API Integration)', async () => {
    
    authService.loginUser.mockResolvedValue({ success: true });

    render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
   ); 

    // (a) User Interaction: Tìm và điền thông tin
    const usernameInput = screen.getByPlaceholderText('Nhập username');
    const passwordInput = screen.getByPlaceholderText('Nhập password');
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

    fireEvent.change(usernameInput, {
      target: { value: 'testuser' }
    });
    fireEvent.change(passwordInput, {
      target: { value: 'Test123' }
    });

    // (b) Form Submission: Nhấn nút
    fireEvent.click(submitButton);

    await waitFor(() => {
      // (b) API Calls: Kiểm tra xem service có được gọi với đúng data không
      expect(authService.loginUser).toHaveBeenCalledWith('testuser', 'Test123');

      // (c) Success Messages: Kiểm tra thông báo thành công
      expect(screen.getByTestId('login-message'))
        .toHaveTextContent('Đăng nhập thành công!');
    });
  });
});