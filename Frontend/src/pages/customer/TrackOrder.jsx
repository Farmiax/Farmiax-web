import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import { getImageUrl } from '../../utils/helpers';
import {
  FiCheckCircle, FiPackage, FiTruck, FiMapPin, FiPhone,
  FiMessageSquare, FiDownload, FiHelpCircle, FiXCircle, FiArrowLeft,
  FiX, FiClock, FiShield, FiCheck, FiNavigation, FiCalendar, FiUser,
  FiRadio, FiRefreshCw, FiActivity, FiCompass, FiMaximize2
} from 'react-icons/fi';
import avatarImg from '../../assets/images/rural-india.png';
import catGhee from '../../assets/images/cat-oil-ghee.png';
import catGrains from '../../assets/images/cat-grains.png';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';
import '../../styles/customer.css';

const TrackOrder = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const navigate = useNavigate();

  // Realtime GPS telemetry state
  const [liveSpeed, setLiveSpeed] = useState(38);
  const [liveTemp, setLiveTemp] = useState(18.2);
  const [liveDist, setLiveDist] = useState(2.4);
  const [liveEtaMins, setLiveEtaMins] = useState(8);
  const [livePing, setLivePing] = useState(42);
  const [gpsProgress, setGpsProgress] = useState(68);
  const [locationLabel, setLocationLabel] = useState('Approaching final delivery mile (Speed: 38 km/h)');
  const [hubStatus, setHubStatus] = useState('Vehicle in Local Distribution Hub');
  const [isRefreshingGps, setIsRefreshingGps] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const cleanId = id?.trim();
        const data = await orderService.getUserOrders();
        const allOrders = Array.isArray(data) ? data : (data?.data || data?.orders || []);
        const foundOrder = allOrders.find(
          (o) => o._id === cleanId || o.id === cleanId || String(o._id).slice(-8) === cleanId
        );

        if (foundOrder) {
          setOrder(foundOrder);
        } else if (allOrders.length > 0) {
          setOrder(allOrders[0]);
        } else {
          setOrder(null);
        }
      } catch (error) {
        console.warn('Order details fetch notice:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrderDetails();
    else setLoading(false);
  }, [id]);

  // Realtime GPS telemetry simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuating realistic speeds (34 - 44 km/h)
      const nextSpeed = Math.floor(34 + Math.random() * 10);
      setLiveSpeed(nextSpeed);

      // Temperature fluctuation (17.8 - 18.4°C)
      const nextTemp = +(17.8 + Math.random() * 0.6).toFixed(1);
      setLiveTemp(nextTemp);

      // Ping time (32 - 58 ms)
      setLivePing(Math.floor(32 + Math.random() * 26));

      // Dynamic distance and ETA
      setGpsProgress((prev) => {
        const nextProg = prev >= 95 ? 65 : +(prev + 0.8).toFixed(1);
        const remDist = +((100 - nextProg) * 0.08).toFixed(1);
        setLiveDist(remDist);
        setLiveEtaMins(Math.max(2, Math.round(remDist * 3.2)));
        
        if (nextProg > 85) {
          setLocationLabel(`Near 100 Ft Road, 2nd Main (Speed: ${nextSpeed} km/h)`);
          setHubStatus('In Local Transit - Final Corridor');
        } else {
          setLocationLabel(`Approaching final delivery mile (Speed: ${nextSpeed} km/h)`);
          setHubStatus('Vehicle in Local Distribution Hub');
        }
        return nextProg;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const handleRefreshGps = () => {
    setIsRefreshingGps(true);
    setTimeout(() => {
      setIsRefreshingGps(false);
      setLivePing(28);
      toast.success('GPS Satellite lock re-synchronized! Ping: 28ms 🛰️');
    }, 600);
  };

  const handleDownloadInvoice = () => {
    if (!order) return;
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(11, 93, 56);
      doc.text('FARMIAX — Official Order Receipt', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(70);
      doc.text(`Tracking ID: #${order._id || order.id || id}`, 14, 28);
      doc.text(`Order Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}`, 14, 34);
      doc.text(`Customer: ${user?.fullName || 'Priya Raman'}`, 14, 40);

      const items = (order.Products || []).map((item, idx) => [
        idx + 1,
        item.product?.name || 'Organic Harvest Goods',
        item.quantity || 1,
        `₹${item.price || 0}`,
        `₹${(item.price || 0) * (item.quantity || 1)}`,
      ]);

      doc.autoTable({
        startY: 48,
        head: [['#', 'Produce Item', 'Qty', 'Unit Price', 'Total']],
        body: items.length > 0 ? items : [[1, 'Organic Farm Goods', 1, `₹${order.totalAmount || 0}`, `₹${order.totalAmount || 0}`]],
        theme: 'striped',
        headStyles: { fillColor: [11, 93, 56] },
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.setTextColor(11, 93, 56);
      doc.text(`Total Amount Paid: ₹${order.totalAmount || order.actualAmount || 0}`, 130, finalY);

      doc.save(`Invoice_${String(order._id || id).slice(-8)}.pdf`);
      toast.success('Invoice PDF downloaded! 📄');
    } catch (err) {
      console.error(err);
      toast.error('Failed to download invoice');
    }
  };

  if (loading) {
    return (
      <CustomerDashboardLayout>
        <div style={{ padding: '80px 20px', textAlign: 'center', color: '#475569' }}>
          <div className="loader-spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 600 }}>Connecting to Farmiax logistics server...</p>
        </div>
      </CustomerDashboardLayout>
    );
  }

  if (!id) {
    return (
      <CustomerDashboardLayout>
        <div style={{ padding: '60px 24px', maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <FiTruck size={32} />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 10px', color: '#062414' }}>Track Your Harvest Order</h2>
            <p style={{ color: '#475569', marginBottom: '28px', fontSize: '14px', lineHeight: '1.5' }}>
              Enter your Order ID below to view live dispatch progress and delivery milestones.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchInput.trim()) navigate(`/customer/track-order/${searchInput.trim()}`);
              }}
              style={{ display: 'flex', gap: '10px', maxWidth: '460px', margin: '0 auto 24px' }}
            >
              <input
                type="text"
                placeholder="e.g. FMX9821092..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '14px', outline: 'none', color: '#1F2937' }}
              />
              <button type="submit" className="btn-dark-green" style={{ padding: '12px 24px', fontSize: '14px' }}>
                Track Order
              </button>
            </form>

            <div>
              <span style={{ color: '#475569', fontSize: '13.5px' }}>Or choose from your </span>
              <Link to="/customer/orders" style={{ color: '#0B5D38', fontWeight: 700, fontSize: '13.5px', textDecoration: 'none' }}>
                Order History & Past Invoices
              </Link>
            </div>
          </div>
        </div>
      </CustomerDashboardLayout>
    );
  }

  // Calculate order milestone steps
  const currentStatus = order?.status || 'Out for Delivery';
  const isDelivered = currentStatus.toLowerCase() === 'delivered';

  const allMilestones = [
    { label: 'Order Placed', time: 'Day 1 • 09:30 AM', desc: 'Direct order confirmed with partner farmers' },
    { label: 'Harvest Packed', time: 'Day 1 • 04:15 PM', desc: 'Fresh produce packed in eco-insulated box' },
    { label: 'In Transit', time: 'Day 2 • 07:00 AM', desc: 'Dispatched via cold-chain regional hub' },
    { label: 'Out for Delivery', time: isDelivered ? 'Day 3 • 08:30 AM' : 'Today • 08:30 AM', desc: 'Assigned to delivery executive' },
    { label: 'Delivered', time: isDelivered ? 'Day 3 • 11:45 AM' : `Estimated Today in ~${liveEtaMins} mins`, desc: isDelivered ? 'Safely handed over with contactless OTP' : 'Approaching final delivery doorstep' },
  ];

  let activeIndex = 3; // Out for Delivery
  if (currentStatus.toLowerCase().includes('placed')) activeIndex = 0;
  else if (currentStatus.toLowerCase().includes('pack') || currentStatus.toLowerCase().includes('process')) activeIndex = 1;
  else if (currentStatus.toLowerCase().includes('ship') || currentStatus.toLowerCase().includes('transit')) activeIndex = 2;
  else if (currentStatus.toLowerCase().includes('out')) activeIndex = 3;
  else if (isDelivered) activeIndex = 4;

  const orderDate = new Date(order?.createdAt || Date.now());
  const formattedDate = orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Calculate vehicle coordinates on SVG route
  const vanX = 60 + (gpsProgress / 100) * 440;
  const vanY = 100 - Math.sin((gpsProgress / 100) * Math.PI) * 35;

  return (
    <CustomerDashboardLayout>
      <div className="track-order-page-wrapper" style={{ padding: '28px 36px', maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Back Link */}
        <div style={{ marginBottom: '16px' }}>
          <Link
            to="/customer/orders"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', color: '#0B5D38', textDecoration: 'none', fontWeight: 700 }}
          >
            <FiArrowLeft size={16} /> Back to My Orders
          </Link>
        </div>

        {/* 1. TOP HEADER BANNER CARD (Frosted Blurry White Glass Look) */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            borderTop: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            padding: '28px 32px',
            marginBottom: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: isDelivered ? '#DCFCE7' : '#DCFCE7',
                  color: '#0B5D38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                }}
              >
                <FiTruck size={28} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#062414', letterSpacing: '-0.3px' }}>
                    Order #{String(order?._id || id).slice(-10)}
                  </h1>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: isDelivered ? '#DCFCE7' : '#FEF3C7',
                      color: isDelivered ? '#15803D' : '#92400E',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isDelivered ? '#15803D' : '#D97706', display: 'inline-block' }} />
                    {currentStatus}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#475569' }}>
                  Ordered on <strong>{formattedDate}</strong> • {order?.Products?.length || 2} Items • Total Paid: <strong>₹{order?.totalAmount || order?.actualAmount || 1190}</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleDownloadInvoice}
                className="btn-dark-green"
                style={{ padding: '10px 18px', fontSize: '13px' }}
              >
                <FiDownload size={15} /> Download Invoice PDF
              </button>

              <button
                onClick={() => setShowHelpModal(true)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid #CBD5E1',
                  color: '#062414',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FiHelpCircle size={15} /> Help & Support
              </button>
            </div>
          </div>
        </div>

        {/* 2. MAIN 2-COLUMN STRUCTURE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '24px', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: TIMELINE, DESTINATION & DRIVER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Timeline Stepper Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderTop: '1px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 800, color: '#062414', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiClock style={{ color: '#0B5D38' }} /> Order Delivery Timeline
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                {/* Vertical connecting line */}
                <div style={{ position: 'absolute', left: '15px', top: '12px', bottom: '12px', width: '2px', background: '#E2E8F0', zIndex: 1 }} />

                {allMilestones.map((milestone, idx) => {
                  const isDone = idx <= activeIndex;
                  const isCurrent = idx === activeIndex;

                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative', zIndex: 2 }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isDone ? '#0B5D38' : '#FFFFFF',
                          color: isDone ? '#FFFFFF' : '#94A3B8',
                          border: isDone ? '2px solid #0B5D38' : '2px solid #CBD5E1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: 800,
                          flexShrink: 0,
                          boxShadow: isCurrent ? '0 0 0 4px rgba(11, 93, 56, 0.2)' : 'none',
                        }}
                      >
                        {isDone ? <FiCheck size={16} /> : idx + 1}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: isDone ? 800 : 600, color: isDone ? '#062414' : '#64748B' }}>
                            {milestone.label}
                          </h4>
                          <span style={{ fontSize: '11.5px', color: isDone ? '#0B5D38' : '#94A3B8', fontWeight: 700 }}>
                            {milestone.time}
                          </span>
                        </div>
                        <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#475569' }}>
                          {milestone.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Destination Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderTop: '1px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 800, color: '#062414', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiMapPin style={{ color: '#0B5D38' }} /> Shipping Destination
              </h3>

              <div style={{ background: 'rgba(255, 255, 255, 0.7)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800, color: '#062414' }}>
                  {user?.fullName || 'Priya Raman'}
                </h4>
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                  {user?.address || '42, 3rd Cross, Indiranagar'}<br />
                  {user?.City || 'Bengaluru'}, {user?.State || 'Karnataka'} - {user?.PinCode || '560038'}
                </p>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0B5D38' }}>
                  📞 {user?.phone || '+91 98451 23456'}
                </p>
              </div>
            </div>

            {/* Delivery Executive Partner Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderTop: '1px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 800, color: '#062414', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiUser style={{ color: '#0B5D38' }} /> Farm Logistics Partner
              </h3>

              <div style={{ background: 'rgba(255, 255, 255, 0.7)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(0, 0, 0, 0.08)', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <img
                    src={avatarImg}
                    alt="Delivery Driver"
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0B5D38' }}
                  />
                  <div>
                    <h4 style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: 800, color: '#062414' }}>
                      {order?.deliveryPartner?.name || 'Suresh Kumar'}
                    </h4>
                    <span style={{ fontSize: '12px', color: '#D97706', fontWeight: 700 }}>
                      ★ {order?.deliveryPartner?.rating || 4.9} ({order?.deliveryPartner?.deliveries || '1,400+'} deliveries)
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>🚐 Vehicle: <strong>{order?.deliveryPartner?.vehicle || 'Eco Electric Delivery Van'}</strong></span>
                  <span>❄️ Climate: <strong>{liveTemp}°C (Optimal Freshness Pack)</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={`tel:${order?.deliveryPartner?.phone || '+919845177234'}`}
                  className="btn-dark-green"
                  style={{ flex: 1, padding: '10px', fontSize: '12.5px', justifyContent: 'center', textDecoration: 'none' }}
                >
                  <FiPhone /> Call Driver
                </a>
                <button
                  onClick={() => toast.success('Instructions noted! Suresh will contact prior to arrival.')}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#062414', fontWeight: 700, fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <FiMessageSquare /> Send Note
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: REALTIME GPS DISPATCH HUB & PRODUCT BREAKDOWN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* REALTIME GPS LIVE COLD-CHAIN DISPATCH ROUTE CARD */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderTop: '1px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Header Title & Live GPS Beacon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#DCFCE7', color: '#0B5D38', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiRadio size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#062414', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Live Cold-Chain Dispatch Route
                    </h3>
                    <span style={{ fontSize: '12px', color: '#475569' }}>
                      Realtime telemetry active • 5G IoT GPS
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 800,
                      padding: '5px 12px',
                      borderRadius: '999px',
                      background: '#DCFCE7',
                      color: '#15803D',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(22, 101, 52, 0.12)',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', display: 'inline-block', boxShadow: '0 0 8px #16A34A' }} />
                    ● GPS SATELLITE SYNC
                  </span>

                  <button
                    onClick={handleRefreshGps}
                    title="Resync GPS ping"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '6px 8px',
                      color: '#062414',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FiRefreshCw size={14} className={isRefreshingGps ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>

              {/* REALTIME SIMULATED LIVE MAP DISPLAY WITH MOVING VAN ROUTE */}
              <div
                style={{
                  height: '240px',
                  borderRadius: '16px',
                  background: 'linear-gradient(145deg, #0A1E14 0%, #0F3322 50%, #082115 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                {/* SVG Animated Route & Nodes */}
                <svg
                  viewBox="0 0 560 160"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                  }}
                >
                  {/* Background grid lines */}
                  <defs>
                    <pattern id="gpsGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                      <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                    </pattern>
                    <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#15803D" />
                      <stop offset="60%" stopColor="#86EFAC" />
                      <stop offset="100%" stopColor="#4ADE80" />
                    </linearGradient>
                  </defs>

                  <rect width="100%" height="100%" fill="url(#gpsGrid)" />

                  {/* Route Pathway curves */}
                  <path
                    d="M 60 100 Q 180 30, 300 70 T 500 90"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.18)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 60 100 Q 180 30, 300 70 T 500 90"
                    fill="none"
                    stroke="url(#routeGrad)"
                    strokeWidth="4"
                    strokeDasharray="6,4"
                    strokeLinecap="round"
                  />

                  {/* Origin: Regional Farm Cold Hub */}
                  <circle cx="60" cy="100" r="10" fill="#0B5D38" stroke="#86EFAC" strokeWidth="2" />
                  <circle cx="60" cy="100" r="4" fill="#FFFFFF" />
                  <text x="35" y="126" fill="#86EFAC" fontSize="10" fontWeight="bold">Depot Hub</text>

                  {/* Midpoint Checkpoint */}
                  <circle cx="300" cy="70" r="7" fill="#15803D" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="270" y="55" fill="#DCFCE7" fontSize="9">Mid-Transit</text>

                  {/* Destination: Customer Home */}
                  <circle cx="500" cy="90" r="12" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="500" cy="90" r="5" fill="#FFFFFF" />
                  <text x="475" y="120" fill="#FCA5A5" fontSize="10" fontWeight="bold">Your Home</text>

                  {/* Live Moving Van Marker */}
                  <g transform={`translate(${vanX}, ${vanY})`}>
                    {/* Pulsing Radar Ring */}
                    <circle cx="0" cy="0" r="18" fill="none" stroke="#86EFAC" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
                    {/* Van Base Pin */}
                    <circle cx="0" cy="0" r="12" fill="#0B5D38" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="0" cy="0" r="4" fill="#86EFAC" />
                  </g>
                </svg>

                {/* Top Overlay Badge Inside Map */}
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      background: 'rgba(6, 36, 20, 0.85)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(134, 239, 172, 0.3)',
                      borderRadius: '10px',
                      padding: '6px 12px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                    }}
                  >
                    <span style={{ color: '#86EFAC', fontWeight: 800, letterSpacing: '0.04em' }}>📍 {hubStatus}</span>
                  </div>

                  <div
                    style={{
                      background: 'rgba(6, 36, 20, 0.85)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(134, 239, 172, 0.3)',
                      borderRadius: '10px',
                      padding: '6px 12px',
                      color: '#86EFAC',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    Ping: {livePing}ms • 12.9716°N, 77.5946°E
                  </div>
                </div>

                {/* Bottom Overlay Location Banner */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 10,
                    background: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(12px)',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#DCFCE7', color: '#0B5D38', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiTruck size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#062414' }}>
                        {locationLabel}
                      </h4>
                      <span style={{ fontSize: '12px', color: '#475569' }}>
                        Produce safely preserved in temperature-sealed container
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803D', textTransform: 'uppercase' }}>
                      ETA to Door
                    </span>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0B5D38' }}>
                      ~{liveEtaMins} mins
                    </h4>
                  </div>
                </div>
              </div>

              {/* REALTIME TELEMETRY METRIC TILES */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  marginTop: '16px',
                }}
              >
                {/* Tile 1: Live Speed */}
                <div style={{ background: 'rgba(255, 255, 255, 0.75)', border: '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '12px', padding: '12px 14px' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                    ⚡ Current Speed
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#062414' }}>
                    {liveSpeed} <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>km/h</span>
                  </span>
                </div>

                {/* Tile 2: Cold-Chain Temp */}
                <div style={{ background: 'rgba(255, 255, 255, 0.75)', border: '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '12px', padding: '12px 14px' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                    ❄️ Temperature
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#0B5D38' }}>
                    {liveTemp}°C <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803D' }}>(Fresh)</span>
                  </span>
                </div>

                {/* Tile 3: Distance Remaining */}
                <div style={{ background: 'rgba(255, 255, 255, 0.75)', border: '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '12px', padding: '12px 14px' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                    📍 Distance Left
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#062414' }}>
                    {liveDist} <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>km</span>
                  </span>
                </div>

                {/* Tile 4: Sync Status */}
                <div style={{ background: 'rgba(255, 255, 255, 0.75)', border: '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '12px', padding: '12px 14px' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                    🛰️ Satellite Link
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#15803D' }}>
                    Active 5G
                  </span>
                </div>
              </div>
            </div>

            {/* Harvest Items in this Order Package */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderTop: '1px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#062414', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiPackage style={{ color: '#0B5D38' }} /> Harvest Package Contents ({order?.Products?.length || 2} Items)
                </h3>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {order?.Products && order.Products.length > 0 ? (
                  order.Products.map((item, index) => {
                    const itemImg = item.product?.image || catGrains;
                    const price = item.price || item.product?.price || 0;
                    const qty = item.quantity || 1;

                    return (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          borderRadius: '16px',
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <img
                            src={itemImg}
                            alt={item.product?.name || 'Produce Item'}
                            style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.08)' }}
                          />
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', background: '#DCFCE7', color: '#15803D', textTransform: 'uppercase' }}>
                              100% Direct Farmer
                            </span>
                            <h4 style={{ margin: '4px 0 2px', fontSize: '15px', fontWeight: 800, color: '#062414' }}>
                              {item.product?.name || 'Organic Harvest Goods'}
                            </h4>
                            <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#0B5D38', fontWeight: 700 }}>
                              👨‍🌾 {item.product?.farmer || 'Verified Local Partner'}
                            </p>
                            <span style={{ fontSize: '12px', color: '#475569' }}>
                              Unit: {item.product?.unit || 'Standard Pack'} • Qty: <strong>{qty}</strong>
                            </span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '16px', fontWeight: 800, color: '#0B5D38' }}>
                            ₹{price * qty}.00
                          </span>
                          <span style={{ display: 'block', fontSize: '12px', color: '#64748B' }}>
                            (₹{price} each)
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : null}
              </div>

              {/* Order Financial Breakdown Box */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                }}
              >
                <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 800, color: '#062414' }}>
                  Payment & Invoice Summary
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Produce Items Subtotal:</span>
                    <strong style={{ color: '#062414' }}>₹{order?.totalAmount || order?.actualAmount || 1190}.00</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cold-Chain Express Delivery:</span>
                    <strong style={{ color: '#15803D' }}>FREE (Unlocked)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Payment Channel:</span>
                    <strong style={{ color: '#062414' }}>{order?.paymentMethod || 'Razorpay UPI'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#062414' }}>Total Amount Paid:</span>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: '#0B5D38' }}>
                    ₹{order?.totalAmount || order?.actualAmount || 1190}.00
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Support Modal */}
        {showHelpModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ background: '#FFF', borderRadius: '20px', maxWidth: '480px', width: '100%', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#062414' }}>Order Support & Help</h3>
                <button onClick={() => setShowHelpModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <FiX size={20} />
                </button>
              </div>

              <p style={{ color: '#475569', fontSize: '13.5px', lineHeight: '1.5', marginBottom: '18px' }}>
                Need assistance with Order #{String(order?._id || id).slice(-8)}? Our 24/7 harvest logistics desk is available to assist you.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <a href="mailto:support@farmiax.com" style={{ textDecoration: 'none', color: '#062414', background: '#DCFCE7', padding: '12px 16px', borderRadius: '10px', border: '1px solid #86EFAC', fontWeight: 700, fontSize: '13px' }}>
                  ✉ Email: support@farmiax.com
                </a>
                <a href="tel:+919845123456" style={{ textDecoration: 'none', color: '#062414', background: '#DCFCE7', padding: '12px 16px', borderRadius: '10px', border: '1px solid #86EFAC', fontWeight: 700, fontSize: '13px' }}>
                  📞 Customer Helpline: +91 98451 23456
                </a>
              </div>

              <button
                onClick={() => {
                  setShowHelpModal(false);
                  toast.success('Support callback scheduled! Our coordinator will contact you shortly.');
                }}
                className="btn-dark-green"
                style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
              >
                Request Immediate Callback
              </button>
            </div>
          </div>
        )}

      </div>
    </CustomerDashboardLayout>
  );
};

export default TrackOrder;
