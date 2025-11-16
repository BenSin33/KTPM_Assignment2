import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import ProductDashboard from '../../../component/product_dashboard/Product.jsx';
import { ProductsApi } from '../../../services/ProductAPI.js';

jest.mock('../../../services/ProductAPI.js');

describe('ProductDashboard Form Integration Test', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        ProductsApi.getAll.mockResolvedValue([
            { id: 1, name: 'Sản phẩm cũ', price: 1000, }
        ]);
        
        // Dạy cho API addProduct
        ProductsApi.addProduct.mockResolvedValue({ success: true });
    });

    test('Tao san pham moi thanh cong', async () => {
        render(<ProductDashboard />);
        
        await waitFor(() => {
            expect(screen.getByText('Sản phẩm cũ')).toBeInTheDocument();
        });
        
        const addButton = screen.getByText('Thêm sản phẩm');
        fireEvent.click(addButton);

        fireEvent.change(screen.getByPlaceholderText('Tên sản phẩm'), { 
            target: { value: 'Laptop Dell' } 
        });
        fireEvent.change(screen.getByPlaceholderText('Danh mục'), { 
            target: { value: 'Laptop' } 
        });
        fireEvent.change(screen.getByPlaceholderText('Giá (VND)'), { 
            target: { value: '15000000' } 
        });
        fireEvent.change(screen.getByPlaceholderText('Số lượng'), { 
            target: { value: '10' } 
        });

        fireEvent.change(screen.getByPlaceholderText('Mô tả sản phẩm'), { 
            target: { value: 'Một chiếc laptop mới' } 
        });

        fireEvent.click(screen.getByText('Thêm mới'));

        await waitFor(() => {
            expect(ProductsApi.addProduct).toHaveBeenCalled(); 
        });

        await waitFor(() => {
            expect(screen.queryByText('Thêm mới')).not.toBeInTheDocument();
        });
    });
});