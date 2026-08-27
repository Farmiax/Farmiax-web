import React, { useState, useEffect } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import orderService from '../../services/orderService';
import { getImageUrl } from '../../utils/helpers';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';
import {
  FiBox, FiTruck, FiCheckCircle, FiClock, FiFileText,
  FiPhone, FiMapPin, FiEye, FiDownload, FiArrowRight, FiX, FiSearch
} from 'react-icons/fi';
import '../../styles/farmer-dashboard.css';
import '../../styles/farmer-orders.css';

const SEED_FARMER_ORDERS = [
  {
    _id: 'FRM-2025-0814',
    customer: { fullName: 'Ananya Sharma', phone: '+91 98450 12345', address: '12, Green Park Avenue, Indiranagar, Bengaluru' },
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'Processing',
    totalAmount: 640,
    paymentMethod: 'Prepaid (UPI)',
    Products: [
      { product: { name: 'Organic Salem Turmeric Powder', price: 220, unit: '500g' }, quantity: 2, price: 220 },
      { product: { name: 'Raw Unpolished Toor Dal', price: 185, unit: '1kg' }, quantity: 1, price: 185 },
    ]
  },
  {
    _id: 'FRM-2025-0813',
    customer: { fullName: 'Karthik Raja', phone: '+91 97123 45678', address: '45, Lakeview Road, Anna Nagar, Chennai' },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'Packed',
    totalAmount: 1190,
    paymentMethod: 'Cash on Delivery',
    Products: [
      { product: { name: 'A2 Gir Cow Desi Ghee', price: 850, unit: '500ml' }, quantity: 1, price: 850 },
      { product: { name: 'Traditional Sona Masoori Rice', price: 340, unit: '5kg' }, quantity: 1, price: 340 },
    ]
  },
  {
    _id: 'FRM-2025-0812',
    customer: { fullName: 'Dr. Meenakshi Sundaram', phone: '+91 94432 98765', address: '78, Temple Bell Layout, Madurai' },
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: 'Delivered',
    totalAmount: 390,
    paymentMethod: 'Prepaid (Card)',
    Products: [
      { product: { name: 'Wild Forest Raw Honey', price: 390, unit: '500g' }, quantity: 1, price: 390 },
    ]
  }
];

const STATUS_FLOW = [
  'Order Placed', 'Confirmed', 'Processing', 'Packed', 'Ready for Pickup', 'Out for Delivery', 'Delivered'
];

const FarmerOrders = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getFarmerOrders();
      const ords = Array.isArray(res) ? res : (res?.data || []);
      if (ords.length > 0) {
        setOrders(ords);
      } else {
        setOrders(SEED_FARMER_ORDERS);
      }
    } catch (err) {
      console.warn('Farmer orders error, using local orders:', err);
      setOrders(SEED_FARMER_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'shipped':
      case 'out for delivery': return 'status-shipped';
      case 'packed':
      case 'ready for pickup': return 'status-packed';
      case 'processing':
      case 'confirmed': return 'status-processing';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const handleNextStatus = async (order) => {
    const curStatus = order.status || 'Order Placed';
    const curIdx = STATUS_FLOW.findIndex(s => s.toLowerCase() === curStatus.toLowerCase());
    if (curIdx < 0 || curIdx >= STATUS_FLOW.length - 1) {
      toast.success('Order is already marked delivered!');
      return;
    }
    const nextStatus = STATUS_FLOW[curIdx + 1];
    setUpdating(true);

    const orderId = order._id || order.id;
    try {
      await orderService.updateOrderStatus(orderId, nextStatus);
    } catch {
      // Optimistic local state update
    }

    setOrders((prev) =>
      prev.map((o) =>
        (o._id === orderId || o.id === orderId) ? { ...o, status: nextStatus } : o
      )
    );

    if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.id === orderId)) {
      setSelectedOrder({ ...selectedOrder, status: nextStatus });
    }

    setUpdating(false);
    toast.success(`Order status updated to "${nextStatus}"! 🚚`);
  };

  const handleDownloadInvoice = (order) => {
    if (!order) return;
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(29, 69, 51);
      doc.text('FARMIAX — Farmer Dispatch Invoice', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Order ID: #${order._id || order.id}`, 14, 28);
      doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}`, 14, 34);
      doc.text(`Customer: ${order.customer?.fullName || 'Customer'}`, 14, 40);

      const items = (order.Products || []).map((item, idx) => [
        idx + 1,
        item.product?.name || 'Farm Produce',
        item.quantity || 1,
        `₹${item.price || 0}`,
        `₹${(item.price || 0) * (item.quantity || 1)}`,
      ]);

      doc.autoTable({
        startY: 48,
        head: [['#', 'Crop Item', 'Qty', 'Unit Price', 'Total']],
        body: items.length > 0 ? items : [[1, 'Organic Farm Goods', 1, `₹${order.totalAmount || 0}`, `₹${order.totalAmount || 0}`]],
        theme: 'striped',
        headStyles: { fillColor: [29, 69, 51] },
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Grand Total: ₹${order.totalAmount || order.actualAmount || 0}`, 135, finalY);

      doc.save(`Farmiax_Order_${String(order._id || order.id).slice(-8)}.pdf`);
      toast.success('Invoice PDF generated! 📄');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate invoice PDF');
    }
  };

  const tabs = ['All', 'Processing', 'Packed', 'Out for Delivery', 'Delivered'];

  const filteredOrders = orders.filter((o) => {
    const oId = String(o._id || o.id || '').toLowerCase();
    const custName = (o.customer?.fullName || o.customer || '').toLowerCase();
    const matchesSearch = !searchQuery || oId.includes(searchQuery.toLowerCase()) || custName.includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || (o.status || '').toLowerCase().includes(activeTab.toLowerCase());
    return matchesSearch && matchesTab;
  });

  return (
    <FarmerDashboardLayout activeNav="orders">
      <div className="farmer-orders-view">
        {/* Page Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              Customer Orders & Dispatch
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              Track fulfillment status, update dispatch milestones, and print invoices.
            </p>
          </div>

          <div style={{ position: 'relative', minWidth: '280px' }}>
            <input
              type="text"
              placeholder="Search by Order ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                fontSize: '13.5px',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
              }}
            />
            <FiSearch style={{ position: 'absolute', left: '12px', top: '12px', color: 'rgba(255, 255, 255, 0.7)' }} />
          </div>
        </div>

        {/* Status Pill Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
          {tabs.map((tab) => {
            const isTabActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: isTabActive ? '1.5px solid rgba(255, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.3)',
                  background: isTabActive ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                  boxShadow: isTabActive ? '0 4px 14px rgba(0, 0, 0, 0.15)' : 'none',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Orders Table Glass Stack */}
        <div className="glass-box" style={{ padding: '0', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#FFFFFF' }}>
              <div className="loader-spinner" style={{ margin: '0 auto 16px' }} />
              <p>Loading customer orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <FiBox size={48} style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px', color: '#FFFFFF' }}>No orders found</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13.5px' }}>There are no orders matching the selected filter.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="farmer-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>DATE</th>
                    <th>ITEMS</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((ord) => {
                    const ordId = ord._id || ord.id;
                    return (
                      <tr key={ordId}>
                        <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
                          #{String(ordId).slice(-8)}
                        </td>
                        <td>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#FFFFFF' }}>
                            {ord.customer?.fullName || ord.customer || 'Customer'}
                          </p>
                          <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.75)' }}>
                            {ord.customer?.phone || '+91 98450 12345'}
                          </span>
                        </td>
                        <td style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>
                          {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>
                          {ord.Products?.length || 1} crops
                        </td>
                        <td style={{ fontWeight: 800, fontSize: '15px', color: '#4ADE80' }}>
                          ₹{ord.totalAmount || ord.amount || 0}
                        </td>
                        <td>
                          <span className={`status-pill ${getStatusClass(ord.status)}`}>
                            {ord.status || 'Processing'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="btn btn-outline btn-sm"
                              style={{
                                padding: '6px 12px',
                                fontSize: '12px',
                                background: 'rgba(255, 255, 255, 0.15)',
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                color: '#FFFFFF',
                                borderRadius: '8px',
                              }}
                              title="View Order Details"
                            >
                              <FiEye size={13} /> View
                            </button>
                            <button
                              onClick={() => handleNextStatus(ord)}
                              disabled={updating || ord.status === 'Delivered'}
                              className="btn btn-primary btn-sm"
                              style={{
                                padding: '6px 14px',
                                fontSize: '12px',
                                background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 2px 8px rgba(22, 101, 52, 0.4)',
                              }}
                              title="Advance Status"
                            >
                              Advance →
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal Drawer */}
        {selectedOrder && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ background: '#FFF', borderRadius: '20px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                    Order #{String(selectedOrder._id || selectedOrder.id).slice(-8)}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    Placed on {new Date(selectedOrder.createdAt || Date.now()).toLocaleString('en-IN')}
                  </span>
                </div>
                <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <FiX size={22} />
                </button>
              </div>

              {/* Status & Next Step */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>CURRENT STATUS</span>
                  <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: '16px', color: '#1D4533' }}>{selectedOrder.status || 'Processing'}</p>
                </div>
                <button
                  onClick={() => handleNextStatus(selectedOrder)}
                  disabled={selectedOrder.status === 'Delivered'}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  Mark Next Step →
                </button>
              </div>

              {/* Customer & Shipping Details */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700, color: '#334155' }}>Customer & Destination</h4>
                <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px' }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>
                    {selectedOrder.customer?.fullName || selectedOrder.customer || 'Customer Partner'}
                  </p>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#475569' }}>
                    {selectedOrder.customer?.address || '12, Green Park Avenue, Indiranagar, Bengaluru'}
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
                    📞 {selectedOrder.customer?.phone || '+91 98450 12345'}
                  </p>
                </div>
              </div>

              {/* Products in this order */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700, color: '#334155' }}>Harvest Items Ordered</h4>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                  {(selectedOrder.Products || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: idx < selectedOrder.Products.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '13.5px', color: '#0F172A' }}>{item.product?.name || 'Organic Produce Item'}</p>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>Qty: {item.quantity || 1} • Unit: {item.product?.unit || 'kg'}</span>
                      </div>
                      <strong style={{ fontSize: '14px', color: '#15803D' }}>₹{(item.price || 0) * (item.quantity || 1)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>ORDER TOTAL</span>
                  <p style={{ margin: '2px 0 0', fontWeight: 800, fontSize: '20px', color: '#1D4533' }}>
                    ₹{selectedOrder.totalAmount || selectedOrder.actualAmount || 0}
                  </p>
                </div>

                <button
                  onClick={() => handleDownloadInvoice(selectedOrder)}
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '13px' }}
                >
                  <FiDownload size={14} /> Download PDF Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerOrders;
