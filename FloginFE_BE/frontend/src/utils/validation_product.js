export function validateProduct(product) {
    const errors = {};

    if (!product.name || product.name.trim().length < 3) {
        errors.name = "Tên sản phẩm phải có ít nhất 3 ký tự";
    }

    if (product.price == null || product.price < 1000 || product.price > 999999999) {
        errors.price = "Giá phải từ 1,000 đến dưới 999,999,999";
    }

    if (product.quantity == null || product.quantity <= 0 || product.quantity > 99999) {
        errors.quantity = "Số lượng phải lớn hơn 0 và nhỏ hơn 99,999";
    }

    if (!product.description || product.description.length < 3 || product.description.length > 500) {
        errors.description = "Mô tả phải từ 3 đến 500 ký tự";
    }

    if (!product.category || product.category.trim() === "") {
        errors.category = "Danh mục không được để trống";
    }

    return errors;
}