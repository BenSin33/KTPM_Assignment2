import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProductDashboard from '../../../component/product_dashboard/Product.jsx';
import { ProductsApi } from '../../../services/ProductAPI';

// 1. Mock API
jest.mock('../../../services/ProductAPI');

describe('ProductDashboard Validation Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('hiển thị lỗi logic khi nhập dữ liệu không thỏa mãn điều kiện kinh doanh', async () => {
        const user = userEvent.setup();

        // Mock data ban đầu để component render không lỗi
        ProductsApi.getAll.mockResolvedValue([]);

        render(<ProductDashboard />);

        // Chờ load data xong
        await waitFor(() => expect(ProductsApi.getAll).toHaveBeenCalled());

        // Mở modal
        await user.click(screen.getByText(/Thêm sản phẩm/i));

        // --- CHIẾN THUẬT MỚI: NHẬP DỮ LIỆU "VỪA ĐỦ" ĐỂ QUA HTML, NHƯNG "SAI" ĐỂ BẮT LỖI REACT ---

        // 1. Tên sản phẩm: Nhập "A"
        // -> Thỏa mãn `required` (không rỗng), nhưng sai logic (ngắn hơn 3 ký tự)
        const nameInput = screen.getByPlaceholderText(/Tên sản phẩm/i);
        await user.type(nameInput, 'A');

        // 2. Danh mục: Nhập bừa "Test"
        // -> Vì ô này có required, phải nhập mới submit được form.
        // (Nếu bạn muốn test lỗi danh mục, hãy nhập cái gì đó sai logic danh mục nếu có)
        const categoryInput = screen.getByPlaceholderText(/Danh mục/i);
        await user.type(categoryInput, 'Test Category');

        // 3. Giá: Nhập "500"
        // -> Thỏa mãn required, nhưng sai logic (< 1000)
        const priceInput = screen.getByPlaceholderText(/Giá \(VND\)/i);
        await user.clear(priceInput); // Xóa giá trị mặc định 500 (nếu có) hoặc type đè
        await user.type(priceInput, '500');

        // 4. Số lượng: Nhập "-5"
        // -> Thỏa mãn required, nhưng sai logic (< 0)
        const quantityInput = screen.getByPlaceholderText(/Số lượng/i);
        await user.clear(quantityInput);
        await user.type(quantityInput, '-5');

        // 5. Submit form
        // Lúc này các ô đều đã có dữ liệu, `required` sẽ cho phép đi qua
        // Hàm handleSubmit của React sẽ chạy và phát hiện lỗi logic
        const submitButton = screen.getByRole('button', { name: /Thêm mới/i });
        await user.click(submitButton);

        // --- KIỂM TRA LỖI ---

        // Kiểm tra lỗi tên quá ngắn
        expect(await screen.findByText(/Tên sản phẩm phải có ít nhất 3 ký tự/i)).toBeInTheDocument();

        // Kiểm tra lỗi giá thấp
        expect(screen.getByText(/Giá phải từ 1,000 đến dưới 999,999,999/i)).toBeInTheDocument();

        // Kiểm tra lỗi số lượng âm
        expect(screen.getByText(/Số lượng phải lớn hơn 0 và nhỏ hơn 99,999/i)).toBeInTheDocument();

        // Kiểm tra class error (CSS)
        expect(nameInput).toHaveClass('error');
    });
});