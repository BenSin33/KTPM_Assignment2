/* global jest */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// Đảm bảo đường dẫn này đúng với máy bạn
import Login from '../../component/login_dashboard/Login.jsx';
import * as authService from '../../services/authService';
import '@testing-library/jest-dom';

jest.mock('../../services/authService.js');

describe('Login Mock Tests', () => {

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

    // --- Test Case 1: Đăng nhập thành công ---
    test('Test case 1: Đăng nhập thành công', async () => {
        // Component check "data.success", nên mock phải trả về success: true
        authService.loginUser.mockResolvedValue({
            success: true, // Quan trọng: Khớp với logic if (data && data.success)
            message: 'Login successful',
            token: 'mock-token-123',
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123456' } });
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            expect(authService.loginUser).toHaveBeenCalledWith('admin', '123456');
            // Component hardcode "Đăng nhập thành công!" khi success = true
            expect(screen.getByText(/Đăng nhập thành công!/i)).toBeInTheDocument();
            expect(localStorage.getItem('token')).toBe('mock-token-123');
        });
    });


    // --- Test Case 2: Username trống (Validate Client) ---
    test("Test case 2: Đăng nhập thất bại - username trống", async () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: '' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            // Logic: isValid = false -> return -> API KHÔNG gọi
            expect(authService.loginUser).not.toHaveBeenCalled();
            expect(screen.getByText(/Vui lòng nhập username/i)).toBeInTheDocument();
        })
    })

    // --- Test Case 3: Password ngắn (API Error) ---
    test("Test case 3: Đăng nhập thất bại - password ít hơn 6 kí tự", async () => {
        // Component dùng "data.message" để hiện lỗi, success phải là false
        authService.loginUser.mockResolvedValue({
            success: false,
            message: 'Password must be at least 6 characters'
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: '1234' } });
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            expect(authService.loginUser).toHaveBeenCalledWith('admin', '1234');
            // Component render data.message từ mock
            expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
        })
    })

    // --- Test Case 4: Ký tự đặc biệt (API Error) ---
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

        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'abc@123' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123456' } });
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            expect(authService.loginUser).toHaveBeenCalledWith('abc@123', '123456');
            expect(screen.getByText('Username can only contain letters, numbers, ., -, _')).toBeInTheDocument();
        });
    });

    // --- Test Case 5: Sai tài khoản (API Error) ---
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
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            expect(authService.loginUser).toHaveBeenCalledWith('wronguser', 'wrongpass');
            expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
        });
    });

    // --- Test Case 6: Username ngắn (API Error) ---
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
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'ab' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'validPass123' } });
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            expect(authService.loginUser).toHaveBeenCalledWith('ab', 'validPass123');
            expect(screen.getByText('Username must be longer than 3 characters')).toBeInTheDocument();
        });
    });

    // --- Test Case 7: Password trống (Validate Client) ---
    test("Test case 7: Đăng nhập thất bại - password trống", async () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'validUser' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: '' } });
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            // Validate sai -> API KHÔNG gọi
            expect(authService.loginUser).not.toHaveBeenCalled();
            expect(screen.getByText(/Vui lòng nhập password/i)).toBeInTheDocument();
        });
    });

    // --- Test Case 8: Sai password (API Error) ---
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
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrongPassword' } });
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            expect(authService.loginUser).toHaveBeenCalledWith('admin', 'wrongPassword');
            expect(screen.getByText('Incorrect password')).toBeInTheDocument();
        });
    });
});