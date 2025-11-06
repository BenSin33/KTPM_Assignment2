import "./Product.css";
import { useState } from "react"; // Thêm để quản lý popup

const Header = () => {
  return (
    <div className="Header">
      <div className="header-left">
        <h2>Product</h2>
      </div>
    </div>
  );
};

const Center_Header = () => {
  return (
    <div className="Center_Header">
      <div className="search-section">
        <input type="text" placeholder="Tìm kiếm sản phẩm..." />
        <button type="button">Tìm kiếm</button>
      </div>

      <div className="filter-section">
        <label htmlFor="category">Lọc theo danh mục:</label>
        <select id="category" className="filter-select">
          <option value="all">Tất cả</option>
          <option value="electronics">Điện tử</option>
          <option value="clothing">Quần áo</option>
          <option value="books">Sách</option>
        </select>
      </div>
      <div className="filter-section">
        <label htmlFor="price">Lọc theo giá:</label>
        <select id="price" className="filter-select">
          <option value="all">Tất cả</option>
          <option value="under100k">Dưới 100k</option>
          <option value="100k-500k">100k - 500k</option>
          <option value="500k-1m">500k - 1 triệu</option>
          <option value="over1m">Trên 1 triệu</option>
        </select>
      </div>
      <div className="filter-section">
        <label htmlFor="brand">Lọc theo thương hiệu:</label>
        <select id="brand" className="filter-select">
          <option value="all">Tất cả</option>
          <option value="apple">Apple</option>
          <option value="samsung">Samsung</option>
          <option value="nike">Nike</option>
          <option value="adidas">Adidas</option>
        </select>
      </div>

      <button className="add-product-btn">Thêm sản phẩm</button>
    </div>
  );
};

const ProductBox = ({ onClick }) => {
  // Thêm prop onClick để mở popup
  return (
    <div className="ProductBox" onClick={onClick}>
      <img
        src="https://product.hstatic.net/1000344185/product/swe5185_e081f55901704787a6cb4079f0e881a1_master.jpg"
        alt="Sản phẩm 1"
      />
      <h3>Sản phẩm 1</h3>
      <p>Giá: 100.000 VND</p>
    </div>
  );
};

const Popup = ({ isOpen, onClose, product, isEditing, setIsEditing }) => {
  // Component popup
  const [editedProduct, setEditedProduct] = useState(product); // State cho edit

  if (!isOpen) return null;

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Giả lập lưu (tĩnh, không thực tế)
    setIsEditing(false);
    alert("Đã lưu thay đổi!");
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {/* Ảnh có thể chỉnh sửa: khi edit, chuyển thành input text để nhập URL */}
        {isEditing ? (
          <div>
            <label>
              <strong>URL Ảnh:</strong>
            </label>
            <input
              type="text"
              value={editedProduct.img}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, img: e.target.value })
              }
              placeholder="Nhập URL ảnh mới"
            />
            <img
              src={editedProduct.img}
              alt="Preview"
              className="popup-img-preview"
            />{" "}
            {/* Preview ảnh */}
          </div>
        ) : (
          <img src={product.img} alt={product.name} className="popup-img" />
        )}

        <div className="popup-info">
          <p>
            <strong>ID:</strong> {product.id} (Không thể sửa)
          </p>
          <p>
            <strong>Tên:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={editedProduct.name}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, name: e.target.value })
                }
              />
            ) : (
              product.name
            )}
          </p>
          <p>
            <strong>Giá:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={editedProduct.price}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, price: e.target.value })
                }
              />
            ) : (
              product.price
            )}
          </p>
          <p>
            <strong>Danh mục:</strong>{" "}
            {isEditing ? (
              <select
                value={editedProduct.category}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    category: e.target.value,
                  })
                }
              >
                <option value="electronics">Điện tử</option>
                <option value="clothing">Quần áo</option>
                <option value="books">Sách</option>
              </select>
            ) : (
              product.category
            )}
          </p>
          <p>
            <strong>Mô tả:</strong>{" "}
            {isEditing ? (
              <textarea
                value={editedProduct.description}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    description: e.target.value,
                  })
                }
              />
            ) : (
              product.description
            )}
          </p>
          <p>
            <strong>Thương hiệu:</strong>{" "}
            {isEditing ? (
              <select
                value={editedProduct.brand}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, brand: e.target.value })
                }
              >
                <option value="apple">Apple</option>
                <option value="samsung">Samsung</option>
                <option value="nike">Nike</option>
                <option value="adidas">Adidas</option>
              </select>
            ) : (
              product.brand
            )}
          </p>
        </div>
        <div className="popup-buttons">
          <button onClick={isEditing ? handleSave : handleEdit}>
            {isEditing ? "Lưu" : "Sửa"}
          </button>
          <button onClick={() => alert("Đã xóa sản phẩm!")}>Xóa</button>
        </div>
      </div>
    </div>
  );
};

const Center_Center = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct] = useState({
    // Dữ liệu mẫu cho popup
    id: "001",
    name: "Sản phẩm 1",
    price: "100.000 VND",
    category: "Điện tử",
    description: "Mô tả sản phẩm mẫu.",
    brand: "Apple",
    img: "https://product.hstatic.net/1000344185/product/swe5185_e081f55901704787a6cb4079f0e881a1_master.jpg",
  });

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    setIsEditing(false);
  };

  return (
    <div className="Center_Center">
      <ProductBox onClick={openPopup} />
      <ProductBox onClick={openPopup} />
      <ProductBox onClick={openPopup} />
      <ProductBox onClick={openPopup} />
      <ProductBox onClick={openPopup} />
      <ProductBox onClick={openPopup} />
      <ProductBox onClick={openPopup} />
      <ProductBox onClick={openPopup} />
      <ProductBox onClick={openPopup} />
      <ProductBox onClick={openPopup} />
      <ProductBox onClick={openPopup} />
      <ProductBox onClick={openPopup} />

      <div className="pagination">
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>Tiếp theo</button>
      </div>

      <Popup
        isOpen={isPopupOpen}
        onClose={closePopup}
        product={selectedProduct}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
};

const Center = () => {
  return (
    <div className="Center">
      <Center_Header />
      <Center_Center />
    </div>
  );
};

const ProductPage = () => {
  return (
    <div className="Main">
      <Header />
      <Center />
    </div>
  );
};

export default ProductPage;
