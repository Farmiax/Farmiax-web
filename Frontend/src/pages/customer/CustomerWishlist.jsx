import { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useCart } from '../../context/CartContext';
import { FiHeart, FiShare2, FiStar, FiShoppingBag } from 'react-icons/fi';

import '../../styles/customer.css';

const CustomerWishlist = () => {
  const { addToCart } = useCart();
  
  // Initialize with empty array since we removed the mock data.
  // In the future, this can be fetched from the API
  const [wishlistItems, setWishlistItems] = useState([]);

  return (
    <CustomerDashboardLayout>
      <div style={{ padding: '32px 40px' }}>
        <section className="wishlist-main-content w-full">
          {/* Redesigned Wishlist Banner */}
          <div className="wishlist-banner-header">
            <div className="wishlist-banner-bg-icon">
              <FiHeart size={180} />
            </div>
            <div className="wishlist-banner-info">
              <h2>
                <FiHeart /> My Wishlist
              </h2>
              <p>
                Curated favorites waiting to be yours. ({wishlistItems.length} items)
              </p>
            </div>
            <button className="wishlist-share-btn">
              <FiShare2 /> Share Collection
            </button>
          </div>

          {/* Wishlist Items or Empty State */}
          {wishlistItems.length === 0 ? (
            <div className="wishlist-empty-state">
              <div className="wishlist-empty-icon">
                <FiHeart size={40} />
              </div>
              <h3>Your wishlist is empty</h3>
              <p>Explore our wide selection of natural products and save your favorites here.</p>
              <Link to="/customer/shop" className="btn-dark-green wishlist-empty-btn" style={{ textDecoration: 'none' }}>
                <FiShoppingBag /> Start Shopping
              </Link>
            </div>
          ) : (
          <div className="wishlist-products-grid">
            {wishlistItems.map((item) => (
              <div key={item.id} className="product-card-item wishlist-card-item">
                <div className="product-card-top">
                  {item.tag && <span className={`product-tag ${item.tagClass}`}>{item.tag}</span>}
                  <button className="wishlist-heart-btn active" title="Remove from Wishlist">
                    <FiHeart className="fill-red-500 text-red-500" />
                  </button>
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>

                <div className="product-card-details">
                  <h3 className="product-title">{item.name}</h3>
                  <p className="product-weight">{item.weight}</p>

                  <div className="product-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} className="fill-amber-400 text-amber-400" size={12} />
                    ))}
                    <span className="review-count">({item.reviews})</span>
                  </div>

                  <div className="product-price-box mb-3">
                    <span className="current-price">₹{item.price}</span>
                    {item.oldPrice && <span className="old-price">₹{item.oldPrice}</span>}
                  </div>

                  <button
                    className="add-cart-btn-full"
                    onClick={() => addToCart(item.id, 1)}
                  >
                    <FiShoppingBag /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </section>
      </div>
    </CustomerDashboardLayout>
  );
};

export default CustomerWishlist;
