import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/admin/AdminDashboardLayout';
import adminService from '../../services/adminService';
import {
  FiSearch, FiFilter, FiTrash2, FiEdit2, FiEye,
  FiX, FiAlertCircle, FiDownload, FiRefreshCw, FiCheckCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/admin.css';

const ORDER_STATUSES = [
  'Order Placed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [inspectOrder, setInspectOrder] = useState(null);
  const [updateStatusOrder, setUpdateStatusOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllOrders();
      const list = Array.isArray(data) ? data : (data?.data || []);
      setOrders(list);
      setFilteredOrders(list);
    } catch (err) {
      toast.error('Failed to load master orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;
    if (selectedStatus !== 'All') {
      result = result.filter((o) => o.status === selectedStatus);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          String(o._id).toLowerCase().includes(q) ||
          o.user?.fullName?.toLowerCase().includes(q) ||
          o.deliveryAddress?.fullName?.toLowerCase().includes(q) ||
          o.paymentMethod?.toLowerCase().includes(q)
      );
    }
    setFilteredOrders(result);
  }, [search, selectedStatus, orders]);

  // Status update
  const handleStatusUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!updateStatusOrder || !newStatus) return;
    setSubmitting(true);
    try {
      await adminService.updateOrderStatus(updateStatusOrder._id, newStatus);
      toast.success(`Order #${String(updateStatusOrder._id).slice(-8)} updated to ${newStatus}`);
      setUpdateStatusOrder(null);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update order status');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Order
  const handleDeleteOrderConfirm = async () => {
    if (!deleteOrderId) return;
    setSubmitting(true);
    try {
      await adminService.deleteOrder(deleteOrderId);
      toast.success('Order record deleted from registry.');
      setDeleteOrderId(null);
      fetchOrders();
    } catch {
      toast.error('Failed to delete order record');
    } finally {
      setSubmitting(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return toast.error('No orders to export');
    const headers = ['Order ID', 'Customer', 'Items Count', 'Total Amount', 'Payment Mode', 'Status', 'Date'];
    const rows = filteredOrders.map((o) => [
      o._id,
      `"${o.user?.fullName || o.deliveryAddress?.fullName || 'Customer'}"`,
      o.Products?.length || 1,
      o.totalAmount || o.actualAmount || 0,
      o.paymentMethod || 'COD',
      o.status || 'Order Placed',
      o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `farmiax_master_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Master orders exported to CSV! 📊');
  };

  return (
    <AdminDashboardLayout activeNav="orders">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF' }}>
            Master Orders Management
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
            Monitor and control consumer transactions across all regional farm harvest shipments.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleExportCSV}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(74, 222, 128, 0.4)',
              color: '#4ADE80',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <FiDownload /> Export CSV
          </button>
          <button
            onClick={fetchOrders}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <FiRefreshCw className={loading ? 'spin-icon' : ''} /> Reload Orders
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="admin-glass-box" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
            <input
              type="text"
              placeholder="Search by Order ID, customer name, payment mode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: '#FFF',
                fontSize: '13.5px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Status:</span>
          {['All', ...ORDER_STATUSES].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedStatus === status ? '#4ADE80' : 'rgba(255,255,255,0.15)',
                background: selectedStatus === status ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                color: selectedStatus === status ? '#4ADE80' : 'rgba(255,255,255,0.8)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-glass-box" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            Loading master orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            No orders found matching the filter.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Customer Info</th>
                  <th>Order Items</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Lifecycle Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const statusClass = (order.status || 'placed').toLowerCase().replace(/\s+/g, '-');
                  return (
                    <tr key={order._id}>
                      <td style={{ fontWeight: 800, color: '#4ADE80' }}>#{String(order._id).slice(-8)}</td>
                      <td>
                        <strong style={{ fontSize: '13.5px', color: '#FFFFFF', display: 'block' }}>
                          {order.user?.fullName || order.deliveryAddress?.fullName || 'Customer'}
                        </strong>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                          {order.user?.phone || order.deliveryAddress?.phone || order.user?.email || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px' }}>
                          {order.Products?.length || 1} produce line items
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>
                          ₹{(Number(order.totalAmount) || Number(order.actualAmount) || 0).toLocaleString('en-IN')}
                        </strong>
                      </td>
                      <td>
                        <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', fontSize: '11px', fontWeight: 800 }}>
                          {order.paymentMethod || 'COD'}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-status-badge status-${statusClass}`}>
                          {order.status || 'Order Placed'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setInspectOrder(order)} className="admin-action-btn admin-btn-view" title="Inspect Full Order Record">
                            <FiEye size={13} />
                          </button>
                          <button
                            onClick={() => {
                              setUpdateStatusOrder(order);
                              setNewStatus(order.status || 'Order Placed');
                            }}
                            className="admin-action-btn admin-btn-view"
                            style={{ borderColor: 'rgba(59, 130, 246, 0.4)', color: '#60A5FA' }}
                            title="Update Status"
                          >
                            <FiEdit2 size={13} />
                          </button>
                          <button onClick={() => setDeleteOrderId(order._id)} className="admin-action-btn admin-btn-delete" title="Delete Order Record">
                            <FiTrash2 size={13} />
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

      {/* Inspect Order Modal */}
      {inspectOrder && (
        <div className="admin-modal-backdrop" onClick={() => setInspectOrder(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFF' }}>
                  Order #{String(inspectOrder._id).slice(-8)}
                </h3>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  Placed on {inspectOrder.createdAt ? new Date(inspectOrder.createdAt).toLocaleString() : 'Recent'}
                </span>
              </div>
              <button onClick={() => setInspectOrder(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>

            {/* Buyer & Delivery Info */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', marginBottom: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div><strong>Buyer Name:</strong> {inspectOrder.user?.fullName || inspectOrder.deliveryAddress?.fullName || 'Customer'}</div>
              <div><strong>Contact Phone:</strong> {inspectOrder.user?.phone || inspectOrder.deliveryAddress?.phone || 'N/A'}</div>
              <div><strong>Email:</strong> {inspectOrder.user?.email || 'N/A'}</div>
              <div><strong>Payment Mode:</strong> {inspectOrder.paymentMethod || 'COD'}</div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Shipping Address:</strong> {inspectOrder.deliveryAddress?.street ? `${inspectOrder.deliveryAddress.street}, ${inspectOrder.deliveryAddress.city}, ${inspectOrder.deliveryAddress.state} - ${inspectOrder.deliveryAddress.pincode}` : inspectOrder.user?.address || 'Standard Doorstep Delivery'}
              </div>
            </div>

            {/* Products List */}
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#4ADE80', fontWeight: 800 }}>Items Breakdown</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {inspectOrder.Products?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '13.5px', color: '#FFF' }}>{item.product?.name || `Product Item #${idx + 1}`}</strong>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', display: 'block' }}>Qty: {item.quantity} × ₹{item.price}</span>
                  </div>
                  <strong style={{ color: '#4ADE80', fontSize: '14px' }}>₹{(item.quantity * item.price).toLocaleString('en-IN')}</strong>
                </div>
              ))}
            </div>

            {/* Total Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Current Status</span>
                <span style={{ display: 'block', fontWeight: 800, color: '#FACC15' }}>{inspectOrder.status || 'Order Placed'}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Grand Total</span>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#4ADE80' }}>
                  ₹{(Number(inspectOrder.totalAmount) || Number(inspectOrder.actualAmount) || 0).toLocaleString('en-IN')}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {updateStatusOrder && (
        <div className="admin-modal-backdrop" onClick={() => setUpdateStatusOrder(null)}>
          <div className="admin-modal-content" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFF' }}>Update Order Lifecycle</h3>
              <button onClick={() => setUpdateStatusOrder(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>

            <form onSubmit={handleStatusUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Select New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#041B10',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#FFF',
                    fontSize: '14px',
                    fontWeight: 700,
                  }}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setUpdateStatusOrder(null)} style={{ padding: '10px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={{ padding: '10px 20px', borderRadius: '8px', background: '#3B82F6', border: 'none', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>
                  {submitting ? 'Updating...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Order Modal */}
      {deleteOrderId && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteOrderId(null)}>
          <div className="admin-modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                <FiAlertCircle size={22} />
              </div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#FFF' }}>Delete Order Record?</h3>
            </div>
            <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, margin: '0 0 20px' }}>
              This will remove the transaction record from the platform registry. This action cannot be reversed.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setDeleteOrderId(null)} style={{ padding: '8px 14px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="button" disabled={submitting} onClick={handleDeleteOrderConfirm} style={{ padding: '8px 18px', borderRadius: '8px', background: '#EF4444', border: 'none', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>
                {submitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminOrders;
