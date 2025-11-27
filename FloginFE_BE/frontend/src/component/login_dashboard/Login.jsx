import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Username:", username);
        console.log("Password:", password);
        // const res = await fetch(`http://localhost:8081/api/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        //     method: "POST",
        // });
        // const data = await res.json();
        // if(res.ok){
        //      console.log(data);
        //      alert(data.message);
        //     navigate("/product");
        // } else {
        //     alert(data.message);
        // }
        try {
            const data = await loginUser(username, password);
            if (data.success) {
                setMessage(data.message );
                localStorage.setItem("token", data.token);
                navigate("/products");
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage(error.message);
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
                    </div>

                    <button type="submit" className="login-btn" data-testid="login-button">
                        Đăng nhập
                    </button>
                </form>
               <div style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}>{message}</div>

            </div>
        </div>
    );
};

export default Login;
