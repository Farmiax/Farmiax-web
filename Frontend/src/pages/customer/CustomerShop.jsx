import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FiHeart, FiShoppingBag, FiStar, FiFilter, FiTag, FiSearch, FiX } from 'react-icons/fi';
import productService from '../../services/productService';
import { getImageUrl } from '../../utils/helpers';

const CustomerShop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();

  const urlCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search');
  const urlTab = searchParams.get('tab');

  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'All');
  const [searchQuery, setSearchQuery] = useState(urlSearch || '');
  const [minPrice, setMinPrice] = useState(10);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('popularity');
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync category & search from URL
  useEffect(() => {
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlSearch) setSearchQuery(urlSearch);
  }, [urlCategory, urlSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAllProducts();
        const prods = Array.isArray(data) ? data : (data?.data || []);
        setProductsList(prods);
      } catch (error) {
        console.warn('Products fetch note:', error?.message);
        setProductsList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Compute dynamic categories
  const dynamicCategories = useMemo(() => {
    const counts = productsList.reduce((acc, p) => {
      const cat = p.Category || p.category || 'Other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    return [
      { name: 'All', count: productsList.length },
      ...Object.keys(counts).map(cat => ({ name: cat, count: counts[cat] }))
    ];
  }, [productsList]);

  // Filter and sort items
  const filteredProducts = useMemo(() => {
    return productsList
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'All') {
          const pCat = (p.Category || p.category || '').toLowerCase();
          if (pCat !== selectedCategory.toLowerCase()) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const pName = (p.name || p.ProductName || '').toLowerCase();
          const pDesc = (p.description || '').toLowerCase();
          const pCat = (p.Category || p.category || '').toLowerCase();
          if (!pName.includes(q) && !pDesc.includes(q) && !pCat.includes(q)) return false;
        }

        // Price range filter
        const price = Number(p.price || p.Price || 0);
        if (price < Number(minPrice) || price > Number(maxPrice)) return false;

        // Rating filter
        if (ratingFilter > 0) {
          const rating = Number(p.rating || 4.5);
          if (rating < ratingFilter) return false;
        }

        // Offers tab filter
        if (urlTab === 'offers') {
          if (!p.tag && !p.oldPrice && price >= 300) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = Number(a.price || 0);
        const priceB = Number(b.price || 0);
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'newest') return (new Date(b.createdAt || 0)) - (new Date(a.createdAt || 0));
        return (b.reviews || 0) - (a.reviews || 0); // default popularity
      });
  }, [productsList, selectedCategory, searchQuery, minPrice, maxPrice, ratingFilter, sortBy, urlTab]);

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (catName === 'All') next.delete('category');
      else next.set('category', catName);
      return next;
    });
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMinPrice(10);
    setMaxPrice(2000);
    setRatingFilter(0);
    setSortBy('popularity');
    setSearchParams({});
  };

  return (
    <CustomerDashboardLayout>
      <div className="customer-main-content" style={{ padding: '24px' }}>
        <div className="container" style={{ maxWidth: '100%' }}>

          {/* Offers Announcement Banner */}
          {urlTab === 'offers' && (
            <div style={{
              background: 'linear-gradient(135deg, #1D4533 0%, #15803D 100%)',
              color: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px 32px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 10px 25px -5px rgba(29, 69, 51, 0.2)',
            }}>
              <div>
                <span style={{ background: '#FCE06D', color: '#17221D', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, display: 'inline-block', marginBottom: '8px' }}>
                  LIMITED HARVEST OFFERS
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0' }}>Special Seasonal Discounts 🔥</h2>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Get up to 20% OFF on direct harvest produce. Use coupon code <strong>FARM20</strong> at checkout.</p>
              </div>
              <button
                onClick={() => setSearchParams({})}
                style={{ background: '#FAF7F2', color: '#1D4533', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                View All Products
              </button>
            </div>
          )}

          <div className="shop-layout-grid">
            {/* Left Sidebar Filters */}
            <aside className={`shop-sidebar-filters ${showMobileFilters ? 'mobile-show' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="text-lg font-bold" style={{ margin: 0, color: '#FFFFFF' }}>Filters</h3>
                {(selectedCategory !== 'All' || searchQuery || ratingFilter > 0 || minPrice > 10 || maxPrice < 2000) && (
                  <button
                    onClick={handleClearFilters}
                    style={{ background: 'none', border: 'none', color: '#86EFAC', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Search Box in Sidebar */}
              <div style={{ marginBottom: '20px' }}>
                <p className="filter-group-title">Search Harvest</p>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 32px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                  <FiSearch style={{ position: 'absolute', left: '10px', top: '10px', color: '#86EFAC' }} />
                  {searchQuery && (
                    <FiX
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '10px', top: '10px', color: 'rgba(255, 255, 255, 0.7)', cursor: 'pointer' }}
                    />
                  )}
                </div>
              </div>

              {/* Categories */}
              <p className="filter-group-title">Categories</p>
              <div className="categories-filter-list">
                {dynamicCategories.map((c) => (
                  <div
                    key={c.name}
                    className={`category-filter-item ${selectedCategory === c.name ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(c.name)}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs text-slate-900 font-semibold">({c.count})</span>
                  </div>
                ))}
              </div>

              {/* Price Range */}
              <p className="filter-group-title">Price Range (₹)</p>
              <div className="price-range-inputs">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  placeholder="Min"
                  min="0"
                />
                <span style={{ color: '#86EFAC', fontWeight: 600 }}>to</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  placeholder="Max"
                  min="0"
                />
              </div>

              {/* Ratings */}
              <p className="filter-group-title">Customer Ratings</p>
              <div className="ratings-filter-list">
                {[4, 3, 0].map((star) => (
                  <label key={star} className="rating-filter-item" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="rating"
                      checked={ratingFilter === star}
                      onChange={() => setRatingFilter(star)}
                      style={{ accentColor: '#86EFAC' }}
                    />
                    <span style={{ color: '#FFFFFF' }}>{star > 0 ? `${star}★ & Above` : 'All Ratings'}</span>
                  </label>
                ))}
              </div>
            </aside>

            {/* Main Product Catalog */}
            <section className="shop-main-section">
              <div className="shop-header-row">
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px', color: '#FFFFFF' }}>
                    {selectedCategory === 'All' ? 'All Natural Products' : selectedCategory}
                  </h1>
                  <p style={{ margin: 0, fontSize: '13px', color: '#DCFCE7' }}>
                    Showing {filteredProducts.length} authentic farm items
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="shop-filter-toggle-mobile"
                    style={{
                      display: 'none',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      background: '#86EFAC',
                      color: '#062414',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <FiFilter size={14} /> Filters
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: '#DCFCE7' }}>Sort by:</span>
                    <select
                      className="shop-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{ background: 'rgba(255, 255, 255, 0.85)', border: '1px solid #CBD5E1', color: '#1F2937', borderRadius: '8px', padding: '6px 12px' }}
                    >
                      <option value="popularity">Popularity</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest Harvests</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Cards Grid */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', width: '100%', color: '#1F2937' }}>
                  <div className="loader-spinner" style={{ margin: '0 auto 16px' }} />
                  <p style={{ color: '#64748B' }}>Fetching fresh harvests from verified farms...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  background: 'rgba(255, 255, 255, 0.45)',
                  backdropFilter: 'blur(16px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                  color: '#1F2937',
                }}>
                  <p style={{ fontSize: '18px', fontWeight: 800, color: '#062414', marginBottom: '8px' }}>
                    No products match your current filters
                  </p>
                  <p style={{ color: '#475569', fontSize: '14px', marginBottom: '20px' }}>
                    Try searching for another crop, adjusting price limits, or clearing filters.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="btn-dark-green"
                    style={{ padding: '10px 24px', margin: '0 auto', display: 'inline-flex' }}
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="shop-products-grid">
                  {filteredProducts.map((p) => {
                    const prodId = p._id || p.id;
                    const isWishlisted = wishlistIds.has(prodId);
                    const prodImage = getImageUrl(p.image || p.Image);

                    return (
                      <div key={prodId} className="product-card-item">
                        <div className="product-card-top">
                          {p.tag && <span className={`product-tag ${p.tagClass || 'tag-fresh'}`}>{p.tag}</span>}
                          <button
                            className={`wishlist-heart-btn ${isWishlisted ? 'active' : ''}`}
                            onClick={() => toggleWishlist(prodId)}
                            aria-label="Toggle Wishlist"
                            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          >
                            <FiHeart className={isWishlisted ? 'fill-current' : ''} />
                          </button>
                          <Link to={`/customer/product/${prodId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <img
                              src={prodImage}
                              alt={p.name || 'Produce'}
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80';
                              }}
                            />
                          </Link>
                        </div>

                        <div className="product-card-details">
                          <Link to={`/customer/product/${prodId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h3 className="product-title">{p.name || p.ProductName || 'Organic Item'}</h3>
                          </Link>
                          <p className="product-weight">{p.quantity || 1} {p.unit || 'unit'}</p>

                          <div className="product-rating">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FiStar key={i} className="fill-amber-400 text-amber-400" size={12} />
                            ))}
                            <span className="review-count">({p.reviews || 12})</span>
                          </div>

                          <div className="product-bottom-row">
                            <div className="product-price-box">
                              <span className="current-price">₹{p.price || 0}</span>
                              {p.oldPrice && (
                                <span className="old-price" style={{ textDecoration: 'line-through', color: '#94A3B8', fontSize: '12px', marginLeft: '6px' }}>
                                  ₹{p.oldPrice}
                                </span>
                              )}
                            </div>
                            <button
                              className="add-cart-btn-icon"
                              onClick={() => addToCart(prodId, 1)}
                              title="Add to Cart"
                            >
                              <FiShoppingBag size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
