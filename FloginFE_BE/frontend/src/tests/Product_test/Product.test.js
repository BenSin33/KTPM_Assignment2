// src/tests/Product_test/Product.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductDashboard from '../../component/product_dashboard/Product.jsx';
import '@testing-library/jest-dom';

describe('ProductDashboard', () => {
    test('hiển thị tiêu đề và mô tả', () => {
        render(<ProductDashboard />);
        expect(screen.getByText('Quản lý sản phẩm')).toBeInTheDocument();
        expect(screen.getByText(/danh sách sản phẩm/i)).toBeInTheDocument();
    });

    test('hiển thị đúng số lượng sản phẩm ban đầu', () => {
        render(<ProductDashboard />);
        expect(screen.getByText(/Số lượng sản phẩm: 2/)).toBeInTheDocument();
    });

    test('mở modal khi nhấn nút "Thêm sản phẩm"', () => {
        render(<ProductDashboard />);
        fireEvent.click(screen.getByText('Thêm sản phẩm'));
        expect(screen.getByText('Thêm sản phẩm mới')).toBeInTheDocument();
    });

    test('thêm sản phẩm mới khi submit form', () => {
        render(<ProductDashboard />);
        fireEvent.click(screen.getByText('Thêm sản phẩm'));

        fireEvent.change(screen.getByPlaceholderText('Tên sản phẩm'), {
            target: { value: 'MacBook Air M3' },
        });
        fireEvent.change(screen.getByPlaceholderText('Danh mục'), {
            target: { value: 'Laptop' },
        });
        fireEvent.change(screen.getByPlaceholderText('Giá (VND)'), {
            target: { value: '25000000' },
        });
        fireEvent.change(screen.getByPlaceholderText('Số lượng'), {
            target: { value: '2' },
        });
        fireEvent.change(screen.getByPlaceholderText('Mô tả sản phẩm'), {
            target: { value: 'Laptop siêu nhẹ và mạnh mẽ' },
        });

        fireEvent.click(screen.getByText('Thêm mới'));

        // Kiểm tra sản phẩm mới đã được thêm
        expect(screen.getByText('MacBook Air M3')).toBeInTheDocument();
        expect(screen.getByText('25.000.000 ₫')).toBeInTheDocument();

        // Tránh lỗi trùng nội dung "Laptop"
        const laptopCells = screen.getAllByText('Laptop');
        expect(laptopCells.length).toBeGreaterThan(1);
    });
});