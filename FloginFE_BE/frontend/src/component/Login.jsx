import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 
    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Username:", username);
        console.log("Password:", password);
        const res = await fetch(`http://localhost:8081/api/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
            method: "POST",
        });
        const data = await res.json();
        if(res.ok){
             console.log(data);
             alert(data.message);
            navigate("/product");
        } else {
            alert(data.message);
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
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập password"
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
