import "./Product.css";

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

const ProductBox = () => {
  return (
    <div className="ProductBox">
      <img src="https://via.placeholder.com/200x150" alt="Sản phẩm 1" />
      <h3>Sản phẩm 1</h3>
      <p>Giá: 100.000 VND</p>
    </div>
  );
};

const Center_Center = () => {
  return (
    <div className="Center_Center">
      <ProductBox />
      <ProductBox />
      <ProductBox />
      <ProductBox />
      <ProductBox />
      <ProductBox />
      <ProductBox />
      <ProductBox />
      <ProductBox />
      <ProductBox />
      <ProductBox />
      <ProductBox />

      <div className="pagination">
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>Tiếp theo</button>
      </div>
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
