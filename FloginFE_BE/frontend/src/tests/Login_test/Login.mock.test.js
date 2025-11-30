/* global jest */
import React from 'react';
// 1. QUAN TRỌNG: Phải import 'act' để xử lý setTimeout
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../component/login_dashboard/Login.jsx';
import * as authService from '../../services/authService';
import '@testing-library/jest-dom';

// Setup Mock navigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

jest.mock('../../services/authService.js');

describe('Login Mock Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset timer về mặc định trước mỗi test để tránh xung đột
        jest.useRealTimers();
        
        global.localStorage = {
            store: {},
            getItem(key) { return this.store[key] || null; },
            setItem(key, value) { this.store[key] = value; },
            removeItem(key) { delete this.store[key]; },
            clear() { this.store = {}; }
        };
    });

    // --- Test Case 1: Đăng nhập thành công và Navigate ---
    test('Test case 1: Đăng nhập thành công và chuyển hướng', async () => {
        // Sử dụng Fake Timers chỉ cho test này
        jest.useFakeTimers();

        authService.loginUser.mockResolvedValue({
            success: true,
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

        // Chờ UI cập nhật message thành công
        await waitFor(() => {
            expect(screen.getByText(/Đăng nhập thành công!/i)).toBeInTheDocument();
            expect(localStorage.getItem('token')).toBe('mock-token-123');
        });

        // "Tua" thời gian đi 1000ms để kích hoạt setTimeout
        // Phải bọc trong act()
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        // Kiểm tra navigate đã được gọi chưa
        expect(mockedNavigate).toHaveBeenCalledWith('/products');
    });

    // --- Test Case 2 đến 8 (Giữ nguyên logic của bạn) ---
    test("Test case 2: Đăng nhập thất bại - username trống", async () => {
        render(<MemoryRouter><Login /></MemoryRouter>);
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: '' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
        fireEvent.click(screen.getByTestId('login-button'));
        await waitFor(() => {
            expect(authService.loginUser).not.toHaveBeenCalled();
            expect(screen.getByText(/Vui lòng nhập username/i)).toBeInTheDocument();
        })
    })

    test("Test case 3: Đăng nhập thất bại - password ít hơn 6 kí tự", async () => {
        authService.loginUser.mockResolvedValue({ success: false, message: 'Password must be at least 6 characters' });
        render(<MemoryRouter><Login /></MemoryRouter>);
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: '1234' } });
        fireEvent.click(screen.getByTestId('login-button'));
        await waitFor(() => {
            expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
        })
    })

    test("Test case 4: Đăng nhập thất bại - username chứa kí tự đặc biệt", async () => {
        authService.loginUser.mockResolvedValue({ success: false, message: 'Username chars error' });
        render(<MemoryRouter><Login /></MemoryRouter>);
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'abc@123' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123456' } });
        fireEvent.click(screen.getByTestId('login-button'));
        await waitFor(() => {
            expect(screen.getByText('Username chars error')).toBeInTheDocument();
        });
    });

    test("Test case 5: Đăng nhập thất bại - sai username hoặc password", async () => {
        authService.loginUser.mockResolvedValue({ success: false, message: 'Invalid username or password' });
        render(<MemoryRouter><Login /></MemoryRouter>);
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByTestId('login-button'));
        await waitFor(() => {
            expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
        });
    });

    test("Test case 6: Đăng nhập thất bại - username ngắn", async () => {
        authService.loginUser.mockResolvedValue({ success: false, message: 'Username too short' });
        render(<MemoryRouter><Login /></MemoryRouter>);
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'ab' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'validPass123' } });
        fireEvent.click(screen.getByTestId('login-button'));
        await waitFor(() => {
            expect(screen.getByText('Username too short')).toBeInTheDocument();
        });
    });

    test("Test case 7: Đăng nhập thất bại - password trống", async () => {
        render(<MemoryRouter><Login /></MemoryRouter>);
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'validUser' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: '' } });
        fireEvent.click(screen.getByTestId('login-button'));
        await waitFor(() => {
            expect(authService.loginUser).not.toHaveBeenCalled();
            expect(screen.getByText(/Vui lòng nhập password/i)).toBeInTheDocument();
        });
    });

    test("Test case 8: Đăng nhập thất bại - sai password", async () => {
        authService.loginUser.mockResolvedValue({ success: false, message: 'Incorrect password' });
        render(<MemoryRouter><Login /></MemoryRouter>);
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrongPassword' } });
        fireEvent.click(screen.getByTestId('login-button'));
        await waitFor(() => {
            expect(screen.getByText('Incorrect password')).toBeInTheDocument();
        });
    });

    // --- TEST CASE 9: MỚI BỔ SUNG ĐỂ TEST CATCH BLOCK ---
    test("Test case 9: Lỗi hệ thống (Catch block)", async () => {
        // Mock Rejected Value: Giả lập API bị lỗi (VD: mất mạng) để nhảy vào catch
        authService.loginUser.mockRejectedValue(new Error("Network Error"));

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123456' } });
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            // Kiểm tra xem dòng chữ trong setMessage ở khối catch có hiện ra không
            expect(screen.getByText("Network Error")).toBeInTheDocument();
        });
    });
    // --- Test Case 10: API trả về null (Fix lỗi dòng 61 màu vàng) ---
   test("Test case 9: Lỗi hệ thống có message cụ thể (Catch block)", async () => {
        authService.loginUser.mockRejectedValue(new Error("Network Error"));

        render(<MemoryRouter><Login /></MemoryRouter>);
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123456' } });
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            expect(screen.getByText("Network Error")).toBeInTheDocument();
        });
    });

    // 10. Test Else Fallback (Đã sửa để không bị crash)
    // Dòng 61 nhánh phải: ... || "Đăng nhập thất bại"
    test("Test case 10: Đăng nhập thất bại - API trả về success false và không có message", async () => {
        // QUAN TRỌNG: Trả về object có success false thay vì null
        // Để tránh lỗi "Cannot read properties of null"
        authService.loginUser.mockResolvedValue({ success: false }); 

        render(<MemoryRouter><Login /></MemoryRouter>);
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123456' } });
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            // Code sẽ chạy vào else và lấy string mặc định
            expect(screen.getByText("Đăng nhập thất bại")).toBeInTheDocument();
        });
    });

    // 11. Test Catch Fallback 
    // Dòng 60 nhánh phải: ... || "Lỗi hệ thống hoặc sai thông tin"
    test("Test case 11: Lỗi hệ thống không có message (Catch block fallback)", async () => {
        // Mock lỗi rỗng (không có message)
        authService.loginUser.mockRejectedValue({}); 

        render(<MemoryRouter><Login /></MemoryRouter>);
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123456' } });
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            expect(screen.getByText("Lỗi hệ thống hoặc sai thông tin")).toBeInTheDocument();
        });
    });
});
