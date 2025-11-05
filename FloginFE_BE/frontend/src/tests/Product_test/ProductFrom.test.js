import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from '../component/ProductForm';

test('renders product form and validates input', () => {
    render(<ProductForm />);

    fireEvent.change(screen.getByPlaceholderText('Tên sản phẩm'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Giá (VND)'), { target: { value: '500' } });
    fireEvent.click(screen.getByText('Thêm mới'));

    expect(screen.getByText(/Tên sản phẩm phải có ít nhất 3 ký tự/i)).toBeInTheDocument();
    expect(screen.getByText(/Giá phải từ 1.000 đến 100.000.000 VND/i)).toBeInTheDocument();
});