import React, { useState, useEffect } from "react";
import Layout from "./layout.jsx";
import "./Product.css";
import { ProductsApi } from "../../services/ProductAPI.js";
import { validateProduct } from "../../utils/validation_product.js";

const ProductDashboard = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
        brand: "",
        img: "",
    });

    // START: LOGIC SEARCH VÀ STATE
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        // Cập nhật state tìm kiếm mỗi khi input thay đổi
        setSearchTerm(e.target.value);
    };

    const getFilteredProducts = () => {
        if (!searchTerm) {
            return products; // Trả về toàn bộ nếu không có từ khóa
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return products.filter(product =>
            // Logic lọc theo tên sản phẩm (không phân biệt chữ hoa, chữ thường)
            product.name.toLowerCase().includes(lowerCaseSearchTerm)
        );
    };

    const filteredProducts = getFilteredProducts(); // Lấy danh sách đã lọc
    // END: LOGIC SEARCH VÀ STATE

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await ProductsApi.getAll();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
            }
        };
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            ...form,
            create_at: new Date().toISOString().split("T")[0],
        };

        const errors = validateProduct(productData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            if (editingProductId) {
                await ProductsApi.updateProduct(editingProductId, productData);
            } else {
                await ProductsApi.addProduct(productData);
            }
            const updatedList = await ProductsApi.getAll();
            setProducts(updatedList);
            // Sau khi submit thành công và cập nhật danh sách, cần đặt lại searchTerm
            // để đảm bảo danh sách hiển thị đầy đủ
            setSearchTerm('');
            setForm({
                name: "",
                category: "",
                price: "",
                quantity: "",
                description: "",
                brand: "",
                img: "",
            });
            setFormErrors({});
            setEditingProductId(null);
            setShowModal(false);
        } catch (error) {
            console.error("Lỗi khi gửi sản phẩm:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await ProductsApi.deleteProduct(id);
            const updatedList = await ProductsApi.getAll();
            setProducts(updatedList);
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
    };

    const handleEdit = (product) => {
        setEditingProductId(product.id);
        setForm({
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: product.quantity,
            description: product.description,
            brand: product.brand,
            img: product.img,
        });
        setFormErrors({});
        setShowModal(true);
    };

    return (
        <Layout>
            <div className="dashboard">
                <h2>Quản lý sản phẩm</h2>
                <p className="subtitle">
                    Quản lý danh sách sản phẩm với các chức năng thêm, sửa, xóa
                </p>

                <div className="summary">
                    {/* ... (Các thông tin tóm tắt) ... */}
                </div>

                {/* 1. KHUNG TÌM KIẾM */}
                <div className="search-controls">
                    <input
                        data-testid="search-input"
                        type="text"
                        value={searchTerm} // Liên kết với state searchTerm
                        onChange={handleSearchChange} // Liên kết với hàm xử lý thay đổi
                        placeholder="Tìm kiếm sản phẩm theo tên..."
                        className="search-input"
                    />
                    <button data-testid="search-btn" className="search-button">
                        Tìm kiếm
                    </button>
                </div>

                {/* THÊM data-testid cho nút Thêm sản phẩm (Nút mở modal) */}
                <button
                    data-testid="add-product-btn"
                    className="add-button"
                    onClick={() => {
                        setEditingProductId(null);
                        setForm({
                            name: "",
                            category: "",
                            price: "",
                            quantity: "",
                            description: "",
                            brand: "",
                            img: "",
                        });
                        setFormErrors({});
                        setShowModal(true);
                    }}
                >
                    Thêm sản phẩm
                </button>

                <table className="product-table">
                    <thead>
                    <tr>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Thương hiệu</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Ngày tạo</th>
                        <th>Hình ảnh</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* SỬ DỤNG DANH SÁCH ĐÃ LỌC: filteredProducts */}
                    {filteredProducts.map((p) => (
                        <tr key={p.id} data-testid="product-row">
                            <td>{p.name}</td>
                            <td>{p.category}</td>
                            <td>{p.brand}</td>
                            <td>{Number(p.price).toLocaleString("vi-VN")} ₫</td>
                            <td>{p.quantity}</td>
                            <td>{p.create_at}</td>
                            <td>
                                <img src={p.img} alt={p.name} width="50" />
                            </td>
                            <td>
                                {/* THÊM data-testid cho nút Sửa */}
                                <button
                                    data-testid="edit-btn"
                                    className="action-btn"
                                    onClick={() => handleEdit(p)}
                                >
                                    Sửa
                                </button>
                                {/* THÊM data-testid cho nút Xóa */}
                                <button
                                    data-testid="delete-btn"
                                    className="action-btn delete"
                                    onClick={() => handleDelete(p.id)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal" data-testid="product-modal"> {/* THÊM data-testid cho modal */}
                            <h3>{editingProductId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
                            <p>
                                {editingProductId
                                    ? "Chỉnh sửa thông tin sản phẩm"
                                    : "Điền thông tin để tạo sản phẩm mới"}
                            </p>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    {/* THÊM data-testid cho input Tên sản phẩm */}
                                    <input
                                        data-testid="product-name-input"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Tên sản phẩm"
                                        required
                                        className={formErrors.name ? "error" : ""}
                                    />
                                    {formErrors.name && (
                                        <div className="error">{formErrors.name}</div>
                                    )}
                                </div>

                                <div>
                                    {/* THÊM data-testid cho input Danh mục */}
                                    <input
                                        data-testid="product-category-input"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        placeholder="Danh mục"
                                        required
                                        className={formErrors.category ? "error" : ""}
                                    />
                                    {formErrors.category && (
                                        <div className="error">{formErrors.category}</div>
                                    )}
                                </div>

                                <div>
                                    {/* THÊM data-testid cho input Thương hiệu */}
                                    <input
                                        data-testid="product-brand-input"
                                        name="brand"
                                        value={form.brand}
                                        onChange={handleChange}
                                        placeholder="Thương hiệu"
                                    />
                                </div>

                                <div>
                                    {/* THÊM data-testid cho input Giá */}
                                    <input
                                        data-testid="product-price-input"
                                        name="price"
                                        type="number"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="Giá (VND)"
                                        required
                                        className={formErrors.price ? "error" : ""}
                                    />
                                    {formErrors.price && (
                                        <div className="error">{formErrors.price}</div>
                                    )}
                                </div>

                                <div>
                                    {/* THÊM data-testid cho input Số lượng */}
                                    <input
                                        data-testid="product-quantity-input"
                                        name="quantity"
                                        type="number"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        placeholder="Số lượng"
                                        required
                                        className={formErrors.quantity ? "error" : ""}
                                    />
                                    {formErrors.quantity && (
                                        <div className="error">{formErrors.quantity}</div>
                                    )}
                                </div>

                                <div>
                                    {/* THÊM data-testid cho input Link hình ảnh */}
                                    <input
                                        data-testid="product-img-input"
                                        name="img"
                                        value={form.img}
                                        onChange={handleChange}
                                        placeholder="Link hình ảnh"
                                    />
                                </div>

                                <div>
                                    {/* THÊM data-testid cho textarea Mô tả */}
                                    <textarea
                                        data-testid="product-description-input"
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Mô tả sản phẩm"
                                        className={formErrors.description ? "error" : ""}
                                    />
                                    {formErrors.description && (
                                        <div className="error">{formErrors.description}</div>
                                    )}
                                </div>

                                <div className="modal-actions">
                                    {/* THÊM data-testid cho nút Hủy */}
                                    <button
                                        data-testid="cancel-form-btn"
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingProductId(null);
                                        }}
                                    >
                                        Hủy
                                    </button>
                                    {/* THÊM data-testid cho nút Submit/Cập nhật */}
                                    <button data-testid="submit-form-btn" type="submit">
                                        {editingProductId ? "Cập nhật" : "Thêm mới"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ProductDashboard;