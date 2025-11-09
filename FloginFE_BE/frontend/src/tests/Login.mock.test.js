/* global jest */
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import Login from '../components/Login';
import * as authService from '../services/authService';
import { beforeEach, test, expect, describe } from '@jest/globals';

jest.mock('../services/authService');

describe('Login Mock Tests', () => {

  // Chạy trước mỗi 'test' để reset lại các mock, đảm bảo
  // test case này không ảnh hưởng đến test case kia.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case 1: Đăng nhập thành công
  test('Mock: Login thanh cong', async () => {
    // Giả lập service trả về dữ liệu thành công
    authService.loginUser.mockResolvedValue({
      success: true,
      token: 'mock-token-123',
      user: { username: 'testuser' }
    });

    render(<Login />);

    // Giả lập người dùng nhập liệu
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value:'testuser' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'Test123' }
    });

    // Giả lập người dùng nhấn nút
    fireEvent.click(screen.getByTestId('login-button'));

    // Chờ xử lý bất đồng bộ và kiểm tra kết quả
    await waitFor(() => {
      // Kiểm tra service được gọi với đúng tham số
      expect(authService.loginUser).toHaveBeenCalledWith(
        'testuser', 'Test123'
      );
      // Kiểm tra thông báo thành công xuất hiện
      expect(screen.getByText(/thanh cong/i)).toBeInTheDocument();
    });
  });

  // Test Case 2: Đăng nhập thất bại
  test('Mock: Login that bai', async () => {
    // a) Giả lập service trả về lỗi
    authService.loginUser.mockRejectedValue(
      new Error('Invalid credentials')
    );

    render(<Login />);

    // Giả lập người dùng nhập liệu sai
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'wronguser' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'wrongpass' }
    });

    // Giả lập người dùng nhấn nút
    fireEvent.click(screen.getByTestId('login-button'));

    // Chờ xử lý bất đồng bộ và kiểm tra kết quả
    await waitFor(() => {
      // c) Kiểm tra service được gọi với đúng tham số
      expect(authService.loginUser).toHaveBeenCalledWith(
        'wronguser', 'wrongpass'
      );
      
      // b) Kiểm tra thông báo lỗi (từ mock) đã hiển thị
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      
      // Kiểm tra thêm: Đảm bảo thông báo thành công KHÔNG xuất hiện
      expect(screen.queryByText(/thanh cong/i)).not.toBeInTheDocument();
    });
  });
  
}); // Kết thúc describe