import api from './api';

const productService = {
  // GET /product/all-products
  getAllProducts: async () => {
    const res = await api.get('/product/all-products');
    return res.data?.data || res.data || [];
  },

  // GET /product/product/:productId — populated with farmer info
  getProduct: async (productId) => {
    const res = await api.get(`/product/product/${productId}`, {
      validateStatus: (status) => status >= 200 && status < 400
    });
    return res.data?.data || res.data;
  },

  // POST /product/add-product — multipart (image), requires JWT
  // Body: name, description, price, quantity, unit, stock, farmerId, Category
  addProduct: async (productData) => {
    let formData = productData;
    if (!(productData instanceof FormData)) {
      formData = new FormData();
      Object.keys(productData).forEach((key) => {
        if (key === 'image' && productData[key]) {
          formData.append('image', productData[key]);
        } else if (productData[key] !== undefined && productData[key] !== null) {
          formData.append(key, productData[key]);
        }
      });
    }

    const res = await api.post('/product/add-product', formData);
    return res.data?.data || res.data;
  },

  // POST /product/update — multipart (image)
  // Body: productId, name, description, price, quantity, unit, stock, farmerId, Category
  updateProduct: async (productData) => {
    let formData = productData;
    if (!(productData instanceof FormData)) {
      formData = new FormData();
      Object.keys(productData).forEach((key) => {
        if (key === 'image' && productData[key] instanceof File) {
          formData.append('image', productData[key]);
        } else if (productData[key] !== undefined && productData[key] !== null) {
          formData.append(key, productData[key]);
        }
      });
    }

    const res = await api.post('/product/update', formData);
    return res.data?.data || res.data;
  },

  // DELETE /product/farmer/:productId — requires JWT
  deleteProduct: async (productId) => {
    const res = await api.delete(`/product/farmer/${productId}`);
    return res.data?.data || res.data;
  },

  deleteFarmerProduct: async (productId) => {
    const res = await api.delete(`/product/farmer/${productId}`);
    return res.data?.data || res.data;
  },

  getFarmerProducts: async (farmerId) => {
    try {
      if (farmerId) {
        const res = await api.post('/product/farmer-all-products', { farmerId: farmerId });
        const items = res.data?.data || res.data;
        if (Array.isArray(items)) return items;
      }
      return [];
    } catch (err) {
      if (err.response?.status === 404) return [];
      console.error("Error fetching farmer products", err);
      throw err;
    }
  },
};

export default productService;
