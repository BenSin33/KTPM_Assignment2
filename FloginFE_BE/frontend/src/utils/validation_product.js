// src/utils/validation_product.js
export function validateProduct(product) {
    const errors = {};

    if (!product.name || product.name.trim().length < 3) {
        errors.name = "Tên sản phẩm phải có ít nhất 3 ký tự";
    }

    if (product.price == null || product.price < 1000 || product.price > 1000) {
        errors.price = "Giá phải từ 1k trở lên";
    }

    if (product.quantity == null || product.quantity < 0) {
        errors.quantity = "Số lượng phải lớn hơn không";
    }

    if (product.description && product.description.length > 500) {
        errors.description = "Mô tả không được vượt quá 500 ký tự";
    }

    if (!product.category || product.category.trim() === '') {
        errors.category = "Danh mục không được để trống";
    }

    return errors;
}