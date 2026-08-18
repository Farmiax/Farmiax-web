import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import {
  FiCheckCircle, FiPackage, FiTruck, FiMapPin, FiPhone,
  FiMessageSquare, FiDownload, FiHelpCircle, FiXCircle
} from 'react-icons/fi';
import avatarImg from '../../assets/images/rural-india.png';
import '../../styles/customer.css';

const TrackOrder = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await orderService.getUserOrders();
        const allOrders = Array.isArray(data) ? data : data.orders || [];
        const foundOrder = allOrders.find(o => (o._id === id || o.id === id));
        setOrder(foundOrder);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrderDetails();
    else setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <CustomerDashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading order details...
        </div>
      </CustomerDashboardLayout>
    );
  }

  if (!id) {
    return (
      <CustomerDashboardLayout>
        <div style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <FiTruck style={{ fontSize: '48px', color: 'var(--primary-green)', marginBottom: '20px' }} />
          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', color: '#F5E8C7' }}>Track Your Order</h2>
          <p style={{ color: '#F5E8C7', marginBottom: '32px', fontSize: '16px' }}>Enter your Order ID below to get real-time tracking updates on your package.</p>

          <form onSubmit={(e) => { e.preventDefault(); if (searchInput.trim()) navigate(`/customer/track-order/${searchInput.trim()}`); }} style={{ display: 'flex', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="e.g. FMX1721..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '15px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '12px 24px', background: 'var(--dark-green)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              Track
            </button>
          </form>

          <div style={{ marginTop: '32px' }}>
            <span style={{ color: '#F5E8C7', fontSize: '14px' }}>Or select an order from </span>
            <Link to="/customer/orders" style={{ color: 'var(--primary-green)', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>My Orders</Link>
          </div>
        </div>
      </CustomerDashboardLayout>
    );
  }

  if (!order) {
    return (
      <CustomerDashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Order not found.</p>
          <Link to="/customer/orders" className="btn-outline-dark text-xs py-2 px-4 inline-block mt-4">Back to Orders</Link>
        </div>
      </CustomerDashboardLayout>
    );
  }

  // Generate dynamic status steps based on current status
  const currentStatus = order.status || 'Order Placed';
  const isCancelled = currentStatus.toLowerCase() === 'cancelled';

  const allSteps = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

  let steps = [];
  if (isCancelled) {
    steps = [
      { label: 'Order Placed', status: 'done' },
      { label: 'Cancelled', status: 'current', error: true }
    ];
  } else {
    const currentIndex = allSteps.findIndex(s => s.toLowerCase() === currentStatus.toLowerCase());
    steps = allSteps.map((step, idx) => {
      let status = 'pending';
      if (idx < currentIndex) status = 'done';
      if (idx === currentIndex) status = 'current';
      return { label: step, time: '', status };
    });
  }

  const orderDate = new Date(order.createdAt || Date.now());
  const formattedDate = orderDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const estimatedDateObj = new Date(orderDate);
  estimatedDateObj.setDate(estimatedDateObj.getDate() + 5);
  const estDate = estimatedDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <CustomerDashboardLayout>
      <div className="container py-8 px-6">
        {/* Sub Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-slate-900 font-medium m-0">Track Your Order</p>
            <h1 className="text-2xl font-bold text-slate-900 m-0">
              Order <span className="text-emerald-900">#{order._id || order.id}</span> • <span className="text-sm text-slate-900 font-normal">Placed on {formattedDate}.</span>
            </h1>
          </div>
          {!isCancelled && (
            <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-full border border-emerald-300 w-fit">
              ESTIMATED ARRIVAL: {estDate}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Vertical Stepper Sidebar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
            <h3 className="text-sm font-bold tracking-wider text-slate-700 uppercase mb-6">TRACK ORDER</h3>
            <div className="flex flex-col gap-6 relative pl-2">
              <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-slate-200" />
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step.error
                        ? 'bg-red-500 text-white ring-4 ring-red-100'
                        : step.status === 'done'
                          ? 'bg-emerald-700 text-white'
                          : step.status === 'current'
                            ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                            : 'bg-slate-200 text-slate-500'
                      }`}
                  >
                    {step.error ? <FiXCircle size={16} /> : step.status === 'done' ? <FiCheckCircle size={16} /> : idx + 1}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold m-0 ${step.error ? 'text-red-600' : step.status === 'current' ? 'text-emerald-800' : 'text-slate-800'}`}>
                      {step.label}
                    </p>
                    {step.status === 'done' && <span className="text-[11px] text-emerald-600 font-medium">Done</span>}
                    {step.status === 'current' && <span className="text-[11px] text-emerald-600 font-bold">Current</span>}
                    {step.status === 'pending' && <span className="text-[11px] text-slate-400">Pending</span>}
                    {step.error && <span className="text-[11px] text-red-600 font-bold">Cancelled</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center & Right Body */}
          <div className="lg:col-span-3 flex flex-col gap-8">

            {/* Horizontal Stepper Banner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between overflow-x-auto">
              {steps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="text-center min-w-[80px]">
                    <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold ${step.error ? 'bg-red-500 text-white ring-4 ring-red-100' :
                        step.status === 'done' ? 'bg-emerald-800 text-white' :
                          step.status === 'current' ? 'bg-emerald-700 text-white ring-4 ring-emerald-100' :
                            'bg-slate-200 text-slate-400'
                      }`}>
                      {step.error ? <FiXCircle size={20} /> : step.status === 'done' ? <FiCheckCircle size={20} /> : <FiPackage size={20} />}
                    </div>
                    <p className={`text-xs font-semibold mt-2 mb-0 ${step.status === 'current' ? 'text-emerald-800' : step.error ? 'text-red-600' : ''}`}>{step.label}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-[2px] mx-2 ${step.status === 'done' ? 'bg-emerald-700' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Map & Delivery Info Grid */}
            {!isCancelled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Live Map Box */}
                <div className="md:col-span-2 bg-slate-100 rounded-2xl overflow-hidden shadow-sm relative min-h-[300px] border border-slate-200">
                  <div className="bg-white/90 backdrop-blur-md p-3 m-3 rounded-xl shadow-sm border border-slate-100 inline-block text-xs z-10 relative">
                    <span className="text-slate-400 uppercase font-bold tracking-wider">CURRENT LOCATION</span>
                    <p className="font-bold text-slate-800 m-0">Hub: Bengaluru North</p>
                    <span className="text-[11px] text-slate-400">Last updated: Just now</span>
                  </div>

                  {/* Simulated Map Illustration */}
                  <div className="absolute inset-0 bg-[#e5e9ec] flex items-center justify-center">
                    <div className="text-center p-6 bg-white/80 rounded-2xl max-w-sm">
                      <FiMapPin size={32} className="text-emerald-700 mx-auto mb-2" />
                      <p className="font-bold text-slate-800 text-sm m-0">Suresh K. • Delivery Hub</p>
                      <p className="text-xs text-slate-500 m-0">In transit towards your address</p>
                    </div>
                  </div>
                </div>

                {/* Right Info Cards */}
                <div className="flex flex-col gap-6">
                  {/* Delivery Partner */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-700 tracking-wider uppercase mb-3">DELIVERY PARTNER</p>
                    <div className="flex items-center gap-3 mb-4">
                      <img src={avatarImg} alt="Suresh Kumar" className="w-12 h-12 rounded-full object-cover bg-slate-100" />
                      <div>
                        <h4 className="text-sm font-bold m-0">Suresh Kumar</h4>
                        <p className="text-xs text-amber-500 m-0 font-medium">★ 4.9 <span className="text-slate-400">(1200+ deliveries)</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="w-full py-2 bg-emerald-950 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border-0 cursor-pointer">
                        <FiPhone size={14} /> Call Suresh
                      </button>
                      <button className="w-full py-2 bg-white text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border border-slate-300 cursor-pointer">
                        <FiMessageSquare size={14} /> Send Message
                      </button>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-700 tracking-wider uppercase mb-3">SHIPPING ADDRESS</p>
                    <h4 className="text-sm font-bold m-0 mb-1">{user?.fullName || 'Customer'}</h4>
                    <p className="text-xs text-slate-900 leading-relaxed m-0 mb-2">
                      {user?.address || '123, Green Street, Anna Nagar\nChennai - 600040, Tamil Nadu\nIndia'}
                    </p>
                    <p className="text-xs font-semibold text-slate-700 m-0">{user?.phone || '+91 98765 43210'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Order Items */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 tracking-wider uppercase mb-4">ORDER ITEMS</h3>
              <div className="flex flex-col gap-4 pb-4 border-b border-slate-100">
                {order.Products && order.Products.length > 0 ? (
                  order.Products.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                          {item.product?.image ? (
                            <img src={`http://localhost:5000/${item.product.image}`} alt={item.product?.name || 'Product'} className="w-full h-full object-cover" />
                          ) : (
                            <FiPackage className="text-slate-400" size={20} />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold m-0">{item.product?.name || 'Unknown Product'}</h4>
                          <p className="text-xs text-slate-400 m-0">Price: ₹{item.price}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold m-0">₹{(item.price || 0) * (item.quantity || 1)}</p>
                        <p className="text-xs text-slate-400 m-0">Qty: {item.quantity || 1}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">No items detailed in this order.</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <button className="btn-outline-dark text-xs py-2 px-4 flex items-center gap-2 rounded-lg">
                    <FiDownload /> Download Invoice
                  </button>
                  <button className="btn-outline-dark text-xs py-2 px-4 flex items-center gap-2 rounded-lg">
                    <FiHelpCircle /> Get Help
                  </button>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">TOTAL AMOUNT PAID</span>
                  <span className="text-xl font-extrabold text-slate-800">₹{order.totalAmount || order.actualAmount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
};

export default TrackOrder;
