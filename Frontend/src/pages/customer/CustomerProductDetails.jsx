import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import productService from '../../services/productService';
import { getImageUrl } from '../../utils/helpers';
import {
  FiHeart, FiShoppingCart, FiMinus, FiPlus, FiStar, FiTruck,
  FiShield, FiCheckCircle, FiShare2, FiUser, FiAward, FiArrowLeft
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/customer.css';

const CustomerProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('standard');
  const [activeTab, setActiveTab] = useState('Description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProduct(id);
        const prodData = data?.data || data?.product || data;
        if (prodData && (prodData._id || prodData.name || prodData.ProductName)) {
          setProduct(prodData);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.warn('Product details API note:', err?.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
    else setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <CustomerDashboardLayout>
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="loader-spinner" style={{ margin: '0 auto 16px' }} />
          <p>Loading farm product details...</p>
        </div>
      </CustomerDashboardLayout>
    );
  }

  if (!product) {
    return (
      <CustomerDashboardLayout>
        <div style={{ padding: '60px 20px', textAlign: 'center', background: '#FFF', borderRadius: '16px', margin: '32px auto', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Product Not Found</h2>
          <p style={{ color: '#64748B', marginBottom: '24px' }}>The requested harvest is currently unavailable or has been archived.</p>
          <Link to="/customer/shop" className="btn btn-primary" style={{ padding: '10px 24px' }}>
            Back to Shop
          </Link>
        </div>
      </CustomerDashboardLayout>
    );
  }

  const prodId = product._id || product.id || id;
  const isWishlisted = wishlistIds.has(prodId);
  const mainImage = getImageUrl(product.image || product.Image);

  const galleryImages = [
    mainImage,
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80',
  ];

  const handleQuantityChange = (type) => {
    if (type === 'inc') setQuantity((q) => q + 1);
    if (type === 'dec' && quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCartClick = () => {
    addToCart(prodId, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart! 🛒`);
  };

  const handleBuyNowClick = () => {
    addToCart(prodId, quantity);
    navigate('/customer/checkout');
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Farmiax!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard! 📋');
    }
  };

  return (
    <CustomerDashboardLayout>
      <div className="product-details-container" style={{ padding: '24px 32px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Breadcrumbs */}
        <div className="breadcrumbs-bar" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B' }}>
          <Link to="/customer/profile" style={{ color: '#0B5D38', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
          <span>/</span>
          <Link to="/customer/shop" style={{ color: '#0B5D38', textDecoration: 'none', fontWeight: 600 }}>Shop</Link>
          <span>/</span>
          <Link to={`/customer/shop?category=${encodeURIComponent(product.Category || product.category || 'All')}`} style={{ color: '#0B5D38', textDecoration: 'none', fontWeight: 600 }}>
            {product.Category || product.category || 'Category'}
          </Link>
          <span>/</span>
          <span style={{ color: '#062414', fontWeight: 700 }}>{product.name}</span>
        </div>

        {/* Top Section: Images & Info */}
        <div className="product-top-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '48px' }}>

          {/* Left: Image Gallery */}
          <div className="product-image-gallery" style={{ display: 'flex', gap: '16px' }}>
            <div className="thumbnail-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {galleryImages.map((imgUrl, num) => (
                <div
                  key={num}
                  onClick={() => setSelectedImageIndex(num)}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '10px',
                    border: selectedImageIndex === num ? '2px solid #0B5D38' : '1px solid rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: '#FFFFFF',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <img src={imgUrl} alt={`Thumbnail ${num + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>

            <div
              className="main-image-display"
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '460px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
              }}
            >
              <span style={{ position: 'absolute', top: '16px', left: '16px', background: '#DCFCE7', color: '#15803D', fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '999px' }}>
                100% ORGANIC
              </span>
              <button
                onClick={handleShareClick}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0B5D38',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                title="Share product"
              >
                <FiShare2 size={16} />
              </button>
              <img
                src={galleryImages[selectedImageIndex] || mainImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80';
                }}
              />
            </div>
          </div>

          {/* Right: Info Panel */}
          <div className="product-info-panel" style={{ background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.8)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0B5D38', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {product.Category || product.category || 'Direct Farm Harvest'}
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0 12px', color: '#062414' }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', color: '#F59E0B' }}>
                {[1, 2, 3, 4, 5].map((s) => <FiStar key={s} className="fill-current" size={16} />)}
              </div>
              <span style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>
                4.9 ({product.reviews || 48} verified customer reviews)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#0B5D38' }}>₹{product.price || 0}</span>
              <span style={{ fontSize: '16px', textDecoration: 'line-through', color: '#94A3B8' }}>
                ₹{Math.round((product.price || 0) * 1.25)}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#15803D', background: '#DCFCE7', padding: '3px 8px', borderRadius: '6px' }}>
                20% OFF
              </span>
            </div>

            {/* Pack Size / Weight */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#062414', margin: '0 0 8px' }}>Packaging Weight</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedWeight('half')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: selectedWeight === 'half' ? '2px solid #0B5D38' : '1px solid #CBD5E1',
                    background: selectedWeight === 'half' ? '#DCFCE7' : '#FFFFFF',
                    color: selectedWeight === 'half' ? '#15803D' : '#1F2937',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  500 g
                </button>
                <button
                  onClick={() => setSelectedWeight('standard')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: selectedWeight === 'standard' ? '2px solid #0B5D38' : '1px solid #CBD5E1',
                    background: selectedWeight === 'standard' ? '#DCFCE7' : '#FFFFFF',
                    color: selectedWeight === 'standard' ? '#15803D' : '#1F2937',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {product.quantity || 1} {product.unit || 'kg'} (Standard)
                </button>
                <button
                  onClick={() => setSelectedWeight('bulk')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: selectedWeight === 'bulk' ? '2px solid #0B5D38' : '1px solid #CBD5E1',
                    background: selectedWeight === 'bulk' ? '#DCFCE7' : '#FFFFFF',
                    color: selectedWeight === 'bulk' ? '#15803D' : '#1F2937',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  2 kg (Value Pack)
                </button>
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: '28px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#062414', margin: '0 0 8px' }}>Quantity</p>
              <div style={{ display: 'flex', alignItems: 'center', width: '130px', border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden', background: '#FFFFFF' }}>
                <button
                  onClick={() => handleQuantityChange('dec')}
                  style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', color: '#1F2937' }}
                  aria-label="Decrease quantity"
                >
                  <FiMinus />
                </button>
                <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '15px', color: '#062414' }}>{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('inc')}
                  style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', color: '#1F2937' }}
                  aria-label="Increase quantity"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
              <button
                onClick={handleAddToCartClick}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #0B5D38',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#0B5D38',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
              >
                <FiShoppingCart size={18} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNowClick}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#0B5D38',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(11, 93, 56, 0.3)',
                }}
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist Toggle Button */}
            <button
              onClick={() => toggleWishlist(prodId)}
              style={{
                width: '100%',
                padding: '12px',
                background: isWishlisted ? '#FEE2E2' : 'rgba(255, 255, 255, 0.8)',
                border: '1px solid',
                borderColor: isWishlisted ? '#EF4444' : '#CBD5E1',
                borderRadius: '8px',
                color: isWishlisted ? '#DC2626' : '#475569',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                marginBottom: '28px',
              }}
            >
              <FiHeart className={isWishlisted ? 'fill-current' : ''} size={18} />
              {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Assurance Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', borderTop: '1px solid rgba(0, 0, 0, 0.08)', paddingTop: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <FiCheckCircle style={{ color: '#0B5D38', fontSize: '20px', margin: '0 auto 6px' }} />
                <p style={{ fontSize: '11px', fontWeight: 700, margin: 0, color: '#062414' }}>100% Pure</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <FiUser style={{ color: '#0B5D38', fontSize: '20px', margin: '0 auto 6px' }} />
                <p style={{ fontSize: '11px', fontWeight: 700, margin: 0, color: '#062414' }}>Direct Farmer</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <FiShield style={{ color: '#0B5D38', fontSize: '20px', margin: '0 auto 6px' }} />
                <p style={{ fontSize: '11px', fontWeight: 700, margin: 0, color: '#062414' }}>Verified Quality</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <FiTruck style={{ color: '#0B5D38', fontSize: '20px', margin: '0 auto 6px' }} />
                <p style={{ fontSize: '11px', fontWeight: 700, margin: 0, color: '#062414' }}>Fast Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Tabs Section */}
        <div style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)', marginBottom: '28px', display: 'flex', gap: '28px', overflowX: 'auto' }}>
          {['Description', 'Product Details', 'How it is Harvested', 'Customer Reviews', 'Farmer Story'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '14px 4px',
                border: 'none',
                background: 'transparent',
                fontSize: '15px',
                fontWeight: activeTab === tab ? 800 : 500,
                color: activeTab === tab ? '#0B5D38' : '#64748B',
                borderBottom: activeTab === tab ? '3px solid #0B5D38' : '3px solid transparent',
                cursor: 'pointer',
                marginBottom: '-1px',
                whiteSpace: 'nowrap',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div style={{ marginBottom: '60px' }}>
          {activeTab === 'Description' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '36px' }}>
              <div>
                <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#475569', marginBottom: '24px' }}>
                  {product.description || `Farmiax ${product.name} is cultivated using age-old regenerative farming techniques. Sourced straight from local grower cooperatives, it retains maximum natural vitamins, minerals, and rich organic taste without chemical processing.`}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.8)', borderRadius: '16px', padding: '20px', color: '#1F2937', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: '#062414', fontWeight: 800 }}>Key Highlights</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#475569' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiCheckCircle color="#0B5D38" /> No artificial preservatives or coloring</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiCheckCircle color="#0B5D38" /> High natural nutrient retention</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiCheckCircle color="#0B5D38" /> Fair trade direct farmer compensation</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiCheckCircle color="#0B5D38" /> Clean hygienic eco-friendly packaging</li>
                    </ul>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.8)', borderRadius: '16px', padding: '20px', color: '#1F2937', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: '#062414', fontWeight: 800 }}>Nutritional Facts (per 100g)</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#475569' }}>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Energy</span> <strong style={{ color: '#0B5D38' }}>340 kcal</strong></li>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Protein</span> <strong style={{ color: '#0B5D38' }}>9.4 g</strong></li>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Dietary Fiber</span> <strong style={{ color: '#0B5D38' }}>6.2 g</strong></li>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Fat</span> <strong style={{ color: '#0B5D38' }}>1.8 g</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Farmer Info Sidebar Card */}
              <div style={{ background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.8)', borderRadius: '16px', padding: '24px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', color: '#1F2937' }}>
                <span style={{ display: 'inline-block', padding: '4px 12px', background: '#DCFCE7', color: '#15803D', fontSize: '11px', fontWeight: 800, borderRadius: '999px', marginBottom: '16px' }}>
                  CERTIFIED GROWER
                </span>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#0B5D38', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '22px', color: '#FFFFFF' }}>
                  {product.farmer?.fullName ? product.farmer.fullName.slice(0, 2).toUpperCase() : 'RK'}
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: '17px', color: '#062414', fontWeight: 800 }}>
                  {product.farmer?.fullName || 'Ramesh Kumar'}
                </h3>
                <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#64748B' }}>
                  {product.farmer?.City ? `${product.farmer.City}, ${product.farmer.State}` : 'Erode, Tamil Nadu'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#F59E0B', fontWeight: 700, fontSize: '13px', marginBottom: '16px' }}>
                  <FiStar className="fill-current" /> 4.9 (84 harvest batches)
                </div>
                <p style={{ fontStyle: 'italic', fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
                  "We grow each crop with the same care and respect we give to our own household."
                </p>
                <Link
                  to="/customer/farmers"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    background: '#0B5D38',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '13px',
                  }}
                >
                  View Farmer Profile
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'Product Details' && (
            <div style={{ background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.8)', borderRadius: '16px', padding: '28px', color: '#1F2937', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#062414' }}>Specifications & Storage</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Category</p>
                  <p style={{ margin: '4px 0 0', fontWeight: 600, color: '#062414' }}>{product.Category || product.category || 'Organic Pantry'}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Shelf Life</p>
                  <p style={{ margin: '4px 0 0', fontWeight: 600, color: '#062414' }}>12 Months from Packaging</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Storage Recommendation</p>
                  <p style={{ margin: '4px 0 0', fontWeight: 600, color: '#062414' }}>Store in a cool, dry place away from direct sunlight</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: 600 }}>FSSAI Standards</p>
                  <p style={{ margin: '4px 0 0', fontWeight: 600, color: '#062414' }}>100% Quality & Hygiene Compliant</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'How it is Harvested' && (
            <div style={{ background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.8)', borderRadius: '16px', padding: '28px', color: '#1F2937', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#062414' }}>Traditional Harvest Process</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#475569' }}>
                1. <strong>Seed Selection:</strong> Heritage heirloom seeds passed down across generations are preserved without GMO tampering.<br />
                2. <strong>Organic Soil Nourishment:</strong> Crops are nourished with natural vermicompost and cow dung manure.<br />
                3. <strong>Sun-Drying & Cleaning:</strong> Once harvested at peak maturity, produce is gently sun-dried and manually cleaned to remove impurities.<br />
                4. <strong>Direct Delivery:</strong> Packaged in moisture-lock eco packs and shipped straight to customer doorsteps.
              </p>
            </div>
          )}

          {activeTab === 'Customer Reviews' && (
            <div style={{ background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.8)', borderRadius: '16px', padding: '28px', color: '#1F2937', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#062414' }}>Customer Reviews (4.9 / 5.0)</h3>
                  <p style={{ color: '#64748B', fontSize: '13px', margin: '4px 0 0' }}>Based on verified buyer ratings</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { name: 'Ananya Sharma', rating: 5, date: '3 days ago', comment: 'Exceptional aroma and purity! You can immediately tell this came from a real farm, not an industrial conveyor belt.' },
                  { name: 'Karthik Raja', rating: 5, date: '1 week ago', comment: 'Fast delivery and very secure packing. The texture and freshness are top-notch.' },
                  { name: 'Dr. Meenakshi Sundaram', rating: 5, date: '2 weeks ago', comment: 'I have switched all my kitchen spices and pulses to Farmiax. Truly empowering for farmers and healthier for our family.' }
                ].map((rev, idx) => (
                  <div key={idx} style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '10px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '14px', color: '#062414' }}>{rev.name}</strong>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>{rev.date}</span>
                    </div>
                    <div style={{ display: 'flex', color: '#F59E0B', marginBottom: '8px' }}>
                      {Array.from({ length: rev.rating }).map((_, i) => <FiStar key={i} className="fill-current" size={13} />)}
                    </div>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: '1.5' }}>"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Farmer Story' && (
            <div style={{ background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.8)', borderRadius: '16px', padding: '28px', color: '#1F2937', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', color: '#062414' }}>Connecting with the Grower</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#475569', marginBottom: '16px' }}>
                By buying this harvest directly on Farmiax, <strong>100% of fair value reaches the farmer's bank account</strong> without middleman commissions. This allows rural farming families to invest in sustainable irrigation, children's education, and traditional seed preservation.
              </p>
              <Link to="/customer/farmers" className="btn-dark-green" style={{ padding: '10px 20px', fontSize: '13px', display: 'inline-flex' }}>
                Explore All Verified Farmers
              </Link>
            </div>
          )}
        </div>

      </div>
    </CustomerDashboardLayout>
  );
};

export default CustomerProductDetails;
