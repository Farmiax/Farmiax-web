import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import '../../styles/farmer-products.css';
import '../../styles/farmer-dashboard.css';

const FarmerProducts = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formValues, setFormValues] = useState({});

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormValues({});
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormValues({ category: product.category });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormValues({});
  };

  // Products state (initially empty, ready for backend integration)
  const [products, setProducts] = useState([]);

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    }
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
          <Link to="/farmer/orders" className="farmer-nav-item">
            <i className="ri-file-list-3-line"></i> Orders
          </Link>
          <Link to="/farmer/products" className="farmer-nav-item active">
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
        <main className="farmer-content">
          {!showForm ? (
            <div className="products-container">
              <div className="products-header">
                <h1 className="products-title">My Products Management</h1>
                <div className="products-actions">
                  <button className="btn-add-product" onClick={handleAddNew}>Add New Product</button>
                  <div className="filters-group" style={{ display: 'flex', gap: '12px' }}>
                    <select className="filter-select">
                      <option value="">All Categories</option>
                      <option value="Vegetable">Vegetables</option>
                      <option value="Fruit">Fruits</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Pantry">Pantry</option>
                      <option value="Herb">Herb</option>
                    </select>
                    <select className="filter-select">
                      <option value="">All Statuses</option>
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                      <option value="Pending">Pending Approval</option>
                    </select>
                    <select className="filter-select">
                      <option value="newest">Sort: Newest First</option>
                      <option value="oldest">Sort: Oldest First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="products-grid">
                {products.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-card-content">
                      <img src={product.image} alt={product.name} className="product-image" />
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-category">{product.category}</p>
                        <p className="product-price">{product.price}</p>
                        <div className={`product-status status-${product.statusColor}`}>
                          {product.statusColor === 'red' && <i className="ri-alert-fill" style={{ marginRight: '4px' }}></i>}
                          {product.status}
                        </div>
                      </div>
                    </div>
                    <div className="product-card-actions">
                      <button className="btn-edit" onClick={() => handleEdit(product)}><i className="ri-pencil-line"></i> Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(product.id)}><i className="ri-delete-bin-line"></i> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="product-form-container">
              <div className="product-form-header">
                <h2 style={{ margin: 0, color: '#17221D' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              </div>
              <form className="product-form">
                {/* 1. Basic Product Information */}
                <div className="form-section">
                  <h3>🌾Basic Product Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product Name*</label>
                      <input type="text" defaultValue={editingProduct?.name} placeholder="e.g. Turmeric Powder" required />
                    </div>
                    <div className="form-group">
                      <label>Category*</label>
                      <select
                        value={formValues.category || editingProduct?.category || ''}
                        onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Vegetable">Vegetables</option>
                        <option value="Fruit">Fruits</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Pantry">Pantry</option>
                        <option value="Herb">Herb</option>
                        <option value="Other">Other</option>
                      </select>
                      {formValues.category === 'Other' && (
                        <input type="text" placeholder="Please specify category" style={{ marginTop: '8px' }} required />
                      )}
                    </div>
                    <div className="form-group">
                      <label>Subcategory</label>
                      <input type="text" placeholder="e.g. Leafy Greens" />
                    </div>
                    <div className="form-group full-width">
                      <label>Product Description*</label>
                      <textarea rows="3" placeholder="Detailed description of the product..." required></textarea>
                    </div>
                  </div>
                </div>

                {/* 2. Pricing & Quantity */}
                <div className="form-section">
                  <h3>💰Pricing & Quantity</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Price* (₹)</label>
                      <input type="number" defaultValue={editingProduct ? parseFloat(editingProduct.price.replace(/[^0-9.]/g, '')) : ''} placeholder="0.00" required />
                    </div>
                    <div className="form-group">
                      <label>MRP</label>
                      <input type="number" placeholder="0.00" />
                    </div>
                    <div className="form-group">
                      <label>Available Quantity*</label>
                      <input type="number" placeholder="e.g. 50" required />
                    </div>
                    <div className="form-group">
                      <label>Unit*</label>
                      <select
                        value={formValues.unit || 'kg'}
                        onChange={(e) => setFormValues({ ...formValues, unit: e.target.value })}
                        required
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="litre">litre</option>
                        <option value="piece">piece</option>
                        <option value="pack">pack</option>
                        <option value="doz">doz</option>
                        <option value="bunch">bunch</option>
                        <option value="Other">Other</option>
                      </select>
                      {formValues.unit === 'Other' && (
                        <input type="text" placeholder="Please specify unit" style={{ marginTop: '8px' }} required />
                      )}
                    </div>
                    <div className="form-group">
                      <label>Offer Available?</label>
                      <select
                        value={formValues.offer || 'No'}
                        onChange={(e) => setFormValues({ ...formValues, offer: e.target.value })}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                      {formValues.offer === 'Yes' && (
                        <input type="number" placeholder="Offer Percentage (%)" style={{ marginTop: '8px' }} required />
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Farm/Product Details */}
                <div className="form-section">
                  <h3>🌱Farm/Product Details</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product Type*</label>
                      <select
                        value={formValues.productType || 'Fresh'}
                        onChange={(e) => setFormValues({ ...formValues, productType: e.target.value })}
                        required
                      >
                        <option value="Fresh">Fresh</option>
                        <option value="Processed">Processed</option>
                        <option value="Packaged">Packaged</option>
                        <option value="Other">Other</option>
                      </select>
                      {formValues.productType === 'Other' && (
                        <input type="text" placeholder="Please specify type" style={{ marginTop: '8px' }} required />
                      )}
                    </div>
                    <div className="form-group">
                      <label>Organic</label>
                      <select>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Harvest Date</label>
                      <input type="date" />
                    </div>
                    <div className="form-group">
                      <label>Expired Date</label>
                      <input type="date" />
                    </div>
                    <div className="form-group">
                      <label>Cultivation Method</label>
                      <select
                        value={formValues.cultivation || 'Conventional'}
                        onChange={(e) => setFormValues({ ...formValues, cultivation: e.target.value })}
                      >
                        <option value="Organic">Organic</option>
                        <option value="Natural">Natural</option>
                        <option value="Conventional">Conventional</option>
                        <option value="Other">Other</option>
                      </select>
                      {formValues.cultivation === 'Other' && (
                        <input type="text" placeholder="Please specify method" style={{ marginTop: '8px' }} required />
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Packaging & Delivery */}
                <div className="form-section">
                  <h3>📦Packaging & Delivery</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Packaging Type</label>
                      <select
                        value={formValues.packaging || 'Box'}
                        onChange={(e) => setFormValues({ ...formValues, packaging: e.target.value })}
                      >
                        <option value="Bag">Bag</option>
                        <option value="Box">Box</option>
                        <option value="Bottle">Bottle</option>
                        <option value="Other">Other</option>
                      </select>
                      {formValues.packaging === 'Other' && (
                        <input type="text" placeholder="Please specify packaging" style={{ marginTop: '8px' }} required />
                      )}
                    </div>
                    <div className="form-group">
                      <label>Estimated Delivery Time</label>
                      <input type="text" placeholder="e.g. 2-3 Days" />
                    </div>
                  </div>
                </div>

                {/* 5. Product Identification */}
                <div className="form-section">
                  <h3>🏷️Product Identification</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>SKU / Product Code</label>
                      <input type="text" placeholder="SKU-123" />
                    </div>
                    <div className="form-group">
                      <label>Barcode (Optional)</label>
                      <input type="text" placeholder="Barcode Number" />
                    </div>
                  </div>
                </div>

                {/* 6. Images & Video */}
                <div className="form-section">
                  <h3>📸Images & Video</h3>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Upload Product Images (Max 4)</label>
                      <label className="image-upload-area" style={{ cursor: 'pointer' }}>
                        <input type="file" multiple accept="image/*" style={{ display: 'none' }} />
                        <i className="ri-image-add-line"></i>
                        <span>Click to upload main image, additional images, packaging, or farm source</span>
                      </label>
                    </div>
                    <div className="form-group full-width">
                      <label>Upload Product Video (Optional, max 1 min)</label>
                      <label className="image-upload-area" style={{ cursor: 'pointer' }}>
                        <input type="file" accept="video/*" style={{ display: 'none' }} />
                        <i className="ri-video-add-line"></i>
                        <span>Click to upload a short animation or video of the product</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
                  <button type="button" className="btn-submit" onClick={handleCancel}>Preview</button>
                  <button type="submit" className="btn-submit" onClick={(e) => { e.preventDefault(); handleCancel(); }}>Submit for Approval</button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FarmerProducts;
