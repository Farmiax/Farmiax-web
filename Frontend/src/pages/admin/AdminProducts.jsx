import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/admin/AdminDashboardLayout';
import adminService from '../../services/adminService';
import { getImageUrl } from '../../utils/helpers';
import {
  FiSearch, FiFilter, FiTrash2, FiEdit2, FiEye,
  FiX, FiAlertCircle, FiCheck, FiRefreshCw, FiUser
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals state
  const [inspectProduct, setInspectProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllProducts();
      const list = Array.isArray(data) ? data : (data?.data || []);
      setProducts(list);
      setFilteredProducts(list);
    } catch (err) {
      toast.error('Failed to load global produce catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCategory !== 'All') {
      result = result.filter((p) => (p.category || p.Category) === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.farmer?.fullName?.toLowerCase().includes(q)
      );
    }
    setFilteredProducts(result);
  }, [search, selectedCategory, products]);

  const categories = ['All', ...new Set(products.map((p) => p.category || p.Category).filter(Boolean))];

  // Inspect Single Product with Full Farmer Info
  const handleInspect = async (id) => {
    try {
      const data = await adminService.getProductDetails(id);
      setInspectProduct(data?.data || data?.product || data);
    } catch (err) {
      toast.error('Error fetching product details');
    }
  };

  // Edit Product Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.updateProduct(editProduct);
      toast.success('Product updated successfully across the marketplace!');
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Product via Admin Route
  const handleDeleteConfirm = async () => {
    if (!deleteProductId) return;
    setSubmitting(true);
    try {
      await adminService.deleteProduct(deleteProductId);
      toast.success('Product removed from marketplace.');
      setDeleteProductId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminDashboardLayout activeNav="products">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF' }}>
            Global Produce Catalog Master
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
            Inspect, modify, or remove produce listings published by all registered farmers.
          </p>
        </div>

        <button
          onClick={fetchProducts}
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
          <FiRefreshCw className={loading ? 'spin-icon' : ''} /> Reload Catalog
        </button>
      </div>

      {/* Filters Bar */}
      <div className="admin-glass-box" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
            <input
              type="text"
              placeholder="Search by produce title, description, or farmer..."
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
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#4ADE80' : 'rgba(255,255,255,0.15)',
                background: selectedCategory === cat ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                color: selectedCategory === cat ? '#4ADE80' : 'rgba(255,255,255,0.8)',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-glass-box" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            Loading marketplace products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            No products match the selected criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produce</th>
                  <th>Category</th>
                  <th>Price & Unit</th>
                  <th>Stock Available</th>
                  <th>Farmer Attribution</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const pId = p._id || p.id;
                  const isLowStock = Number(p.stock) <= 5;
                  return (
                    <tr key={pId}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={getImageUrl(p.image)}
                            alt={p.name}
                            style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', background: '#021209' }}
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'; }}
                          />
                          <div>
                            <strong style={{ fontSize: '14px', color: '#FFFFFF', display: 'block' }}>{p.name}</strong>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>ID: {String(pId).slice(-6)}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', fontSize: '12px', fontWeight: 700 }}>
                          {p.category || p.Category || 'General'}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: '#4ADE80' }}>₹{p.price}</strong>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}> / {p.quantity} {p.unit || 'kg'}</span>
                      </td>
                      <td>
                        <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, background: isLowStock ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)', color: isLowStock ? '#F87171' : '#4ADE80' }}>
                          {p.stock} in stock
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
                          {p.farmer?.fullName || 'Verified Farmer'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleInspect(pId)} className="admin-action-btn admin-btn-view" title="Inspect Farmer & Produce Details">
                            <FiEye size={13} />
                          </button>
                          <button
                            onClick={() => setEditProduct({
                              productId: pId,
                              name: p.name,
                              description: p.description,
                              price: p.price,
                              quantity: p.quantity,
                              unit: p.unit || 'kg',
                              stock: p.stock,
                              farmerId: p.farmer?._id || p.farmer || '',
                              Category: p.category || p.Category || 'Vegetables',
                            })}
                            className="admin-action-btn admin-btn-view"
                            style={{ borderColor: 'rgba(234, 179, 8, 0.4)', color: '#FACC15' }}
                            title="Edit Listing"
                          >
                            <FiEdit2 size={13} />
                          </button>
                          <button onClick={() => setDeleteProductId(pId)} className="admin-action-btn admin-btn-delete" title="Remove Listing as Admin">
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

      {/* Inspect Product Modal */}
      {inspectProduct && (
        <div className="admin-modal-backdrop" onClick={() => setInspectProduct(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFF' }}>Produce & Farmer Dossier</h3>
              <button onClick={() => setInspectProduct(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>

            <div style={{ display: 'flex', gap: '18px', marginBottom: '20px' }}>
              <img
                src={getImageUrl(inspectProduct.image)}
                alt={inspectProduct.name}
                style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '18px', color: '#FFF' }}>{inspectProduct.name}</h4>
                <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#4ADE80', fontWeight: 700 }}>₹{inspectProduct.price} per {inspectProduct.quantity} {inspectProduct.unit}</p>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Category: {inspectProduct.category || inspectProduct.Category}</span>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '20px', background: 'rgba(255,255,255,0.05)', padding: '14px', borderRadius: '10px' }}>
              {inspectProduct.description}
            </p>

            {/* Farmer Profile Box */}
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(74, 222, 128, 0.25)', borderRadius: '12px', padding: '16px' }}>
              <h5 style={{ margin: '0 0 10px', fontSize: '14px', color: '#4ADE80', fontWeight: 800 }}>Farmer Origin Details</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <div><strong>Farmer Name:</strong> {inspectProduct.farmer?.fullName || 'Verified Farmer'}</div>
                <div><strong>Phone:</strong> {inspectProduct.farmer?.phone || 'N/A'}</div>
                <div><strong>Email:</strong> {inspectProduct.farmer?.email || 'N/A'}</div>
                <div><strong>Location:</strong> {[inspectProduct.farmer?.City, inspectProduct.farmer?.State].filter(Boolean).join(', ') || 'India'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="admin-modal-backdrop" onClick={() => setEditProduct(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFF' }}>Edit Produce Listing</h3>
              <button onClick={() => setEditProduct(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>Produce Name</label>
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>Price (₹)</label>
                  <input
                    type="number"
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>Stock Quantity</label>
                  <input
                    type="number"
                    value={editProduct.stock}
                    onChange={(e) => setEditProduct({ ...editProduct, stock: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <textarea
                  value={editProduct.description}
                  rows={3}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setEditProduct(null)} style={{ padding: '10px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={{ padding: '10px 20px', borderRadius: '8px', background: '#22C55E', border: 'none', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>
                  {submitting ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteProductId && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteProductId(null)}>
          <div className="admin-modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                <FiAlertCircle size={22} />
              </div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#FFF' }}>Remove Produce Listing?</h3>
            </div>
            <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, margin: '0 0 20px' }}>
              This will permanently delete the crop listing from the Farmiax marketplace catalog.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setDeleteProductId(null)} style={{ padding: '8px 14px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="button" disabled={submitting} onClick={handleDeleteConfirm} style={{ padding: '8px 18px', borderRadius: '8px', background: '#EF4444', border: 'none', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>
                {submitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminProducts;
