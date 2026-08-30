import React, { useState, useEffect } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import productService from '../../services/productService';
import {
  FiTruck, FiPlus, FiMinus, FiDownload, FiEdit2,
  FiTrash2, FiSearch, FiCheck, FiX, FiAlertTriangle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/farmer-dashboard.css';
import '../../styles/farmer-inventory.css';

const FarmerInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const res = await productService.getFarmerProducts();
        const prods = Array.isArray(res) ? res : (res?.data || []);
        const mapped = prods.map((p, idx) => ({
          id: p._id || p.id || `inv-${idx}`,
          name: p.name || p.ProductName || 'Organic Item',
          sku: `SKU-${String(p._id || idx).slice(-4).toUpperCase()}`,
          stock: Number(p.stock || p.quantity || 0),
          minStock: 20,
          unit: `${p.quantity || 1} ${p.unit || 'kg'}`,
          price: p.price || p.Price || 0,
          autoRestock: true,
        }));
        setInventory(mapped);
      } catch {
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleStockAdjust = (id, change) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + change);
          return { ...item, stock: newStock };
        }
        return item;
      })
    );
    toast.success('Stock adjusted! 📦');
  };

  const toggleAutoRestock = (id) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = !item.autoRestock;
          toast.success(`Auto-restock ${updated ? 'Enabled' : 'Disabled'}`);
          return { ...item, autoRestock: updated };
        }
        return item;
      })
    );
  };

  const handleExportCSV = () => {
    const headers = ['Product Name', 'SKU', 'Stock Level', 'Min Stock Limit', 'Unit', 'Price (INR)', 'Auto Restock'];
    const rows = inventory.map((i) => [
      `"${i.name}"`,
      i.sku,
      i.stock,
      i.minStock,
      i.unit,
      i.price,
      i.autoRestock ? 'YES' : 'NO',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Farmiax_Inventory_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    toast.success('Inventory CSV exported! 📊');
  };

  const getStockStatus = (stock, minStock) => {
    if (stock <= 0) return { label: 'Out of Stock', class: 'status-cancelled' };
    if (stock <= minStock) return { label: 'Low Stock Alert', class: 'status-packed' };
    return { label: 'Healthy In Stock', class: 'status-delivered' };
  };

  const filteredInventory = inventory.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = inventory.filter((i) => i.stock <= i.minStock).length;

  return (
    <FarmerDashboardLayout activeNav="inventory">
      <div className="farmer-inventory-view">
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div className="page-header-box">
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              Crop Inventory & Stock Control
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              Monitor warehouse crop stock levels, set low-stock triggers, and export CSV reports.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleExportCSV}
              className="btn btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                fontSize: '13.5px',
                background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
                boxShadow: '0 4px 16px rgba(22, 101, 52, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                borderRadius: '10px',
              }}
            >
              <FiDownload size={15} /> Export CSV Report
            </button>
          </div>
        </div>

        {/* Low Stock Warning Alert if any */}
        {lowStockCount > 0 && (
          <div style={{ background: 'rgba(245, 158, 11, 0.25)', border: '1px solid rgba(251, 191, 36, 0.5)', backdropFilter: 'blur(12px)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: '#FEF08A' }}>
            <FiAlertTriangle size={24} />
            <div>
              <strong style={{ fontSize: '14.5px', color: '#FFFFFF' }}>{lowStockCount} items have fallen below minimum harvest limits</strong>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}>Consider restocking from the upcoming harvesting cycle to prevent out-of-stock cancellations.</p>
            </div>
          </div>
        )}

        {/* Search & Actions Bar Glass Box */}
        <div className="glass-box" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ position: 'relative', minWidth: '280px', flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search by crop name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                fontSize: '13.5px',
                outline: 'none',
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
              }}
            />
            <FiSearch style={{ position: 'absolute', left: '12px', top: '12px', color: 'rgba(255, 255, 255, 0.7)' }} />
          </div>

          <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
            Showing {filteredInventory.length} inventory records
          </span>
        </div>

        {/* Inventory Glass Table Box */}
        <div className="glass-box" style={{ padding: '0', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#FFFFFF' }}>
              <div className="loader-spinner" style={{ margin: '0 auto 16px' }} />
              <p>Loading inventory data...</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="farmer-table">
                <thead>
                  <tr>
                    <th>CROP NAME</th>
                    <th>SKU</th>
                    <th>CURRENT STOCK</th>
                    <th>STATUS</th>
                    <th>AUTO-RESTOCK</th>
                    <th style={{ textAlign: 'right' }}>QUICK ADJUST</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => {
                    const status = getStockStatus(item.stock, item.minStock);
                    return (
                      <tr key={item.id}>
                        <td>
                          <strong style={{ display: 'block', fontSize: '14.5px', color: '#FFFFFF' }}>{item.name}</strong>
                          <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.75)' }}>Pack: {item.unit} • ₹{item.price}</span>
                        </td>
                        <td style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
                          {item.sku}
                        </td>
                        <td>
                          <span style={{ fontSize: '17px', fontWeight: 800, color: item.stock <= item.minStock ? '#F87171' : '#4ADE80' }}>
                            {item.stock}
                          </span>
                          <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.75)', marginLeft: '4px' }}>units</span>
                        </td>
                        <td>
                          <span className={`status-pill ${status.class}`}>
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => toggleAutoRestock(item.id)}
                            style={{
                              padding: '4px 12px',
                              borderRadius: '8px',
                              border: '1px solid',
                              borderColor: item.autoRestock ? 'rgba(74, 222, 128, 0.6)' : 'rgba(255, 255, 255, 0.3)',
                              background: item.autoRestock ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                              color: item.autoRestock ? '#86EFAC' : 'rgba(255, 255, 255, 0.7)',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {item.autoRestock ? 'ON' : 'OFF'}
                          </button>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              onClick={() => handleStockAdjust(item.id, -10)}
                              style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.4)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Subtract 10 units"
                            >
                              <FiMinus size={14} />
                            </button>
                            <button
                              onClick={() => handleStockAdjust(item.id, 10)}
                              style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.4)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Add 10 units"
                            >
                              <FiPlus size={14} />
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
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerInventory;





