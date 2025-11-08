// src/tests/Product_test/validation_product.test.js
import { validateProduct } from '../../utils/validation_product.js';

describe('validateProduct()', () => {
    test('lỗi nếu tên sản phẩm quá ngắn', () => {
        expect(validateProduct({ name: '' }).name).toBe("Tên sản phẩm phải có ít nhất 3 ký tự");
        expect(validateProduct({ name: 'ab' }).name).toBe("Tên sản phẩm phải có ít nhất 3 ký tự");
    });

    test('lỗi nếu giá không hợp lệ', () => {
        expect(validateProduct({ price: null }).price).toBe("Giá phải từ 1k trở lên");
        expect(validateProduct({ price: 999 }).price).toBe("Giá phải từ 1k trở lên");
        expect(validateProduct({ price: 1001 }).price).toBe("Giá phải từ 1k trở lên");
    });

    test('lỗi nếu số lượng âm hoặc null', () => {
        expect(validateProduct({ quantity: null }).quantity).toBe("Số lượng phải lớn hơn không");
        expect(validateProduct({ quantity: -1 }).quantity).toBe("Số lượng phải lớn hơn không");
    });

    test('lỗi nếu mô tả quá dài', () => {
        const longDesc = 'a'.repeat(501);
        expect(validateProduct({ description: longDesc }).description).toBe("Mô tả không được vượt quá 500 ký tự");
    });

    test('lỗi nếu danh mục trống', () => {
        expect(validateProduct({ category: '' }).category).toBe("Danh mục không được để trống");
        expect(validateProduct({ category: '   ' }).category).toBe("Danh mục không được để trống");
    });

    test('không lỗi nếu dữ liệu hợp lệ', () => {
        const valid = {
            name: 'Laptop Dell',
            price: 1000,
            quantity: 1,
            description: 'Máy tính xách tay cao cấp',
            category: 'Laptop',
        };
        expect(validateProduct(valid)).toEqual({});
    });
});