import { ProductsApi } from "../../services/ProductAPI.js";
import axios from "axios";
const mockProducts = [
  {
    id: 1,
    name: "Laptop Asus Vivobook",
    category: "Electronics",
    price: 18500000,
    quantity: 10,
    createdAt: "2025-11-11",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    category: "Electronics",
    price: 28900000,
    quantity: 5,
    createdAt: "2025-11-11",
  },
  {
    id: 3,
    name: "Tai nghe Sony WH-1000XM5",
    category: "Accessories",
    price: 8900000,
    quantity: 15,
    createdAt: "2025-11-11",
  },
];

jest.mock("axios");

describe("Mock test getAllProducts", () => {
  test("lay tat ca sa pham", async () => {
    axios.get.mockResolvedValue({ data: mockProducts });

    const products = await ProductsApi.getAll();
    expect(products).toEqual(mockProducts);
    expect(axios.get).toHaveBeenCalledWith("http://localhost:8081/api/products");
  });

  test("lay san pham theo ID", async () => {
    const product = mockProducts[0];
    axios.get.mockResolvedValue({ data: product });

    const result = await ProductsApi.getByID(1);

    expect(result).toEqual(product);
    expect(axios.get).toHaveBeenCalledWith("http://localhost:8081/api/products/1");
  });

  test("them san pham", async () => {
    const product = { ...ProductsApi[0], id: 4 };
    axios.post.mockResolvedValue({ data: product });

    const result = await ProductsApi.addProduct(product);

    expect(result).toEqual(product);
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8081/api/products",
      product
    );
  });

  test("cap nhat thong tin sn pham", async () => {
    const product = mockProducts[0];
    product.name = "adida";
    axios.put.mockResolvedValue({ data: product });

    const result = await ProductsApi.updateProduct(product.id, product);

    expect(result).toEqual(product);
    expect(axios.put).toHaveBeenCalledWith(
      "http://localhost:8081/api/products/1",
      product
    );
  });

  test("xoa mot san pham", async () => {
    const mockres = { success: true };

    axios.delete.mockResolvedValue({ data: mockres });
    const result = await ProductsApi.deleteProduct(mockProducts[0].id);

    expect(result).toEqual(mockres);
    expect(axios.delete).toHaveBeenCalledWith(
      "http://localhost:8081/api/products/1"
    );
  });
});
