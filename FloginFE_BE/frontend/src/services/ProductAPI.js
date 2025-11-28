import axios from "axios";

const URL_PRODUCTS = "http://localhost:8081/api/products";

export const ProductsApi = {
  getAll: async () => {
    const res = await axios.get(URL_PRODUCTS);
    return res.data;
  },

  getByID: async (id) => {
    const res = await axios.get(`${URL_PRODUCTS}/${id}`);
    return res.data;
  },

  addProduct: async (product) => {
    const res = await axios.post(URL_PRODUCTS, product);
    return res.data;
  },

  updateProduct: async (id, product) => {
    const res = await axios.put(`${URL_PRODUCTS}/${id}`, product);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await axios.delete(`${URL_PRODUCTS}/${id}`);
    return res.data;
  },
};
