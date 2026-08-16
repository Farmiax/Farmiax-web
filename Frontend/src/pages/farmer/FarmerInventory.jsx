import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import '../../styles/farmer-dashboard.css';
import '../../styles/farmer-inventory.css';

const FarmerInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const toggleAutoRestock = (index) => {
    const newInventory = [...inventory];
    newInventory[index].autoRestock = !newInventory[index].autoRestock;
    setInventory(newInventory);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditForm({ ...inventory[index] });
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const newInventory = inventory.filter((_, i) => i !== index);
      setInventory(newInventory);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Product Name', 'SKU', 'Stock', 'Unit', 'Price', 'Status', 'Auto-Restock'],
      ...inventory.map(item => [item.name, item.sku, item.stock, item.unit, `₹${item.price}`, item.status, item.autoRestock ? 'ON' : 'OFF'])
    ].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'inventory_export.csv';
    link.click();
  };

  const handleSaveEdit = () => {
    const newInventory = [...inventory];
    const stockVal = Number(editForm.stock);
    const minStockVal = Number(editForm.minStock || 10);

    let newStatus = editForm.status;
    if (stockVal <= 0) {
      newStatus = '🔴 Out of Stock';
    } else if (stockVal <= minStockVal) {
      newStatus = '🟠 Low Stock';
    } else {
      newStatus = '🟢 In Stock';
    }

    newInventory[editingIndex] = { ...editForm, stock: stockVal, minStock: minStockVal, status: newStatus };
    setInventory(newInventory);
    setEditingIndex(null);
  };

  const handleStockChange = (amount) => {
    setEditForm(prev => ({
      ...prev,
      stock: Math.max(0, Number(prev.stock) + amount)
    }));
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
          <Link to="/farmer/products" className="farmer-nav-item">
            <i className="ri-landscape-line"></i> Products
          </Link>
          <Link to="/farmer/inventory" className="farmer-nav-item active">
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
        <main className="farmer-content" style={{ padding: '24px 32px', minHeight: 'calc(100vh - 72px)', position: 'relative' }}>

          <div className="inventory-container">
            <h1 className="inventory-title">Inventory Management</h1>

            <div className="inventory-actions-top">
              <div className="inventory-search">
                <i className="ri-search-line"></i>
                <input type="text" placeholder="Search..." />
              </div>
            </div>

            <div className="inventory-table-wrapper">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th style={{ textAlign: 'right' }}>Stock</th>
                    <th>Unit</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                    <th>Status</th>
                    <th>Auto-Restock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.sku}</td>
                      <td style={{ textAlign: 'right' }}>{item.stock}</td>
                      <td>{item.unit}</td>
                      <td style={{ textAlign: 'right' }}>₹{item.price}</td>
                      <td>{item.status}</td>
                      <td>
                        <div
                          className={`toggle-switch ${item.autoRestock ? 'on' : 'off'}`}
                          onClick={() => toggleAutoRestock(idx)}
                        >
                          <div className="toggle-circle"></div>
                        </div>
                      </td>
                      <td>
                        <div className="action-icons">
                          <i className="ri-pencil-fill" style={{ cursor: 'pointer' }} onClick={() => handleEdit(idx)}></i>
                          <i className="ri-delete-bin-line" style={{ cursor: 'pointer' }} onClick={() => handleDelete(idx)}></i>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="inventory-bottom-bar">
              <button className="btn-export" onClick={handleExport}>Export Data</button>
            </div>
          </div>

          {/* Edit Modal Overlay */}
          {editingIndex !== null && editForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>🌾 What the farmer can do (Edit Product)</h2>

                <div className="form-group">
                  <label>Product Name</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>SKU</label>
                  <input type="text" value={editForm.sku} readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Available Quantity</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button className="stock-btn" onClick={() => handleStockChange(-1)}>-</button>
                      <input type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} style={{ width: '80px', textAlign: 'center' }} />
                      <button className="stock-btn" onClick={() => handleStockChange(1)}>+</button>
                    </div>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Unit</label>
                    <select value={editForm.unit} onChange={e => setEditForm({ ...editForm, unit: e.target.value })}>
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="litre">litre</option>
                      <option value="pack">pack</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Current Selling Price (₹)</label>
                  <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Minimum Stock (for Low-stock alerts)</label>
                  <input type="number" value={editForm.minStock} onChange={e => setEditForm({ ...editForm, minStock: e.target.value })} />
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>Show warning when quantity goes below threshold.</small>
                </div>

                <div className="modal-actions">
                  <button className="btn-cancel" onClick={() => setEditingIndex(null)}>Cancel</button>
                  <button className="btn-save" onClick={handleSaveEdit}>Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FarmerInventory;
