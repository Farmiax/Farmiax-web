import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import {
  FiShoppingCart, FiTrash2, FiArrowLeft, FiArrowRight, FiHeart,
  FiShield, FiCheckCircle, FiTruck, FiTag, FiPercent, FiGift, FiPlus
} from 'react-icons/fi';

import catGrains from '../../assets/images/cat-grains.png';
import '../../styles/customer.css';

const AVAILABLE_COUPONS = [
  { code: 'FARM20', discountPercent: 20, desc: '20% OFF on organic harvest' },
  { code: 'FRESH100', discountFlat: 100, desc: '₹100 OFF on orders above ₹400' },
  { code: 'SPRING15', discountPercent: 15, desc: '15% Direct Farmer Discount' },
];

const CustomerCart = () => {
  const navigate = useNavigate();
  const { cartProducts, updateCartItem, removeFromCart, addToCart: addContextCart } = useCart();

  const items = cartProducts || [];

  const [recommendedAddOns, setRecommendedAddOns] = useState([]);
  const [promoInput, setPromoInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('standard');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/product/all-products');
        const allProds = response.data?.products || response.data?.data || response.data || [];
        if (Array.isArray(allProds) && allProds.length > 0) {
          // Exclude items already in cart
          const cartIds = items.map((i) => i.id || i._id);
          const filtered = allProds.filter((p) => !cartIds.includes(p._id || p.id)).slice(0, 4);
          setRecommendedAddOns(filtered);
        }
      } catch (err) {
        console.warn('Backend products fetch notice:', err?.message);
      }
    };
    fetchRecommendations();
  }, [items.length]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleUpdateQty = (item, delta) => {
    const currentQty = item.cartQuantity || item.qty || 1;
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    updateCartItem(item._id || item.id, newQty);
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
    showToast('Item removed from cart');
  };

  const handleMoveToWishlist = (item) => {
    handleRemoveItem(item._id || item.id);
    showToast(`"${item.name}" saved to your Wishlist! 💚`);
  };

  const handleClearCart = () => {
    items.forEach((item) => removeFromCart(item._id || item.id));
    setAppliedCoupon(null);
    showToast('Shopping cart cleared');
  };

  const handleAddRecommended = (rec) => {
    if (addContextCart) {
      addContextCart(rec._id || rec.id, 1);
      showToast(`Added ${rec.name || rec.ProductName} to cart! 🛒`);
    }
  };

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || promoInput).trim().toUpperCase();
    setPromoError('');

    const found = AVAILABLE_COUPONS.find((c) => c.code === code);
    if (found) {
      setAppliedCoupon(found);
      setPromoInput('');
      showToast(`🎉 Coupon ${found.code} applied successfully!`);
    } else {
      setPromoError('Invalid coupon code. Try FARM20 or FRESH100.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Financial Calculations
  const subtotal = items.reduce((acc, item) => {
    const q = item.cartQuantity || item.qty || 1;
    return acc + (item.price || item.Price || 0) * q;
  }, 0);

  const totalMRP = items.reduce((acc, item) => {
    const q = item.cartQuantity || item.qty || 1;
    const p = item.price || item.Price || 0;
    const oldP = item.oldPrice || p * 1.2;
    return acc + oldP * q;
  }, 0);

  const productSavings = Math.max(0, totalMRP - subtotal);

  // Free shipping threshold = ₹500
  const freeShippingThreshold = 500;
  const isFreeShipping = subtotal >= freeShippingThreshold || items.length === 0;
  const deliveryCharge = items.length === 0 ? 0 : (isFreeShipping ? 0 : 40);
  const expressFee = deliveryMode === 'express' ? 30 : 0;

  // Coupon discount calculation
  let couponDiscount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discountPercent) {
      couponDiscount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountFlat) {
      couponDiscount = Math.min(subtotal, appliedCoupon.discountFlat);
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryCharge + expressFee - couponDiscount);
  const totalSavings = productSavings + couponDiscount + (isFreeShipping && items.length > 0 ? 40 : 0);

  // Shipping progress percentage
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <CustomerDashboardLayout>
      <div className="cart-page-wrapper">
        {/* Toast Notification Alert */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: '#062414',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              fontSize: '14px',
              fontWeight: 600,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <FiCheckCircle style={{ color: '#86EFAC', fontSize: '18px' }} />
            {toastMessage}
          </div>
        )}

        {/* Page Banner Header */}
        <div className="cart-banner-header">
          <div className="cart-banner-bg-icon">
            <FiShoppingCart size={220} />
          </div>
          <div className="cart-banner-content">
            <div className="cart-banner-top-row">
              <div className="cart-banner-title">
                <FiShoppingCart size={32} />
                <h1>Your Shopping Cart</h1>
              </div>

              <div className="cart-count-badge">
                <FiGift />
                <span>{items.length} {items.length === 1 ? 'Item' : 'Items'} Selected</span>
              </div>
            </div>

            <p className="cart-banner-sub">
              Direct-from-farm organic produce. Fresh harvest guaranteed with transparent pricing.
            </p>

            {/* Free Shipping Progress Indicator */}
            {items.length > 0 && (
              <div className="cart-delivery-progress-box">
                <div className="cart-progress-text">
                  <span>
                    {isFreeShipping ? (
                      <>🎉 You unlocked <strong>FREE Express Delivery</strong>!</>
                    ) : (
                      <>Add <strong>₹{freeShippingThreshold - subtotal}</strong> more for <strong>FREE Express Delivery</strong></>
                    )}
                  </span>
                  <span>{shippingProgress}%</span>
                </div>
                <div className="cart-progress-bar-bg">
                  <div
                    className="cart-progress-bar-fill"
                    style={{ width: `${shippingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty Cart State */}
        {items.length === 0 ? (
          <div className="cart-empty-wrapper">
            <div className="cart-empty-icon-circle">
              <FiShoppingCart size={48} />
            </div>
            <h2>Your Shopping Cart is Empty</h2>
            <p>
              Explore our wide range of 100% natural spices, pulses, grains, and cold-pressed oils harvested directly by verified local farmers.
            </p>
            <Link to="/customer/shop" className="btn-dark-green" style={{ display: 'inline-flex', margin: '0 auto', textDecoration: 'none' }}>
              <FiShoppingCart /> Explore Farm Store
            </Link>
          </div>
        ) : (
          /* Main Cart Content Grid */
          <div className="cart-main-grid">
            {/* Left Side: Items List */}
            <div>
              <div className="cart-items-container">
                {items.map((item) => {
                  const qty = item.cartQuantity || item.qty || 1;
                  const price = item.price || item.Price || 0;
                  const itemSubtotal = price * qty;

                  return (
                    <div key={item.id || item._id} className="cart-item-card">
                      <div className="cart-item-left-group">
                        <div className="cart-item-img-wrapper">
                          <img
                            src={item.image || item.imageurl || catGrains}
                            alt={item.name || item.ProductName}
                            loading="lazy"
                          />
                        </div>

                        <div className="cart-item-info">
                          <div className="cart-item-badges">
                            <span className="cart-badge-organic">🌿 100% Organic</span>
                            {item.discount && (
                              <span className="cart-badge-discount">{item.discount}</span>
                            )}
                          </div>

                          <h3 className="cart-item-title">{item.name || item.ProductName}</h3>

                          {(item.farmer || item.FarmerName) && (
                            <span className="cart-item-farmer">
                              👨‍🌾 {item.farmer || item.FarmerName}
                            </span>
                          )}

                          <span className="cart-item-unit">Unit: {item.unit || item.weight || '1 Pack'}</span>

                          <div className="cart-item-price-row">
                            <span className="cart-item-price">₹{price}</span>
                            {item.oldPrice && (
                              <span className="cart-item-old-price">₹{item.oldPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Controls: Stepper & Subtotal */}
                      <div className="cart-item-right-controls">
                        <div className="cart-qty-stepper">
                          <button
                            className="cart-qty-btn"
                            onClick={() => handleUpdateQty(item, -1)}
                            title="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="cart-qty-val">{qty}</span>
                          <button
                            className="cart-qty-btn"
                            onClick={() => handleUpdateQty(item, 1)}
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-item-subtotal">₹{itemSubtotal}</div>

                        <div className="cart-item-actions-group">
                          <button
                            className="cart-action-btn wishlist"
                            onClick={() => handleMoveToWishlist(item)}
                            title="Move to Wishlist"
                          >
                            <FiHeart size={16} />
                          </button>

                          <button
                            className="cart-action-btn remove"
                            onClick={() => handleRemoveItem(item.id || item._id)}
                            title="Remove from Cart"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Action Bar */}
              <div className="cart-list-bottom-bar">
                <Link to="/customer/shop" className="cart-continue-link">
                  <FiArrowLeft size={16} /> Continue Shopping Produce
                </Link>

                <button className="cart-clear-btn" onClick={handleClearCart}>
                  <FiTrash2 size={15} /> Clear Shopping Cart
                </button>
              </div>
            </div>

            {/* Right Side: Sticky Order Summary Card */}
            <div>
              <div className="cart-summary-box">
                <div className="cart-summary-header">
                  <h3>Order Summary</h3>
                  <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiShield size={14} /> Encrypted
                  </span>
                </div>

                {/* Overall Savings Banner */}
                {totalSavings > 0 && (
                  <div className="cart-savings-pill">
                    <FiPercent size={15} /> You are saving <strong>₹{totalSavings}</strong> on this order!
                  </div>
                )}

                {/* Promo Code Section */}
                <div className="cart-promo-section">
                  <span className="cart-promo-label">
                    <FiTag style={{ marginRight: '6px', color: '#166534' }} /> Apply Farm Discount Code
                  </span>

                  {appliedCoupon ? (
                    <div className="cart-applied-coupon-box">
                      <div>
                        <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.desc})
                      </div>
                      <button className="cart-remove-coupon-btn" onClick={handleRemoveCoupon}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="cart-promo-input-flex">
                        <input
                          type="text"
                          placeholder="e.g. FARM20"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                        />
                        <button
                          className="cart-promo-apply-btn"
                          onClick={() => handleApplyCoupon()}
                        >
                          Apply
                        </button>
                      </div>

                      {promoError && (
                        <p style={{ color: '#DC2626', fontSize: '12px', margin: '6px 0 0', fontWeight: 500 }}>
                          {promoError}
                        </p>
                      )}

                      <div className="cart-promo-tags">
                        {AVAILABLE_COUPONS.map((c) => (
                          <button
                            key={c.code}
                            className="cart-promo-tag"
                            onClick={() => handleApplyCoupon(c.code)}
                          >
                            +{c.code}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Delivery Mode Selector */}
                <div className="cart-delivery-selector">
                  <label className="cart-delivery-option">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMode === 'standard'}
                      onChange={() => setDeliveryMode('standard')}
                    />
                    <span>Standard Express Shipping (2-3 Days)</span>
                  </label>
                  <label className="cart-delivery-option">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMode === 'express'}
                      onChange={() => setDeliveryMode('express')}
                    />
                    <span>Fresh Morning Slot (Tomorrow 7-10 AM) +₹30</span>
                  </label>
                </div>

                {/* Cost Breakdown */}
                <div className="cart-summary-rows">
                  <div className="cart-summary-row">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{subtotal}</span>
                  </div>

                  {productSavings > 0 && (
                    <div className="cart-summary-row discount">
                      <span>Harvest Savings</span>
                      <span>-₹{productSavings}</span>
                    </div>
                  )}

                  {appliedCoupon && couponDiscount > 0 && (
                    <div className="cart-summary-row discount">
                      <span>Promo Coupon ({appliedCoupon.code})</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="cart-summary-row">
                    <span>Delivery Charge</span>
                    {isFreeShipping ? (
                      <span className="cart-summary-row free-tag">FREE</span>
                    ) : (
                      <span>₹{deliveryCharge}</span>
                    )}
                  </div>

                  {deliveryMode === 'express' && (
                    <div className="cart-summary-row">
                      <span>Morning Express Slot</span>
                      <span>₹30</span>
                    </div>
                  )}

                  <div className="cart-summary-row">
                    <span>Organic Eco-Packaging</span>
                    <span className="cart-summary-row free-tag">FREE</span>
                  </div>
                </div>

                <div className="cart-summary-total-row">
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>

                {/* Checkout CTA */}
                <button
                  className="cart-checkout-cta-btn"
                  onClick={() => navigate('/customer/checkout', { state: { appliedCoupon, couponDiscount } })}
                >
                  Proceed to Checkout <FiArrowRight size={18} />
                </button>

                {/* Trust Guarantees */}
                <div className="cart-trust-guarantees">
                  <div className="cart-trust-item">
                    <FiCheckCircle /> 100% Quality & Freshness Guarantee
                  </div>
                  <div className="cart-trust-item">
                    <FiShield /> SSL 256-Bit Secure Checkout
                  </div>
                  <div className="cart-trust-item">
                    <FiTruck /> Direct Fair-Trade Payout to Farmers
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Frequently Bought Together Add-Ons Section */}
        {recommendedAddOns.length > 0 && (
          <div className="cart-recommendations-section">
            <h3>Frequently Bought Together</h3>

            <div className="cart-recommendations-grid">
              {recommendedAddOns.map((rec) => (
                <div key={rec._id || rec.id} className="cart-recommend-card">
                  <img src={rec.image || rec.imageurl || catGrains} alt={rec.name || rec.ProductName} className="cart-recommend-img" />
                  <h4 className="cart-recommend-title">{rec.name || rec.ProductName}</h4>
                  <div className="cart-recommend-price">
                    ₹{rec.price || rec.Price}
                  </div>
                  <button
                    className="cart-recommend-add-btn"
                    onClick={() => handleAddRecommended(rec)}
                  >
                    <FiPlus size={14} /> Add to Order
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CustomerDashboardLayout>
  );
};

export default CustomerCart;
