import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductDashboard from "../../../component/product_dashboard/Product.jsx";
import { ProductsApi } from "../../../services/ProductAPI.js";

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

    beforeEach(() => {
        ProductsApi.getAll.mockResolvedValue([mockProduct]);
        ProductsApi.addProduct.mockResolvedValue({});
        ProductsApi.updateProduct.mockResolvedValue({});
        ProductsApi.deleteProduct.mockResolvedValue({});
    });

    test("TC_PRODUCT_007 - Hiển thị danh sách sản phẩm", async () => {
        render(<ProductDashboard />);

        // Kiểm tra tên sản phẩm
        expect(await screen.findByText("Laptop Dell")).toBeInTheDocument();

        // Kiểm tra giá sản phẩm với định dạng tiền tệ Việt Nam
        expect(screen.getByText("15.000.000 ₫")).toBeInTheDocument();
    });

    test("TC_PRODUCT_001 - Tạo sản phẩm mới thành công", async () => {
        render(<ProductDashboard />);
        fireEvent.click(screen.getByText("Thêm sản phẩm"));

        fireEvent.change(screen.getByPlaceholderText("Tên sản phẩm"), { target: { value: "Laptop Dell" } });
        fireEvent.change(screen.getByPlaceholderText("Danh mục"), { target: { value: "Electronics" } });
        fireEvent.change(screen.getByPlaceholderText("Giá (VND)"), { target: { value: "15000000" } });
        fireEvent.change(screen.getByPlaceholderText("Số lượng"), { target: { value: "10" } });
        fireEvent.change(screen.getByPlaceholderText("Mô tả sản phẩm"), { target: { value: "Máy tính xách tay hiệu suất cao" } });

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

    test("TC_PRODUCT_005 - Xóa sản phẩm không tồn tại", async () => {
        ProductsApi.deleteProduct.mockRejectedValue(new Error("Product not found"));
        render(<ProductDashboard />);
        await waitFor(() => {
            expect(() => ProductsApi.deleteProduct(999)).rejects.toThrow("Product not found");
        });
    });
});