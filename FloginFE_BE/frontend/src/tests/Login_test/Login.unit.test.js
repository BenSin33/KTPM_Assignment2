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

  // Test case 1: Hiển thị các trường username, password và nút đăng nhập
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
    authService.loginUser.mockResolvedValue({ success: true, message: 'Login successful', token: 'tok-1' });
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
    authService.loginUser.mockResolvedValue({ success: false, message: 'Invalid username or password' });
    render(<MemoryRouter><Login /></MemoryRouter>);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'bad' } });
    fireEvent.click(screen.getByTestId('login-button'));
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('wrong', 'bad');
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
  });

  // Test case 6: Lỗi mạng khi gọi API
  test('Test case 6: Lỗi mạng khi gọi API', async () => {
    authService.loginUser.mockRejectedValue(new Error('Network Error'));
    render(<MemoryRouter><Login /></MemoryRouter>);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123456' } });
    fireEvent.click(screen.getByTestId('login-button'));
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalled();
      expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
    });
  });

  // Test case 7: Ngăn chặn gửi nhiều lần (rapid clicks)
  test('Test case 7: Ngăn chặn gửi nhiều lần (rapid clicks)', async () => {
    let resolve;
    const p = new Promise(res => { resolve = res; });
    authService.loginUser.mockImplementation(() => p);
    render(<MemoryRouter><Login /></MemoryRouter>);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123456' } });
    const btn = screen.getByTestId('login-button');
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(authService.loginUser).toHaveBeenCalledTimes(1);

    resolve({ success: true, message: 'ok', token: 'tkn' });
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('tkn');
    });
  });

  // Test case 8: Submit bằng phím Enter
  test('Test case 8: Submit bằng phím Enter', async () => {
    authService.loginUser.mockResolvedValue({ success: true, message: 'ok', token: 'enter-tkn' });
    render(<MemoryRouter><Login /></MemoryRouter>);
    const username = screen.getByTestId('username-input');
    const password = screen.getByTestId('password-input');
    fireEvent.change(username, { target: { value: 'admin' } });
    fireEvent.change(password, { target: { value: '123456' } });
    fireEvent.keyDown(password, { key: 'Enter', code: 'Enter', charCode: 13 });
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('admin', '123456');
      expect(localStorage.getItem('token')).toBe('enter-tkn');
    });
  });
});