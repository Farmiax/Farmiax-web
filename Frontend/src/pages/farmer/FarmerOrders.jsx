import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';
import '../../styles/farmer-dashboard.css';
import '../../styles/farmer-orders.css';

const STATUS_FLOW = [
  'Order Placed', 'Confirmed', 'Processing', 'Packed', 'Ready for Pickup', 'Out for Delivery', 'Delivered'
];

const FarmerOrders = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [estimatedDate, setEstimatedDate] = useState('');

  const [orders, setOrders] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
      case 'Confirmed':
      case 'Processing':
      case 'Packed':
      case 'Ready for Pickup': return 'status-pending';
      case 'Out for Delivery': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      case 'Cancelled': 
      case 'Return Requested':
      case 'Return Approved':
      case 'Refunded': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const handleUpdateStatus = () => {
    const currentIndex = STATUS_FLOW.indexOf(selectedOrder.status);
    if (currentIndex === -1 || currentIndex >= STATUS_FLOW.length - 1) {
       toast.error("Cannot update status further.");
       return;
    }
    const nextStatus = STATUS_FLOW[currentIndex + 1];
    
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
         const newTimeline = order.timeline.map(step => {
            if (step.status === nextStatus) {
               return { ...step, completed: true, time: new Date().toLocaleString() };
            }
            return step;
         });
         return { ...order, status: nextStatus, timeline: newTimeline };
      }
      return order;
    });

    setOrders(updatedOrders);
    setSelectedOrder(updatedOrders.find(o => o.id === selectedOrder.id));
    setShowStatusModal(false);
    setStatusNote('');
    setEstimatedDate('');
    toast.success(`Order status updated to ${nextStatus}`);
  };

  const getNextStatus = () => {
     if(!selectedOrder) return '';
     const currentIndex = STATUS_FLOW.indexOf(selectedOrder.status);
     if (currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1) {
         return STATUS_FLOW[currentIndex + 1];
     }
     return 'None';
  };

  const generateInvoice = () => {
    if (!selectedOrder) return;
    try {
      const doc = new jsPDF();
      const order = selectedOrder;

      // Header
      doc.setFontSize(22);
      doc.setTextColor(40, 167, 69); // Farmiax green
      doc.text('Farmiax', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Pure. Natural. Trusted.', 14, 26);

      // Invoice Title
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text('INVOICE', 160, 20);
      
      // Invoice details
      doc.setFontSize(10);
      doc.text(`Invoice Number: INV-${order.id.replace('FRM-', '')}`, 140, 30);
      doc.text(`Order ID: ${order.id}`, 140, 36);
      doc.text(`Date: ${order.date.split(',')[0]}`, 140, 42);
      doc.text(`Payment Status: ${order.paymentStatus}`, 140, 48);

      // Grid layout for addresses
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Billed To:', 14, 45);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(order.shippingAddress.name, 14, 52);
      doc.text(order.shippingAddress.phone, 14, 57);
      doc.text(order.shippingAddress.email, 14, 62);
      
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Delivery Address:', 14, 72);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(order.shippingAddress.farm, 14, 79);
      doc.text(order.shippingAddress.address, 14, 84);
      doc.text(order.shippingAddress.city, 14, 89);

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Farmer Details:', 110, 72);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(order.farmerDetails.name, 110, 79);
      doc.text(`ID: ${order.farmerDetails.farmerId}`, 110, 84);
      doc.text(order.farmerDetails.address, 110, 89);
      doc.text(order.farmerDetails.contact, 110, 94);

      // Items Table
      const tableColumn = ["Product", "Qty", "Unit Price", "Total"];
      const tableRows = [];

      order.items.forEach(item => {
        const itemData = [
          item.name,
          `${item.qty} ${item.unit}`,
          `$${item.price.toFixed(2)}`,
          `$${item.total.toFixed(2)}`
        ];
        tableRows.push(itemData);
      });

      doc.autoTable({
        startY: 110,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [40, 167, 69] }
      });

      const finalY = doc.lastAutoTable.finalY || 110;

      // Totals
      doc.text(`Subtotal:`, 140, finalY + 10);
      doc.text(`$${order.subtotal.toFixed(2)}`, 180, finalY + 10, { align: 'right' });
      
      doc.text(`Discount:`, 140, finalY + 16);
      doc.text(`-$${order.discount.toFixed(2)}`, 180, finalY + 16, { align: 'right' });
      
      doc.text(`Shipping/Delivery:`, 140, finalY + 22);
      doc.text(`$${order.shipping.toFixed(2)}`, 180, finalY + 22, { align: 'right' });
      
      doc.text(`Tax/GST:`, 140, finalY + 28);
      doc.text(`$${order.tax.toFixed(2)}`, 180, finalY + 28, { align: 'right' });
      
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Grand Total:`, 140, finalY + 36);
      doc.text(`$${order.total.toFixed(2)}`, 180, finalY + 36, { align: 'right' });

      doc.save(`Invoice_${order.id}.pdf`);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed", error);
      toast.error("Failed to generate PDF");
    }
  };

  const renderOrderDetails = () => {
    const order = selectedOrder;
    const nextStatus = getNextStatus();

    return (
      <div className="order-details-view">
        <div className="order-details-header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button className="btn-back" onClick={() => setSelectedOrder(null)}>
            <i className="ri-arrow-left-line"></i> Back to Orders
          </button>
          
          <div className="order-actions-buttons-top" style={{ display: 'flex', gap: '10px' }}>
             <button className="btn-action" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }} onClick={() => toast.success("Opening chat with customer...")}>
               <i className="ri-chat-3-line"></i> Contact Customer
             </button>
             {order.status === 'Order Placed' && (
               <button className="btn-action" style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => toast.success("Order accepted!")}>
                 <i className="ri-check-line"></i> Accept Order
               </button>
             )}
             <button className="btn-action" style={{ padding: '8px 16px', background: '#2F4F4F', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => generateInvoice()}>
               <i className="ri-download-2-line"></i> Download Invoice
             </button>
          </div>
        </div>

        {/* 📦 Order Header */}
        <div className="details-card order-header-card" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                 <h2 style={{ margin: '0 0 5px 0' }}>Order #{order.id}</h2>
                 <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{order.date}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                 <span className={`order-status-badge ${getStatusColor(order.status)}`}>{order.status}</span>
                 <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}><strong>Payment:</strong> {order.paymentStatus} ({order.paymentMethod})</p>
              </div>
           </div>
        </div>

        <div className="order-details-grid mt-4" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px' }}>
          <div className="order-details-left">
            
            {/* 👤 Customer Information */}
            <div className="details-card" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0' }}>Customer Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                 <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>Name</p>
                    <p style={{ margin: 0 }}><strong>{order.shippingAddress.name}</strong></p>
                 </div>
                 <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>Phone</p>
                    <p style={{ margin: 0 }}>{order.shippingAddress.phone}</p>
                 </div>
                 <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>Email</p>
                    <p style={{ margin: 0 }}>{order.shippingAddress.email}</p>
                 </div>
              </div>
              <hr style={{ border: 0, borderTop: '1px solid #eee', margin: '20px 0' }} />
              <h4 style={{ margin: '0 0 12px 0' }}>Delivery Address</h4>
              <p style={{ margin: '0 0 4px 0' }}>{order.shippingAddress.farm}</p>
              <p style={{ margin: '0 0 4px 0' }}>{order.shippingAddress.address}</p>
              <p style={{ margin: 0 }}>{order.shippingAddress.city}</p>
            </div>

            {/* 🛒 Ordered Products */}
            <div className="details-card mt-4" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginTop: '24px' }}>
               <h3 style={{ margin: '0 0 16px 0' }}>Ordered Products</h3>
               <div className="ordered-products-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: idx < order.items.length - 1 ? '1px solid #eee' : 'none' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                          <div>
                             <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>{item.name}</p>
                             <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>SKU: {item.sku}</p>
                          </div>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>{item.qty} {item.unit} x ${item.price.toFixed(2)}</p>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>${item.total.toFixed(2)}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* 🚚 Order Timeline */}
            <div className="details-card mt-4" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                 <h3 style={{ margin: 0 }}>Order Timeline</h3>
                 {nextStatus !== 'None' && (
                   <button style={{ padding: '6px 12px', background: '#e9ecef', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }} onClick={() => setShowStatusModal(true)}>
                     Update Status
                   </button>
                 )}
              </div>
              
              <div className="timeline-container">
                 {(() => {
                   const placed = order.timeline.find(t => t.status === 'Order Placed');
                   const packed = order.timeline.find(t => t.status === 'Packed');
                   const outForDelivery = order.timeline.find(t => t.status === 'Out for Delivery');
                   const delivered = order.timeline.find(t => t.status === 'Delivered');

                   return (
                     <>
                       <div className={`timeline-step ${placed?.completed ? 'completed' : ''}`}>
                         <div className="timeline-icon"><i className="ri-check-line"></i></div>
                         <div className="timeline-text">
                           <strong>Order Placed</strong>
                           <span>{placed?.time}</span>
                         </div>
                       </div>
                       <div className="timeline-line"></div>
                       <div className={`timeline-step ${packed?.completed ? 'completed' : ''}`}>
                         <div className="timeline-icon"><i className="ri-box-3-line"></i></div>
                         <div className="timeline-text">
                           <strong>Packed</strong>
                           <span>{packed?.time}</span>
                         </div>
                       </div>
                       <div className="timeline-line"></div>
                       <div className={`timeline-step ${outForDelivery?.completed ? 'completed' : ''}`}>
                         <div className="timeline-icon"><i className="ri-truck-line"></i></div>
                         <div className="timeline-text">
                           <strong>Out for Delivery</strong>
                           <span>{outForDelivery?.time}</span>
                         </div>
                       </div>
                       <div className="timeline-line"></div>
                       <div className={`timeline-step ${delivered?.completed ? 'completed' : ''}`}>
                         <div className="timeline-icon"><i className="ri-check-double-line"></i></div>
                         <div className="timeline-text">
                           <strong>Delivered</strong>
                           <span>{delivered?.time}</span>
                         </div>
                       </div>
                     </>
                   );
                 })()}
              </div>
            </div>

          </div>

          <div className="order-details-right">
            {/* 💰 Payment Summary */}
            <div className="details-card" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0' }}>Payment Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#666' }}>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#666' }}>Discount:</span>
                  <span style={{ color: '#28a745' }}>-${order.discount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#666' }}>Delivery Charge:</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#666' }}>Tax/GST:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
              </div>
              <hr style={{ border: 0, borderTop: '1px solid #eee', margin: '16px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                <strong>Grand Total</strong>
                <strong>${order.total.toFixed(2)}</strong>
              </div>
            </div>

            {/* 🚚 Delivery Information */}
            {order.delivery && (
               <div className="details-card mt-4" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginTop: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0' }}>Delivery Information</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                     <span style={{ color: '#666' }}>Partner:</span>
                     <span>{order.delivery.partner}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                     <span style={{ color: '#666' }}>Tracking ID:</span>
                     <span style={{ color: '#007bff' }}>{order.delivery.trackingId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                     <span style={{ color: '#666' }}>Expected:</span>
                     <span>{order.delivery.expectedDelivery}</span>
                  </div>
               </div>
            )}

            {/* 🔄 Return / Refund */}
            {order.returnInfo && (
               <div className="details-card mt-4" style={{ background: '#fff5f5', padding: '20px', borderRadius: '8px', border: '1px solid #fed7d7', marginTop: '24px' }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#c53030' }}>Return Request</h3>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}><strong>Reason:</strong> {order.returnInfo.reason}</p>
                  <p style={{ margin: 0, fontSize: '14px' }}><strong>Status:</strong> {order.returnInfo.status}</p>
               </div>
            )}
          </div>
        </div>

        {/* Update Status Modal */}
        {showStatusModal && (
           <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', width: '400px', borderRadius: '8px', overflow: 'hidden' }}>
                 <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Update Order Status</h3>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px' }} onClick={() => setShowStatusModal(false)}><i className="ri-close-line"></i></button>
                 </div>
                 <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '16px' }}>
                       <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Current Status</label>
                       <input type="text" value={order.status} disabled style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #eee', background: '#f8f9fa' }} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                       <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>New Status</label>
                       <input type="text" value={nextStatus} disabled style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #28a745', background: '#f0fff4', color: '#28a745', fontWeight: 'bold' }} />
                       <small style={{ display: 'block', marginTop: '6px', color: '#666', fontSize: '12px' }}>The status will automatically progress to the next step in the workflow.</small>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                       <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Optional Note</label>
                       <textarea 
                          rows="3" 
                          placeholder="E.g., Packed securely, awaiting courier pickup..."
                          value={statusNote}
                          onChange={(e) => setStatusNote(e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
                       ></textarea>
                    </div>
                    {['Ready for Pickup', 'Out for Delivery'].includes(nextStatus) && (
                       <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Estimated Date (Optional)</label>
                          <input type="date" value={estimatedDate} onChange={(e) => setEstimatedDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                       </div>
                    )}
                 </div>
                 <div style={{ padding: '16px 20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#f8f9fa' }}>
                    <button style={{ padding: '8px 16px', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setShowStatusModal(false)}>Cancel</button>
                    <button style={{ padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={handleUpdateStatus}>Confirm Update</button>
                 </div>
              </div>
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="farmer-layout">
      {/* Sidebar */}
      <aside className="farmer-sidebar">
        <div className="farmer-sidebar-logo" style={{ padding: '12px 0', justifyContent: 'center' }}>
          <Logo size="xl" />
        </div>
        <nav className="farmer-nav">
          <Link to="/farmer/dashboard" className="farmer-nav-item">
            <i className="ri-home-5-line"></i> Dashboard
          </Link>
          <Link to="/farmer/orders" className="farmer-nav-item active">
            <i className="ri-file-list-3-line"></i> Orders
          </Link>
          <Link to="/farmer/products" className="farmer-nav-item">
            <i className="ri-landscape-line"></i> Products
          </Link>
          <Link to="/farmer/inventory" className="farmer-nav-item">
            <i className="ri-box-3-line"></i> Inventory
          </Link>
          <Link to="/farmer/customers" className="farmer-nav-item">
            <i className="ri-group-line"></i> Customers
          </Link>
          <Link to="/farmer/earnings" className="farmer-nav-item">
            <i className="ri-money-dollar-circle-line"></i> Earnings
          </Link>
          <Link to="/farmer/analytics" className="farmer-nav-item">
            <i className="ri-bar-chart-box-line"></i> Analytics
          </Link>
          <Link to="/farmer/payouts" className="farmer-nav-item">
            <i className="ri-bank-card-line"></i> Payouts
          </Link>
          <Link to="/farmer/reviews" className="farmer-nav-item">
            <i className="ri-star-line"></i> Reviews
          </Link>
          <Link to="/farmer/messages" className="farmer-nav-item">
            <i className="ri-message-3-line"></i> Messages
          </Link>
          <Link to="/farmer/profile" className="farmer-nav-item">
            <i className="ri-user-settings-line"></i> Farm Profile
          </Link>
          <Link to="/farmer/settings" className="farmer-nav-item">
            <i className="ri-settings-3-line"></i> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="farmer-main">
        {/* Header */}
        <header className="farmer-header">
          <div className="farmer-search">
            <i className="ri-search-line"></i>
            <input type="text" placeholder="Search orders, products, or insights..." />
          </div>
          <div className="farmer-header-right">
            <Link to="/farmer/notifications" className="header-notif-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ri-notification-3-line" style={{ fontSize: '20px', color: '#111' }}></i>
            </Link>
            <Link to="/farmer/profile" className="header-profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src="https://ui-avatars.com/api/?name=FA&background=FCE06D&color=000" alt="Farmer" />
              <span>Farmer</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="farmer-content" style={{ padding: '24px 32px', minHeight: 'calc(100vh - 72px)' }}>
          {selectedOrder ? (
            renderOrderDetails()
          ) : (
            <>
              <h1 className="orders-page-title">Orders</h1>

              <div className="orders-controls-bar">
                <div className="orders-tabs">
                  {['All', 'Pending', 'Delivered', 'Cancelled'].map(tab => (
                    <button
                      key={tab}
                      className={`order-tab ${activeTab === tab ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="orders-actions">
                  <div className="orders-search-box">
                    <input type="text" placeholder="Search orders..." />
                    <i className="ri-search-line"></i>
                  </div>
                </div>
              </div>

              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Name</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter((order) => {
                        if (activeTab === 'All') return true;
                        if (activeTab === 'Pending') {
                          return ['Order Placed', 'Confirmed', 'Processing', 'Packed', 'Ready for Pickup', 'Out for Delivery'].includes(order.status);
                        }
                        if (activeTab === 'Cancelled') {
                          return ['Cancelled', 'Return Requested', 'Return Approved', 'Refunded'].includes(order.status);
                        }
                        return order.status === activeTab;
                      })
                      .map((order, idx) => (
                      <tr key={idx} onClick={() => setSelectedOrder(order)} style={{cursor: 'pointer'}}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.date}</td>
                        <td>{order.amount}</td>
                        <td>
                          <span className={`order-status-badge ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default FarmerOrders;
