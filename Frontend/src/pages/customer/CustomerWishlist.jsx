import { Link } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FiHeart, FiShare2, FiStar, FiShoppingBag, FiTrash2 } from 'react-icons/fi';

import '../../styles/customer.css';

const CustomerWishlist = () => {
  const { addToCart } = useCart();
  const { wishlistProducts, removeFromWishlist, loading } = useWishlist();

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
                Curated favorites waiting to be yours. ({wishlistProducts.length} items)
              </p>
            </div>
            <button className="wishlist-share-btn">
              <FiShare2 /> Share Collection
            </button>
          </div>

          {/* Wishlist Items or Empty State */}
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading your wishlist...
            </div>
          ) : wishlistProducts.length === 0 ? (
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
            {wishlistProducts.map((item) => (
              <div key={item._id || item.id} className="product-card-item wishlist-card-item">
                <div className="product-card-top">
                  {item.tag && <span className={`product-tag ${item.tagClass}`}>{item.tag}</span>}
                  <button 
                    className="wishlist-heart-btn active" 
                    title="Remove from Wishlist"
                    onClick={() => removeFromWishlist(item._id || item.id)}
                  >
                    <FiTrash2 className="fill-red-500 text-red-500" />
                  </button>
                  <Link to={`/customer/product/${item._id || item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={item.image ? `http://localhost:5000/${item.image}` : 'https://via.placeholder.com/200'} alt={item.name} loading="lazy" />
                  </Link>
                </div>

                <div className="product-card-details">
                  <Link to={`/customer/product/${item._id || item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className="product-title">{item.name}</h3>
                  </Link>
                  <p className="product-weight">{item.quantity} {item.unit || 'unit'}</p>

                  <div className="product-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} className="fill-amber-400 text-amber-400" size={12} />
                    ))}
                    <span className="review-count">({item.reviews || 0})</span>
                  </div>

                  <div className="product-price-box mb-3">
                    <span className="current-price">₹{item.price}</span>
                    {item.oldPrice && <span className="old-price">₹{item.oldPrice}</span>}
                  </div>

                  <button
                    className="add-cart-btn-full"
                    onClick={() => addToCart(item._id || item.id, 1)}
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
