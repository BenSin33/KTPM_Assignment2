import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Thêm state để lưu lỗi validation
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // State thông báo chung (thành công/thất bại từ API)
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // --- 1. LOGIC VALIDATION (Client-side) ---
        let isValid = true;

        if (!username) {
            setUsernameError("Vui lòng nhập username");
            isValid = false;
        } else {
            setUsernameError("");
        }

        if (!password) {
            setPasswordError("Vui lòng nhập password");
            isValid = false;
        } else {
            setPasswordError("");
        }

        // Nếu có lỗi, dừng lại, không gọi API
        if (!isValid) return;

        // --- 2. GỌI API ---
        console.log("Username:", username);
        console.log("Password:", password);

        try {
            const data = await loginUser(username, password);

            // Xử lý kết quả trả về
            if (data && data.success) {
                // Set thông báo thành công (Test cần cái này)
                setMessage("Đăng nhập thành công!");

                localStorage.setItem("token", data.token);

                // Chuyển trang sau một khoảng thời gian ngắn (optional)
                setTimeout(() => {
                    navigate("/product"); // Sửa lại đường dẫn cho đúng với router của bạn
                }, 1000);
            } else {
                setMessage(data.message || "Đăng nhập thất bại");
            }
        } catch (error) {
            setMessage("Lỗi hệ thống hoặc sai thông tin");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Đăng nhập</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập username"
                            data-testid="username-input"
                        />
                        {/* Hiển thị lỗi Username cho Test thấy */}
                        {usernameError && (
                            <div data-testid="username-error" style={{ color: "red", fontSize: "12px" }}>
                                {usernameError}
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập password"
                            data-testid="password-input"
                        />
                        {/* Hiển thị lỗi Password (Optional) */}
                        {passwordError && (
                            <div data-testid="password-error" style={{ color: "red", fontSize: "12px" }}>
                                {passwordError}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="login-btn" data-testid="login-button">
                        Đăng nhập
                    </button>
                </form>

                {/* Hiển thị thông báo API cho Test thấy */}
                {message && (
                    <div
                        data-testid="login-message"
                        style={{ color: message.includes("thành công") ? "green" : "red", fontWeight: "bold", fontSize: "16px", marginTop: "10px" }}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;