import api from './api';

const productService = {
  // GET /product/all-products
  getAllProducts: async () => {
    const res = await api.get('/product/all-products');
    return res.data?.data || res.data || [];
  },

  // GET /product/product/:productId — populated with farmer info
  getProduct: async (productId) => {
    const res = await api.get(`/product/product/${productId}`);
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

    const res = await api.post('/product/add-product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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

    const res = await api.post('/product/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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

  // GET /product/farmer-all-products or fallback to all-products filtered by farmer
  getFarmerProducts: async (farmerId) => {
    try {
      if (farmerId) {
        const res = await api.get('/product/farmer-all-products', {
           farmerId ,
        });
        const items = res.data?.data || res.data;
        if (Array.isArray(items) && items.length > 0) return items;
      }
    } catch {
      // Fallback to filtering all products
    }

    try {
      const allRes = await api.get('/product/all-products');
      const allProducts = allRes.data?.data || allRes.data || [];
      if (!farmerId) return allProducts;
      return allProducts.filter(
        (p) => p.farmer === farmerId || p.farmer?._id === farmerId || p.farmerId === farmerId
      );
    } catch {
      return [];
    }
  },
};

export default productService;
