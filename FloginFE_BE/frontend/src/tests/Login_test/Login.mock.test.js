/* global jest */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../component/Login';
import * as authService from '../../services/authService';
import '@testing-library/jest-dom'; // <- bắt buộc để dùng toBeInTheDocument
jest.mock('../../services/authService');

describe('Login Mock Tests', () => {

  // Chạy trước mỗi 'test' để reset lại các mock, đảm bảo
  // test case này không ảnh hưởng đến test case kia.
  beforeEach(() => {
    jest.clearAllMocks();
    global.localStorage = {
      store: {},
      getItem(key) {
        return this.store[key] || null;
      },
      setItem(key, value) {
        this.store[key] = value;
      },
      removeItem(key) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      }
    };
  });

  // Test Case 1: Đăng nhập thành công
  test('Test case 1: Đăng nhập thành công', async () => {
    authService.loginUser.mockResolvedValue({
      success: true,
      message: 'Login successful',
      token: 'mock-token-123',
      username: 'testuser'
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'admin' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: '123456' }
    });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith(
        'admin', '123456'
      );
      expect(screen.getByText(/Login successful/i)).toBeInTheDocument();
      expect(localStorage.getItem('token')).toBe('mock-token-123');
    });
  });


  // Test Case 2: Đăng nhập thất bại
  test("Test case 2: Đăng nhập thất bại - username trống", async () => {
    authService.loginUser.mockResolvedValue({
      success: false,
      message: 'Username is required'
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: '' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'Test123' }
    });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('', 'Test123');
      expect(screen.getByText('Username is required')).toBeInTheDocument();
    })
  })

  test("Test case 3: Đăng nhập thất bại - password ít hơn 6 kí tự", async () => {
    authService.loginUser.mockResolvedValue({
      success: false,
      message: 'Password must be at least 6 characters'
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'admin' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: '1234' }
    });
    fireEvent.click(screen.getByTestId('login-button'));
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('admin', '1234');
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    })
  })
  test("Test case 4: Đăng nhập thất bại - username chứa kí tự đặc biệt", async () => {
    authService.loginUser.mockResolvedValue({
      success: false,
      message: 'Username can only contain letters, numbers, ., -, _'
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'abc@123' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: '123456' }
    });
    fireEvent.click(screen.getByTestId('login-button'));
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('abc@123', '123456');
      expect(screen.getByText('Username can only contain letters, numbers, ., -, _')).toBeInTheDocument();
    });
  });
  test("Test case 5: Đăng nhập thất bại - sai username hoặc password", async () => {
    authService.loginUser.mockResolvedValue({
      success: false,
      message: 'Invalid username or password'
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'wronguser' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'wrongpass' }
    });
    fireEvent.click(screen.getByTestId('login-button'));
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('wronguser', 'wrongpass');
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
  });
  test("Test case 6: Đăng nhập thất bại - username ít hơn 3 kí tự", async () => {
    authService.loginUser.mockResolvedValue({
      success: false,
      message: 'Username must be longer than 3 characters'
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'ab' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'validPass123' }
    });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {

      expect(authService.loginUser).toHaveBeenCalledWith('ab', 'validPass123');
      expect(screen.getByText('Username must be longer than 3 characters')).toBeInTheDocument();
    });
  });
  test("Test case 7: Đăng nhập thất bại - password trống", async () => {
    authService.loginUser.mockResolvedValue({
      success: false,
      message: 'Password is required'
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'validUser' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: '' }
    });
    fireEvent.click(screen.getByTestId('login-button'));
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('validUser', '');
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  }); 
    test("Test case 8: Đăng nhập thất bại - sai password", async () => {
    authService.loginUser.mockResolvedValue({
      success: false,
      message: 'Incorrect password'
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'admin' }

    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'wrongPassword' }
    });
    fireEvent.click(screen.getByTestId('login-button'));
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('admin', 'wrongPassword');
      expect(screen.getByText('Incorrect password')).toBeInTheDocument();
    });
  });  // Kết thúc test case
}); // Kết thúc describe
