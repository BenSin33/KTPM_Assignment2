import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductDashboard from '../../../component/product_dashboard/Product.jsx';
import '@testing-library/jest-dom';

test('hiển thị lỗi khi nhập dữ liệu không hợp lệ', async () => {
    render(<ProductDashboard />);
    fireEvent.click(screen.getByText('Thêm sản phẩm'));

    fireEvent.change(screen.getByPlaceholderText('Tên sản phẩm'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Giá (VND)'), { target: { value: '500' } });
    fireEvent.change(screen.getByPlaceholderText('Số lượng'), { target: { value: '-1' } });
    fireEvent.change(screen.getByPlaceholderText('Mô tả sản phẩm'), { target: { value: '' } });

    fireEvent.click(screen.getByText('Thêm mới'));

    expect(await screen.findByText((t) => t.includes("Tên sản phẩm phải có ít nhất 3 ký tự"))).toBeInTheDocument();
    expect(screen.getByText((t) => t.includes("Giá phải từ 1,000 đến dưới 999,999,999"))).toBeInTheDocument();
    expect(screen.getByText((t) => t.includes("Số lượng phải lớn hơn 0 và nhỏ hơn 99,999"))).toBeInTheDocument();
    expect(screen.getByText((t) => t.includes("Mô tả phải từ 3 đến 500 ký tự"))).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Tên sản phẩm')).toHaveClass('error');
    expect(screen.getByPlaceholderText('Giá (VND)')).toHaveClass('error');
});