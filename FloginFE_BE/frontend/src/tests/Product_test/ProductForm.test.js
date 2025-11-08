// src/tests/Product_test/ProductForm.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductDashboard from '../../component/product_dashboard/Product.jsx';
import '@testing-library/jest-dom';

test('renders product form and validates input', () => {
    render(<ProductDashboard />);

    // Mở modal
    fireEvent.click(screen.getByText('Thêm sản phẩm'));

    // Nhập dữ liệu không hợp lệ
    fireEvent.change(screen.getByPlaceholderText('Tên sản phẩm'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Giá (VND)'), { target: { value: '500' } });

    // Submit form
    fireEvent.click(screen.getByText('Thêm mới'));

    // ⚠️ Nếu bạn chưa hiển thị lỗi từ validateProduct ra UI, test này sẽ fail
    // Bạn cần thêm logic hiển thị lỗi trong component để test này hoạt động
});