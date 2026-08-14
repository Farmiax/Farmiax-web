import api from './api';

const productService = {
  // GET /product/all-products
  getAllProducts: async () => {
    const res = await api.get('/product/all-products');
    return res.data;
  },

  // GET /product/product/:productId — populated with farmer info
  getProduct: async (productId) => {
    const res = await api.get(`/product/product/${productId}`);
    return res.data;
  },

  // POST /product/add-product — multipart (image), requires JWT
  // Body: name, description, price, quantity, unit, stock, farmerId, Category
  addProduct: async (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      if (key === 'image' && productData[key]) {
        formData.append('image', productData[key]);
      } else if (productData[key] !== undefined && productData[key] !== null) {
        formData.append(key, productData[key]);
      }
    });

    const res = await api.post('/product/add-product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // POST /product/update — multipart (image)
  // Body: productId, name, description, price, quantity, unit, stock, farmerId, Category
  updateProduct: async (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      if (key === 'image' && productData[key] instanceof File) {
        formData.append('image', productData[key]);
      } else if (productData[key] !== undefined && productData[key] !== null) {
        formData.append(key, productData[key]);
      }
    });

    const res = await api.post('/product/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // DELETE /product/farmer/:productId — requires JWT
  deleteProduct: async (productId) => {
    const res = await api.delete(`/product/farmer/${productId}`);
    return res.data;
  },

  // GET /product/farmer-all-products — body: { farmerId }
  // Note: Backend reads farmerId from req.body on GET (unusual).
  // We use POST-like approach or pass as query param workaround.
  getFarmerProducts: async (farmerId) => {
    const res = await api.get('/product/farmer-all-products', {
      data: { farmerId },
      params: { farmerId },
    });
    return res.data;
  },
};

export default productService;
