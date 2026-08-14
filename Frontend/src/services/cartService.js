import api from './api';

const cartService = {
  // GET /cart/get — requires JWT
  getCart: async () => {
    const res = await api.get('/cart/get');
    return res.data;
  },

  // POST /cart/add — { productId, quantity } — requires JWT
  addToCart: async (productId, quantity = 1) => {
    const res = await api.post('/cart/add', { productId, quantity });
    return res.data;
  },

  // PATCH /cart/update — { productId, quantity } — requires JWT
  // quantity 0 removes item from cart
  updateCart: async (productId, quantity) => {
    const res = await api.patch('/cart/update', { productId, quantity });
    return res.data;
  },
};

export default cartService;
