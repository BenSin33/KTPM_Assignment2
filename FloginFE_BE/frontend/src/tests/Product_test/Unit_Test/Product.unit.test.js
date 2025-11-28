import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductDashboard from "../../../component/product_dashboard/Product.jsx";
import { ProductsApi } from "../../../services/ProductAPI.js";

// Mock API
jest.mock("../../../services/ProductAPI.js");

describe("ProductDashboard Component", () => {
    const mockProduct = {
        id: 1,
        name: "Laptop Dell",
        price: 15000000,
        quantity: 10,
        description: "Máy tính xách tay hiệu suất cao",
        category: "Electronics",
        brand: "Dell",
        img: "https://example.com/image.jpg",
        create_at: "2025-11-13",
    };

    let consoleSpy;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Setup API defaults
        ProductsApi.getAll.mockResolvedValue([mockProduct]);
        ProductsApi.addProduct.mockResolvedValue({});
        ProductsApi.updateProduct.mockResolvedValue({});
        ProductsApi.deleteProduct.mockResolvedValue({});

        // Setup Spy cho console.error để test các case lỗi API
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        // Dọn dẹp spy sau mỗi test
        consoleSpy.mockRestore();
    });

    test("TC_PRODUCT_007 - Hiển thị danh sách sản phẩm", async () => {
        render(<ProductDashboard />);
        expect(await screen.findByText("Laptop Dell")).toBeInTheDocument();
        expect(screen.getByText("15.000.000 ₫")).toBeInTheDocument();
    });

    test("TC_PRODUCT_001 - Tạo sản phẩm mới thành công", async () => {
        render(<ProductDashboard />);
        fireEvent.click(screen.getByText("Thêm sản phẩm"));

        fireEvent.change(screen.getByPlaceholderText("Tên sản phẩm"), { target: { value: "Laptop Dell New" } });
        fireEvent.change(screen.getByPlaceholderText("Danh mục"), { target: { value: "Electronics" } });
        fireEvent.change(screen.getByPlaceholderText("Giá (VND)"), { target: { value: "15000000" } });
        fireEvent.change(screen.getByPlaceholderText("Số lượng"), { target: { value: "10" } });
        fireEvent.change(screen.getByPlaceholderText("Mô tả sản phẩm"), { target: { value: "New Description" } });

        fireEvent.click(screen.getByText("Thêm mới"));

        await waitFor(() => {
            expect(ProductsApi.addProduct).toHaveBeenCalled();
        });
    });

    test("TC_PRODUCT_002 - Cập nhật sản phẩm thành công", async () => {
        render(<ProductDashboard />);
        fireEvent.click(await screen.findByText("Sửa"));

        fireEvent.change(screen.getByPlaceholderText("Số lượng"), { target: { value: "20" } });
        fireEvent.click(screen.getByText("Cập nhật"));

        await waitFor(() => {
            expect(ProductsApi.updateProduct).toHaveBeenCalledWith(1, expect.objectContaining({ quantity: "20" }));
        });
    });

    test("TC_PRODUCT_004 - Xóa sản phẩm thành công", async () => {
        render(<ProductDashboard />);
        fireEvent.click(await screen.findByText("Xóa"));

        await waitFor(() => {
            expect(ProductsApi.deleteProduct).toHaveBeenCalledWith(1);
        });
    });

    // --- CÁC TEST CASE MỚI THÊM VÀO ---

    test("TC_PRODUCT_005 - Xóa sản phẩm thất bại (API Error Handling)", async () => {
        // Giả lập API xóa bị lỗi
        const errorMsg = new Error("Product not found");
        ProductsApi.deleteProduct.mockRejectedValue(errorMsg);

        render(<ProductDashboard />);

        // Chờ nút xóa hiện ra và click
        const deleteButton = await screen.findByText("Xóa");
        fireEvent.click(deleteButton);

        // Kiểm tra console.error được gọi thay vì app bị crash
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("Lỗi khi xóa sản phẩm:", errorMsg);
        });
    });

    test("TC_PRODUCT_006 - Hiển thị lỗi Validation khi nhập dữ liệu không hợp lệ", async () => {
        render(<ProductDashboard />);
        fireEvent.click(screen.getByText("Thêm sản phẩm"));

        // Nhập dữ liệu để qua mặt 'required' HTML nhưng sai logic Business
        fireEvent.change(screen.getByPlaceholderText("Tên sản phẩm"), { target: { value: "A" } }); // < 3 ký tự
        fireEvent.change(screen.getByPlaceholderText("Danh mục"), { target: { value: "Test" } });
        fireEvent.change(screen.getByPlaceholderText("Giá (VND)"), { target: { value: "500" } }); // < 1000
        fireEvent.change(screen.getByPlaceholderText("Số lượng"), { target: { value: "-1" } });   // < 0

        fireEvent.click(screen.getByText("Thêm mới"));

        // Kiểm tra các thông báo lỗi xuất hiện
        expect(await screen.findByText(/Tên sản phẩm phải có ít nhất 3 ký tự/i)).toBeInTheDocument();
        expect(screen.getByText(/Giá phải từ 1,000 đến dưới 999,999,999/i)).toBeInTheDocument();
        expect(screen.getByText(/Số lượng phải lớn hơn 0/i)).toBeInTheDocument();

        // Đảm bảo API addProduct KHÔNG được gọi khi có lỗi validate
        expect(ProductsApi.addProduct).not.toHaveBeenCalled();
    });

    test("TC_PRODUCT_008 - Log lỗi console khi Thêm sản phẩm thất bại (Server Error)", async () => {
        // Giả lập lỗi Server khi thêm
        const svError = new Error("Server Error 500");
        ProductsApi.addProduct.mockRejectedValue(svError);

        render(<ProductDashboard />);
        fireEvent.click(screen.getByText("Thêm sản phẩm"));

        // Nhập dữ liệu đúng
        fireEvent.change(screen.getByPlaceholderText("Tên sản phẩm"), { target: { value: "Valid Name" } });
        fireEvent.change(screen.getByPlaceholderText("Danh mục"), { target: { value: "Valid Cat" } });
        fireEvent.change(screen.getByPlaceholderText("Giá (VND)"), { target: { value: "50000" } });
        fireEvent.change(screen.getByPlaceholderText("Số lượng"), { target: { value: "10" } });
        fireEvent.change(screen.getByPlaceholderText("Mô tả sản phẩm"),{target: {value:"mô tả hợp lệ"}})

        fireEvent.click(screen.getByText("Thêm mới"));

        // Kiểm tra console.error bắt được lỗi
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("Lỗi khi gửi sản phẩm:", svError);
        });
    });

    test("TC_PRODUCT_009 - Đóng modal khi nhấn nút Hủy", async () => {
        render(<ProductDashboard />);
        fireEvent.click(screen.getByText("Thêm sản phẩm"));

        // Kiểm tra modal đang mở (tìm thấy text trong modal)
        expect(screen.getByText("Thêm sản phẩm mới")).toBeInTheDocument();

        // Click nút Hủy
        fireEvent.click(screen.getByText("Hủy"));

        // Kiểm tra modal đã đóng (không còn tìm thấy text đó nữa)
        await waitFor(() => {
            expect(screen.queryByText("Thêm sản phẩm mới")).not.toBeInTheDocument();
        });
    });

    test("TC_PRODUCT_010 - Log lỗi console khi API lấy danh sách sản phẩm thất bại (useEffect)", async () => {
        // 1. Chuẩn bị dữ liệu lỗi giả lập
        const expectedError = new Error("Network Error Connection Refused");

        // 2. Ép buộc hàm getAll phải trả về lỗi (Reject) thay vì thành công
        // Dòng này sẽ ghi đè mock mặc định trong beforeEach
        ProductsApi.getAll.mockRejectedValue(expectedError);

        // 3. Render component (sẽ kích hoạt useEffect ngay lập tức)
        render(<ProductDashboard />);

        // 4. Kiểm tra xem console.error có bắt được lỗi không
        // Phải dùng waitFor vì useEffect chạy bất đồng bộ
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("Lỗi khi lấy sản phẩm:", expectedError);
        });
    });

});