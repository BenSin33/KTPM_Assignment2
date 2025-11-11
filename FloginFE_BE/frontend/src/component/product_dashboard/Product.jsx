import React, { useState } from "react";
import Layout from "./layout.jsx";
import "./Product.css";

const ProductDashboard = () => {
  const [products, setProducts] = useState([
    {
      name: "Laptop Dell XPS 15",
      category: "Laptop",
      price: 30000000,
      quantity: 1,
      createdAt: "11/1/2025",
    },
    {
      name: "iPhone 15 Pro Max",
      category: "Điện thoại",
      price: 40000000,
      quantity: 1,
      createdAt: "2/1/2025",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      ...form,
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };
    setProducts([...products, newProduct]);
    setForm({
      name: "",
      category: "",
      price: "",
      quantity: "",
      description: "",
    });
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="dashboard">
        <h2>Quản lý sản phẩm</h2>
        <p className="subtitle">
          Quản lý danh sách sản phẩm với các chức năng thêm, sửa, xóa
        </p>

        <div className="summary">
          <div>Số lượng sản phẩm: {products.length}</div>
          <div>
            Tổng giá trị:{" "}
            {products
              .reduce((sum, p) => sum + Number(p.price), 0)
              .toLocaleString("vi-VN")}{" "}
            ₫
          </div>
          <div>
            Sắp hết hàng:{" "}
            {products.filter((p) => Number(p.quantity) <= 5).length}
          </div>
        </div>

        <button className="add-button" onClick={() => setShowModal(true)}>
          Thêm sản phẩm
        </button>

        <table className="product-table">
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={index}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{Number(p.price).toLocaleString("vi-VN")} ₫</td>
                <td>{p.quantity}</td>
                <td>{p.createdAt}</td>
                <td>
                  <button className="action-btn">Sửa</button>
                  <button className="action-btn delete">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Thêm sản phẩm mới</h3>
              <p>Điền thông tin để tạo sản phẩm mới</p>
              <form onSubmit={handleAddProduct}>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Tên sản phẩm"
                  required
                />
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Danh mục"
                  required
                />
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Giá (VND)"
                  required
                />
                <input
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Số lượng"
                  required
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Mô tả sản phẩm"
                />
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)}>
                    Hủy
                  </button>
                  <button type="submit">Thêm mới</button>
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
