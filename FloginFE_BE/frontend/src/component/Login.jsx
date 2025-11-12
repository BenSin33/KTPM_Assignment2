import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from '../services/authService';

import "./Login.css";
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginMessage, setLoginMessage] = useState("");

    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username) {
            setUsernameError("Vui lòng nhập username");
            return; // Dừng lại, không gọi API
        } else {
            setUsernameError(""); // Xóa lỗi cũ nếu có
        }

        if (!password) {
            setPasswordError("Vui lòng nhập password");
            return; // Dừng lại, không gọi API
        } else {
            setPasswordError(""); // Xóa lỗi cũ nếu có
        }

        console.log("Username:", username);
        console.log("Password:", password);

        try {
            // 'data' chính là kết quả trả về, không phải 'res'
            const data = await authService.loginUser(username, password);

            // Giả sử mock { success: true } và API thật cũng trả về object
            // Kiểm tra 'data' (hoặc data.success nếu bạn mock như vậy)
            if(data){ 
                 console.log(data);
                 // Thay vì alert, hãy set state để test có thể thấy
                 setLoginMessage("Đăng nhập thành công!"); // Hoặc data.message
                 // alert(data.message); // Bỏ alert
                 navigate("/product");
            } else {
                // alert(data.message); // Bỏ alert
                setLoginMessage("Thông tin đăng nhập không chính xác.");
            }
        } catch (error) {
            console.error(error);
            setLoginMessage("Đã xảy ra lỗi khi đăng nhập.");
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
                        />
                        {usernameError && <div data-testid="username-error" style={{ color: 'red' }}>{usernameError}</div>}
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập password"
                        />
                        {passwordError && <div data-testid="password-error" style={{ color: 'red' }}>{passwordError}</div>}
                    </div>

                    <button type="submit" className="login-btn">
                        Đăng nhập
                    </button>

                    {loginMessage && (
                        <div data-testid="login-message" style={{ color: 'green', marginTop: '10px' }}>
                            {loginMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
