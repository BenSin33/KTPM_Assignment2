import { validateProduct } from "../../../utils/validation_product.js";

describe("validateProduct()", () => {
    const validProduct = {
        name: "Laptop Dell",
        price: 15000000,
        quantity: 10,
        description: "Máy tính xách tay hiệu suất cao",
        category: "Electronics",
        brand: "Dell",
        img: "https://example.com/image.jpg",
    };

    test("TC_PRODUCT_006 - Tên sản phẩm rỗng", () => {
        const result = validateProduct({ ...validProduct, name: "" });
        expect(result.name).toBe("Tên sản phẩm phải có ít nhất 3 ký tự");
    });

    test("Giá nằm ngoài khoảng hợp lệ", () => {
        expect(validateProduct({ ...validProduct, price: 999 }).price).toBeDefined();
        expect(validateProduct({ ...validProduct, price: 1000000000 }).price).toBeDefined();
    });

    test("Số lượng không hợp lệ", () => {
        expect(validateProduct({ ...validProduct, quantity: 0 }).quantity).toBeDefined();
        expect(validateProduct({ ...validProduct, quantity: 100000 }).quantity).toBeDefined();
    });

    test("Mô tả quá ngắn hoặc quá dài", () => {
        expect(validateProduct({ ...validProduct, description: "Hi" }).description).toBeDefined();
        expect(validateProduct({ ...validProduct, description: "A".repeat(501) }).description).toBeDefined();
    });

    test("Danh mục rỗng", () => {
        expect(validateProduct({ ...validProduct, category: "" }).category).toBeDefined();
    });

    test("Dữ liệu hợp lệ không có lỗi", () => {
        expect(validateProduct(validProduct)).toEqual({});
    });
});