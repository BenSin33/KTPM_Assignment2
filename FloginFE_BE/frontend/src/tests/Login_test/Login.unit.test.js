import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../component/login_dashboard/Login.jsx';
import * as authService from '../../services/authService';
import '@testing-library/jest-dom';

// Mock toàn bộ authService để tránh gọi API thật
jest.mock('../../services/authService');

describe('Login component unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.localStorage = {
      store: {},
      getItem(key) { return this.store[key] || null; },
      setItem(key, value) { this.store[key] = value; },
      removeItem(key) { delete this.store[key]; },
      clear() { this.store = {}; }
    };
  });

  // Test case 1: Hiển thị các username, password và nút đăng nhập
  test('Test case 1: Hiển thị username, password và nút đăng nhập', () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  // Test case 2: Đăng nhập thất bại - username trống (Validate Client)
  test('Test case 2: Đăng nhập thất bại - username trống', async () => {
    render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.change(screen.getByTestId('username-input'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'ValidPass1' } });
    fireEvent.click(screen.getByTestId('login-button'));
    await waitFor(() => {
      expect(authService.loginUser).not.toHaveBeenCalled();
      expect(screen.getByText(/Vui lòng nhập username/i)).toBeInTheDocument();
    });
  });

  // Test case 3: Đăng nhập thất bại - password trống (Validate Client)
  test('Test case 3: Đăng nhập thất bại - password trống', async () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'validUser' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('login-button'));
    await waitFor(() => {
      expect(authService.loginUser).not.toHaveBeenCalled();
      expect(screen.getByText(/Vui lòng nhập password/i)).toBeInTheDocument();
    });
  });

  // Test case 4: Đăng nhập thành công - lưu token và hiển thị thông báo
  test('Test case 4: Đăng nhập thành công - lưu token và hiển thị thông báo', async () => {
    authService.loginUser.mockResolvedValue({ success: true, message: 'Đăng nhập thành công!', token: 'tok-1' });
    render(<MemoryRouter><Login /></MemoryRouter>);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123456' } });
    fireEvent.click(screen.getByTestId('login-button'));
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('admin', '123456');
      expect(localStorage.getItem('token')).toBe('tok-1');
      expect(screen.getByText(/Đăng nhập thành công!/i)).toBeInTheDocument();
    });
  });

  // Test case 5: Đăng nhập thất bại - API trả về lỗi
  test('Test case 5: Đăng nhập thất bại - API trả về lỗi', async () => {
    authService.loginUser.mockResolvedValue({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không hợp lệ' });
    render(<MemoryRouter><Login /></MemoryRouter>);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123456' } }); 
    fireEvent.click(screen.getByTestId('login-button'));
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('wrong', '123456');
      expect(screen.getByText(/Tên đăng nhập hoặc mật khẩu không hợp lệ/i)).toBeInTheDocument();
    });
  });

  // Test case 6: Đăng nhập thất bại - Password < 6 ký tự
  test('Test case 6: Đăng nhập thất bại - Password < 6 ký tự', async () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'validUser' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '12345' } }); // < 6 ký tự
    fireEvent.click(screen.getByTestId('login-button'));
    await waitFor(() => {
      expect(authService.loginUser).not.toHaveBeenCalled();
      expect(screen.getByText(/Password phải ít nhất 6 ký tự/i)).toBeInTheDocument();
    });
  });

  // Test case 7: Đăng nhập thất bại - Username chứa ký tự đặc biệt
  test('Test case 7: Đăng nhập thất bại - Username chứa ký tự đặc biệt', async () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin@123' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'validPass123' } });
    fireEvent.click(screen.getByTestId('login-button'));
    await waitFor(() => {
      expect(authService.loginUser).not.toHaveBeenCalled();
      expect(screen.getByText(/Username chỉ có thể số và chữ, ., -, _/i)).toBeInTheDocument();
    });
  });
});
