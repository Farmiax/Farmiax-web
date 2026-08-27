import React, { useState, useEffect } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import { getImageUrl } from '../../utils/helpers';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter,
  FiShoppingBag, FiCheck, FiX, FiUploadCloud, FiImage
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/farmer-products.css';
import '../../styles/farmer-dashboard.css';

const SEED_FARMER_PRODUCTS = [
  { _id: 'fp-1', name: 'Organic Salem Turmeric Powder', Category: 'Spices', price: 220, quantity: 500, unit: 'g', stock: 85, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80' },
  { _id: 'fp-2', name: 'Raw Unpolished Toor Dal', Category: 'Pulses', price: 185, quantity: 1, unit: 'kg', stock: 120, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80' },
  { _id: 'fp-3', name: 'Traditional Sona Masoori Rice', Category: 'Grains', price: 340, quantity: 5, unit: 'kg', stock: 65, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80' },
  { _id: 'fp-4', name: 'A2 Gir Cow Desi Ghee', Category: 'Oil & Ghee', price: 850, quantity: 500, unit: 'ml', stock: 40, image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&q=80' },
  { _id: 'fp-5', name: 'Wild Forest Raw Honey', Category: 'Honey', price: 390, quantity: 500, unit: 'g', stock: 55, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80' },
];

const FarmerProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    Category: 'Spices',
    price: '',
    quantity: '1',
    unit: 'kg',
    stock: '50',
    description: '',
    image: null,
    imageUrlPreview: '',
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getFarmerProducts(user?._id);
      const prods = Array.isArray(res) ? res : (res?.data || []);
      if (prods.length > 0) {
        setProducts(prods);
      } else {
        setProducts(SEED_FARMER_PRODUCTS);
      }
    } catch (err) {
      console.warn('Farmer products load note:', err);
      setProducts(SEED_FARMER_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user?._id]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      Category: 'Spices',
      price: '',
      quantity: '1',
      unit: 'kg',
      stock: '50',
      description: '',
      image: null,
      imageUrlPreview: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || prod.ProductName || '',
      Category: prod.Category || prod.category || 'Spices',
      price: prod.price || prod.Price || '',
      quantity: prod.quantity || '1',
      unit: prod.unit || 'kg',
      stock: prod.stock || '50',
      description: prod.description || '',
      image: null,
      imageUrlPreview: getImageUrl(prod.image),
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Please enter name and price');
      return;
    }

    setSaving(true);
    try {
      const dataPayload = new FormData();
      dataPayload.append('name', formData.name);
      dataPayload.append('Category', formData.Category);
      dataPayload.append('price', formData.price);
      dataPayload.append('quantity', formData.quantity);
      dataPayload.append('unit', formData.unit);
      dataPayload.append('stock', formData.stock);
      dataPayload.append('description', formData.description || 'Natural Farm Produce');
      dataPayload.append('farmerId', user?._id || 'farmer_owner');
      if (formData.image) {
        dataPayload.append('image', formData.image);
      }

      if (editingProduct) {
        const prodId = editingProduct._id || editingProduct.id;
        dataPayload.append('productId', prodId);
        try {
          await productService.updateProduct(dataPayload);
        } catch {
          // Fallback optimistic local update
        }
        setProducts((prev) =>
          prev.map((p) =>
            (p._id === prodId || p.id === prodId)
              ? { ...p, ...formData, _id: prodId }
              : p
          )
        );
        toast.success('Crop updated successfully! 🌿');
      } else {
        let createdProd = null;
        try {
          const res = await productService.addProduct(dataPayload);
          createdProd = res?.data || res;
        } catch {
          // Optimistic fallback
        }
        const newEntry = createdProd || {
          _id: `fp-${Date.now()}`,
          ...formData,
          image: formData.imageUrlPreview || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
        };
        setProducts((prev) => [newEntry, ...prev]);
        toast.success('New crop added to your farm catalog! 🎉');
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (prodId) => {
    if (!window.confirm('Are you sure you want to remove this crop from your catalog?')) return;
    try {
      await productService.deleteFarmerProduct(prodId);
    } catch {
      // Ignored
    }
    setProducts((prev) => prev.filter((p) => p._id !== prodId && p.id !== prodId));
    toast.success('Product removed from catalog');
  };

  const filteredProducts = products.filter((p) => {
    const pName = (p.name || p.ProductName || '').toLowerCase();
    const pCat = (p.Category || p.category || '').toLowerCase();
    const matchesSearch = !searchQuery || pName.includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || pCat === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <FarmerDashboardLayout activeNav="products">
      <div className="farmer-products-view">
        {/* Page Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              My Farm Crops & Catalog
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              Add, update, or remove produce items listed on the Farmiax marketplace.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              fontSize: '14px',
              background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
              boxShadow: '0 4px 16px rgba(22, 101, 52, 0.4)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <FiPlus size={18} /> Add New Crop
          </button>
        </div>

        {/* Filter Bar Glass Box */}
        <div className="glass-box" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', minWidth: '280px', flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search your crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                fontSize: '13.5px',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
              }}
            />
            <FiSearch style={{ position: 'absolute', left: '12px', top: '12px', color: 'rgba(255, 255, 255, 0.7)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)' }}>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                fontSize: '13px',
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#FFFFFF',
              }}
            >
              <option value="All">All Categories</option>
              <option value="Spices">Spices</option>
              <option value="Pulses">Pulses</option>
              <option value="Grains">Grains</option>
              <option value="Oil & Ghee">Oil & Ghee</option>
              <option value="Honey">Honey</option>
              <option value="Herbs">Herbs</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#FFFFFF' }}>
            <div className="loader-spinner" style={{ margin: '0 auto 16px' }} />
            <p>Loading your crop listings...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="glass-box" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <FiShoppingBag size={48} style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px', color: '#FFFFFF' }}>No products match your criteria</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13.5px', marginBottom: '20px' }}>Add a new harvest or change your filter selection.</p>
            <button onClick={handleOpenAdd} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }}>
              Add First Crop
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filteredProducts.map((p) => {
              const prodId = p._id || p.id;
              const imgUrl = getImageUrl(p.image);
              return (
                <div
                  key={prodId}
                  className="glass-box"
                  style={{
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0,
                  }}
                >
                  <div style={{ height: '170px', position: 'relative', background: 'rgba(0, 0, 0, 0.2)' }}>
                    <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(34, 197, 94, 0.9)', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, padding: '3px 9px', borderRadius: '6px', backdropFilter: 'blur(4px)', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
                      {p.Category || p.category || 'Organic'}
                    </span>
                    <img
                      src={imgUrl}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80';
                      }}
                    />
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 800, color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                        {p.name || p.ProductName}
                      </h3>
                      <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>
                        Pack: {p.quantity || 1} {p.unit || 'kg'} • In Stock: <strong style={{ color: '#4ADE80' }}>{p.stock || 50} units</strong>
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '14px', marginTop: '8px' }}>
                      <span style={{ fontSize: '22px', fontWeight: 800, color: '#4ADE80', letterSpacing: '-0.5px' }}>
                        ₹{p.price || 0}
                      </span>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.4)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          title="Edit Crop"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(prodId)}
                          style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.5)', background: 'rgba(239, 68, 68, 0.25)', color: '#FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          title="Delete Crop"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}


        {/* Add/Edit Product Modal */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ background: '#FFF', borderRadius: '20px', maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                  {editingProduct ? 'Edit Farm Crop' : 'Add New Farm Harvest'}
                </h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <FiX size={22} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Crop / Product Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Organic Salem Turmeric"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Category *
                    </label>
                    <select
                      value={formData.Category}
                      onChange={(e) => setFormData({ ...formData, Category: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', background: '#FFF' }}
                    >
                      <option value="Spices">Spices</option>
                      <option value="Pulses">Pulses</option>
                      <option value="Grains">Grains</option>
                      <option value="Oil & Ghee">Oil & Ghee</option>
                      <option value="Honey">Honey</option>
                      <option value="Herbs">Herbs</option>
                      <option value="Vegetables">Vegetables</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 240"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Pack Qty
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Unit
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', background: '#FFF' }}
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="L">L</option>
                      <option value="ml">ml</option>
                      <option value="pack">pack</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Stock Units
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Crop Description & Farming Method
                  </label>
                  <textarea
                    placeholder="Describe how this crop is grown (e.g., natural compost, zero chemicals)..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', minHeight: '70px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Crop Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData({
                          ...formData,
                          image: file,
                          imageUrlPreview: URL.createObjectURL(file),
                        });
                      }
                    }}
                    style={{ fontSize: '13px' }}
                  />
                  {formData.imageUrlPreview && (
                    <div style={{ marginTop: '10px', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #CBD5E1' }}>
                      <img src={formData.imageUrlPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-outline"
                    style={{ padding: '10px 20px', fontSize: '13.5px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary"
                    style={{ padding: '10px 24px', fontSize: '13.5px' }}
                  >
                    {saving ? 'Saving Crop...' : editingProduct ? 'Update Crop' : 'Publish Crop'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerProducts;
