import api from './api';

const wishlistService = {
  // GET /wishlist/get — requires JWT
  getWishlist: async () => {
    const res = await api.get('/wishlist/get');
    return res.data;
  },

  // POST /wishlist/add — { productId } — requires JWT
  addToWishlist: async (productId) => {
    const res = await api.post('/wishlist/add', { productId });
    return res.data;
  },

  // DELETE /wishlist/remove — { productId } — requires JWT
  removeFromWishlist: async (productId) => {
    const res = await api.delete('/wishlist/remove', { data: { productId } });
    return res.data;
  },
};

export default wishlistService;
