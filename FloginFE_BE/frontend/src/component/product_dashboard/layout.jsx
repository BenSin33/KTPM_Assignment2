import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <header className="layout-header">
                <h1>Product Manager</h1>
            </header>
            <div className="layout-body">
                <aside className="layout-sidebar">
                    <ul>
                        <li><a href="#">Sản phẩm</a></li>
                        <li><a href="#">Người dùng</a></li>
                        <li><a href="#">Cài đặt</a></li>
                    </ul>
                </aside>
                <main className="layout-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;