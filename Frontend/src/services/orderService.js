import api from './api';

const orderService = {
  // POST /order/cashondelivery
  // Body: { userId, Products[], totalAmount, actualAmount, offerID?, OfferName?, Discount? }
  // Products: [{ product: productId, quantity, price, farmerId }]
  placeOrder: async (orderData) => {
    const res = await api.post('/order/cashondelivery', orderData);
    return res.data;
  },

  // GET /order/getuserorders — requires JWT
  getUserOrders: async () => {
    const res = await api.get('/order/getuserorders');
    return res.data;
  },

  // GET /order/farmerorderlist — requires JWT
  getFarmerOrders: async () => {
    const res = await api.get('/order/farmerorderlist');
    return res.data;
  },

  // PATCH /order/updatestatus — { orderId, status }
  // Valid statuses: "Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"
  updateOrderStatus: async (orderId, status) => {
    const res = await api.patch('/order/updatestatus', { orderId, status });
    return res.data;
  },

  // GET /order/getorders — all orders (admin)
  getAllOrders: async () => {
    const res = await api.get('/order/getorders');
    return res.data;
  },

  // DELETE /order/updateorderrecord — { orderId }
  deleteOrder: async (orderId) => {
    const res = await api.delete('/order/updateorderrecord', { data: { orderId } });
    return res.data;
  },
};

export default orderService;
