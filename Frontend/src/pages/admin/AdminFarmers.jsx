import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/admin/AdminDashboardLayout';
import adminService from '../../services/adminService';
import { getImageUrl } from '../../utils/helpers';
import {
  FiSearch, FiUsers, FiMapPin, FiPhone, FiMail,
  FiCheckCircle, FiXCircle, FiRefreshCw, FiEye, FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/admin.css';

const AdminFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllFarmers();
      const list = Array.isArray(data) ? data : (data?.data || []);
      setFarmers(list);
      setFilteredFarmers(list);
    } catch (err) {
      toast.error('Failed to load registered farmers directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  useEffect(() => {
    let result = farmers;
    if (statusFilter !== 'All') {
      result = result.filter(
        (f) => (f.farmeractive || '').toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.fullName?.toLowerCase().includes(q) ||
          f.email?.toLowerCase().includes(q) ||
          f.phone?.toLowerCase().includes(q) ||
          f.City?.toLowerCase().includes(q) ||
          f.State?.toLowerCase().includes(q)
      );
    }
    setFilteredFarmers(result);
  }, [search, statusFilter, farmers]);

  const activeCount = farmers.filter((f) => (f.farmeractive || '').toLowerCase() === 'active').length;
  const inactiveCount = farmers.length - activeCount;

  return (
    <AdminDashboardLayout activeNav="farmers">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF' }}>
            Registered Farmers Registry
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
            Manage agricultural producers, account statuses, and regional producer networks.
          </p>
        </div>

        <button
          onClick={fetchFarmers}
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
          <FiRefreshCw className={loading ? 'spin-icon' : ''} /> Reload Farmers
        </button>
      </div>

      {/* Summary KPI Pills */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', flex: 1, minWidth: '180px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Total Registered</span>
          <h3 style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: 900, color: '#FFFFFF' }}>{farmers.length}</h3>
        </div>
        <div style={{ padding: '14px 20px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: '12px', flex: 1, minWidth: '180px' }}>
          <span style={{ fontSize: '12px', color: '#86EFAC', fontWeight: 700 }}>Active Verified</span>
          <h3 style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: 900, color: '#4ADE80' }}>{activeCount}</h3>
        </div>
        <div style={{ padding: '14px 20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '12px', flex: 1, minWidth: '180px' }}>
          <span style={{ fontSize: '12px', color: '#FCA5A5', fontWeight: 700 }}>Inactive / Deactivated</span>
          <h3 style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: 900, color: '#F87171' }}>{inactiveCount}</h3>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="admin-glass-box" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
          <input
            type="text"
            placeholder="Search by farmer name, email, phone, city or state..."
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

        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Active', 'Inactive'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: statusFilter === st ? '#4ADE80' : 'rgba(255,255,255,0.15)',
                background: statusFilter === st ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                color: statusFilter === st ? '#4ADE80' : 'rgba(255,255,255,0.8)',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Farmers Table */}
      <div className="admin-glass-box" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            Loading registered farmers...
          </div>
        ) : filteredFarmers.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            No farmers match the selected search criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Farmer Details</th>
                  <th>Contact Info</th>
                  <th>Location & District</th>
                  <th>Verification Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.map((farmer) => {
                  const isActive = (farmer.farmeractive || '').toLowerCase() === 'active';
                  const initials = (farmer.fullName || 'Farmer').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <tr key={farmer._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {farmer.avatar && farmer.avatar !== 'Not Photo' ? (
                            <img
                              src={getImageUrl(farmer.avatar)}
                              alt={farmer.fullName}
                              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                            />
                          ) : null}
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1D4533', color: '#86EFAC', display: farmer.avatar && farmer.avatar !== 'Not Photo' ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>
                            {initials}
                          </div>
                          <div>
                            <strong style={{ fontSize: '14px', color: '#FFFFFF', display: 'block' }}>{farmer.fullName}</strong>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>PinCode: {farmer.PinCode || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '13px' }}>
                          <span style={{ display: 'block', color: 'rgba(255,255,255,0.9)' }}>{farmer.phone || 'N/A'}</span>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{farmer.email}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
                          <FiMapPin size={13} style={{ color: '#4ADE80' }} />
                          <span>{[farmer.City, farmer.State].filter(Boolean).join(', ') || 'India'}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
                          {isActive ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
                          {farmer.farmeractive || 'Active'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedFarmer(farmer)}
                          className="admin-action-btn admin-btn-view"
                        >
                          <FiEye size={13} /> View Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Farmer Dossier Modal */}
      {selectedFarmer && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedFarmer(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFF' }}>Farmer Profile Dossier</h3>
              <button onClick={() => setSelectedFarmer(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 900, fontSize: '20px' }}>
                {(selectedFarmer.fullName || 'RK').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '18px', color: '#FFF' }}>{selectedFarmer.fullName}</h4>
                <span className={`admin-status-badge ${(selectedFarmer.farmeractive || '').toLowerCase() === 'active' ? 'status-active' : 'status-inactive'}`}>
                  Status: {selectedFarmer.farmeractive || 'Active'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13.5px', color: 'rgba(255,255,255,0.9)' }}>
              <div><strong>Primary Email:</strong> <span style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>{selectedFarmer.email}</span></div>
              <div><strong>Phone Contact:</strong> <span style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>{selectedFarmer.phone}</span></div>
              <div><strong>City / District:</strong> <span style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>{selectedFarmer.City}</span></div>
              <div><strong>State / Province:</strong> <span style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>{selectedFarmer.State}</span></div>
              <div><strong>Postal PinCode:</strong> <span style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>{selectedFarmer.PinCode}</span></div>
              <div><strong>Role Level:</strong> <span style={{ color: '#4ADE80', display: 'block', textTransform: 'uppercase', fontWeight: 800 }}>{selectedFarmer.role}</span></div>
              <div style={{ gridColumn: '1 / -1' }}><strong>Registered Address:</strong> <span style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>{selectedFarmer.address || 'Address provided upon harvest dispatch'}</span></div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedFarmer(null)}
                style={{ padding: '10px 20px', borderRadius: '8px', background: '#22C55E', border: 'none', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminFarmers;
