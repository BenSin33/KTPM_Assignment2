// Giả định địa chỉ API backend của bạn
const API_URL = "http://localhost:8081/api/products";

/**
 * Lấy tất cả sản phẩm
 * (Dùng cho ProductList)
 */
export const getAllProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error; // Ném lỗi ra để component có thể bắt
  }
};

/**
 * Lấy chi tiết một sản phẩm bằng ID
 * (Dùng cho ProductDetail và ProductForm (Edit))
 */
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo một sản phẩm mới
 * (Dùng cho ProductForm (Create))
 */
export const createProduct = async (productData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error("Failed to create product");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
};

/**
 * Cập nhật một sản phẩm
 * (Dùng cho ProductForm (Edit))
 */
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to update product with id ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa một sản phẩm
 * (Dùng cho ProductList)
 */
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
    // Hàm DELETE thường không trả về nội dung (hoặc trả về 204 No Content)
    // nên chúng ta có thể trả về response.ok
    return { success: response.ok };
  } catch (error) {
    console.error(`Failed to delete product with id ${id}:`, error);
    throw error;
  }
};
