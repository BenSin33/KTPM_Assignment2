import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <header className="layout-header">
                <h1>Product Manager</h1>
            </header>
            <div className="layout-body">
                <main className="layout-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;