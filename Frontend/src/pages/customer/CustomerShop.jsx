import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import productService from '../../services/productService';

const CustomerShop = () => {
  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(10);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProductsList(data || []);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Generate dynamic categories from loaded products
  const categoryCounts = productsList.reduce((acc, product) => {
    const cat = product.Category || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const dynamicCategories = [
    { name: 'All Categories', count: productsList.length },
    ...Object.keys(categoryCounts).map(cat => ({
      name: cat, count: categoryCounts[cat]
    }))
  ];
  return (
    <CustomerDashboardLayout>
      <div className="customer-main-content" style={{ padding: '24px' }}>
        <div className="container" style={{ maxWidth: '100%' }}>
          <div className="shop-layout-grid">
            {/* Left Sidebar Filters */}
            <aside className="shop-sidebar-filters">
              <h3 className="text-lg font-bold mb-4">Filters</h3>

              <p className="filter-group-title">Categories</p>
              <div className="categories-filter-list">
                {dynamicCategories.map((c) => (
                  <div
                    key={c.name}
                    className={`category-filter-item ${selectedCategory === c.name || (selectedCategory === 'All' && c.name === 'All Categories') ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(c.name === 'All Categories' ? 'All' : c.name)}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs text-slate-400">({c.count})</span>
                  </div>
                ))}
              </div>

              <p className="filter-group-title">Price Range</p>
              <div className="price-range-inputs">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                />
              </div>

              <p className="filter-group-title">Ratings</p>
              <div className="ratings-filter-list">
                <label className="rating-filter-item">
                  <input type="checkbox" defaultChecked />
                  <span>4★ & Above</span>
                </label>
                <label className="rating-filter-item">
                  <input type="checkbox" />
                  <span>3★ & Above</span>
                </label>
              </div>

              <button className="add-cart-btn-full mt-4">Apply Filters</button>
            </aside>

            {/* Main Product Catalog */}
            <section className="shop-main-section">
              <div className="shop-header-row">
                <div>
                  <h1>{selectedCategory === 'All' ? 'All Products' : selectedCategory}</h1>
                  <p>Showing {productsList.length} products</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Sort by:</span>
                  <select className="shop-sort-select">
                    <option>Popularity</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest Arrivals</option>
                  </select>
                </div>
              </div>

              {/* Product Cards Grid */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', width: '100%', color: 'var(--text-muted)' }}>
                  Loading products...
                </div>
              ) : productsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', width: '100%', color: 'var(--text-muted)' }}>
                  No products available yet.
                </div>
              ) : (
                <div className="shop-products-grid">
                  {productsList.map((p) => (
                    <div key={p._id || p.id} className="product-card-item">
                    <div className="product-card-top">
                      {p.tag && <span className={`product-tag ${p.tagClass}`}>{p.tag}</span>}
                      <button
                        className={`wishlist-heart-btn ${wishlistIds.has(p._id || p.id) ? 'active' : ''}`}
                        onClick={() => toggleWishlist(p._id || p.id)}
                        aria-label="Wishlist"
                      >
                        <FiHeart className={wishlistIds.has(p._id || p.id) ? 'fill-current' : ''} />
                      </button>
                      <Link to={`/customer/product/${p._id || p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <img src={p.image ? `http://localhost:5000/${p.image}` : 'https://via.placeholder.com/200'} alt={p.name} loading="lazy" />
                      </Link>
                    </div>

                    <div className="product-card-details">
                      <Link to={`/customer/product/${p._id || p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 className="product-title">{p.name}</h3>
                      </Link>
                      <p className="product-weight">{p.quantity} {p.unit || 'unit'}</p>

                      <div className="product-rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar key={i} className="fill-amber-400 text-amber-400" size={12} />
                        ))}
                        <span className="review-count">({p.reviews})</span>
                      </div>

                      <div className="product-bottom-row">
                        <div className="product-price-box">
                          <span className="current-price">₹{p.price}</span>
                        </div>
                        <button
                          className="add-cart-btn-icon"
                          onClick={() => addToCart(p._id || p.id, 1)}
                          title="Add to Cart"
                        >
                          <FiShoppingBag size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
};

export default CustomerShop;
