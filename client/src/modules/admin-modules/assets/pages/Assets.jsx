import React, { useState, useEffect } from 'react';
import { Search, Download, Plus, Pencil, Trash2, Box, Package, RefreshCw, Wrench, Loader2 } from 'lucide-react';
import PageHeader from '../../../../shared/components/PageHeader';
import DataTable from '../../../../shared/components/DataTable';
import StatusPill from '../../../../shared/components/StatusPill';
import StatCard from '../../../../shared/components/StatCard';
import Button from '../../../../shared/components/Button';
import Modal from '../../../../shared/components/Modal';
import { useAuth } from '../../../auth';
import { apiFetch } from '../../../../services/api';

// --- MOCK DATA ---
const initialAssets = [
  { id: 'AST-1042', name: 'MacBook Pro 16"', category: 'Laptops', department: 'Engineering', location: 'HQ - Floor 3', status: 'Allocated' },
  { id: 'AST-1043', name: 'Dell XPS 15', category: 'Laptops', department: 'Marketing', location: 'HQ - Floor 2', status: 'Available' },
  { id: 'AST-1044', name: 'Projector A1', category: 'A/V Equipment', department: 'Facilities', location: 'Conf Room A', status: 'Reserved' },
  { id: 'AST-1045', name: 'Delivery Van #4', category: 'Vehicles', department: 'Logistics', location: 'Warehouse North', status: 'Under Maintenance' },
  { id: 'AST-1046', name: 'iPad Pro', category: 'Tablets', department: 'Sales', location: 'HQ - Floor 1', status: 'Lost' },
];

const Assets = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Registration modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [newName, setNewName] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newSerial, setNewSerial] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newCondition, setNewCondition] = useState("Excellent");
  const [newShared, setNewShared] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      // Load assets
      const assetsRes = await apiFetch('/api/v1/assets');
      const assetsResult = await assetsRes.json();
      if (assetsRes.ok && assetsResult.success) {
        setAssets(assetsResult.data);
      } else {
        setError(assetsResult.message || 'Failed to load assets.');
      }

      // Load categories
      const catRes = await apiFetch('/api/v1/asset-categories');
      const catResult = await catRes.json();
      if (catRes.ok && catResult.success) {
        setCategoriesList(catResult.data);
      }
    } catch (err) {
      setError('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    setFormError("");
    
    if (!newName || !newTag || !newCategory) {
      setFormError("Name, Asset Tag, and Category are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch('/api/v1/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          assetTag: newTag,
          serialNumber: newSerial || undefined,
          categoryId: newCategory,
          condition: newCondition,
          location: newLocation || undefined,
          isSharedBookable: newShared
        })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        // Reload assets list
        await loadData();
        
        // Reset form
        setNewName("");
        setNewTag("");
        setNewSerial("");
        setNewCategory("");
        setNewLocation("");
        setNewCondition("Excellent");
        setNewShared(false);
        setShowCreateModal(false);
      } else {
        setFormError(result.message || "Failed to create asset.");
      }
    } catch (err) {
      setFormError("Network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAsset = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset? This cannot be undone.")) return;

    try {
      const res = await apiFetch(`/api/v1/assets/${id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setAssets(assets.filter(a => a.id !== id));
      } else {
        alert(result.message || "Failed to delete asset.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const getStatusColor = (status) => {
    if (status === "ALLOCATED") return { bg: "#dcfce7", text: "#15803d" };
    if (status === "AVAILABLE") return { bg: "#dbeafe", text: "#1d4ed8" };
    if (status === "RESERVED") return { bg: "#fef3c7", text: "#b45309" };
    if (status === "UNDER_MAINTENANCE" || status === "MAINTENANCE")
      return { bg: "#fff3cd", text: "#856404" };
    if (status === "LOST" || status === "RETIRED") return { bg: "#fef2f2", text: "#dc2626" };
    return { bg: "#f1f5f9", text: "#475569" };
  };

  const filtered = assets.filter(
    (asset) => {
      const matchesSearch = searchTerm === "" ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase());
      
      const catName = asset.category?.name || "Uncategorized";
      const matchesCategory = categoryFilter === "All" || catName === categoryFilter;
      
      const matchesStatus = statusFilter === "All" || asset.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    }
  );

  // Get unique categories from list
  const categories = ["All", ...new Set(assets.map(a => a.category?.name).filter(Boolean))];
  const statuses = ["All", ...new Set(assets.map(a => a.status).filter(Boolean))];

  // ── RENDER LOADING STATE ───
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        gap: '16px',
        fontFamily: 'Inter, sans-serif'
      }}>
        <Loader2 size={36} className="animate-spin" style={{ color: '#1e3a8a' }} />
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
          Retrieving asset catalog...
        </p>
      </div>
    );
  }

  // ── RENDER ERROR STATE ───
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ef4444',
          marginBottom: '16px'
        }}>
          <AlertTriangle size={28} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
          Unable to Load Assets
        </h3>
        <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '380px', margin: '0 0 20px 0' }}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const isEmployee = user?.role === 'EMPLOYEE';

  return (
    <div
      style={{
        padding: "24px 32px",
        maxWidth: "1400px",
        margin: "0 auto",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ── PAGE HEADER ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              margin: "0 0 8px 0",
              color: "#1e293b",
            }}
          >
            {isEmployee ? "My Assigned Assets" : "Asset Registry"}
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            {isEmployee 
              ? "View details and conditions of materials currently assigned to you."
              : "View and manage all organization assets across departments and locations."
            }
          </p>
        </div>
        {!isEmployee && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                background: "white",
                color: "#64748b",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Download size={16} />
              Export
            </button>
             <button
              onClick={() => setShowCreateModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                background: "#1e3a8a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Plus size={16} />
              Register Asset
            </button>
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ─── */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          padding: "20px",
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#1e293b",
              margin: 0,
            }}
          >
            Asset Directory
          </h2>
          <span style={{ fontSize: "13px", color: "#64748b" }}>
            {filtered.length} asset{filtered.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Search & Filters */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search by asset name or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "36px",
                paddingRight: "12px",
                height: "38px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                background: "#f8fafc",
                color: "#1e293b",
                fontSize: "13px",
                outline: "none",
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              background: "white",
              color: "#1e293b",
              fontSize: "13px",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
            }}
          >
            <option value="All">All Categories</option>
            {categories.filter(c => c !== "All").map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              background: "white",
              color: "#1e293b",
              fontSize: "13px",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
            }}
          >
            <option value="All">All Statuses</option>
            {statuses.filter(s => s !== "All").map(stat => (
              <option key={stat} value={stat}>{stat.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div style={{ padding: '36px 0', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
            No assets match your search parameters.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Tag ID</th>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Name</th>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Category</th>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Location</th>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Condition</th>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Status</th>
                  {!isEmployee && (
                    <>
                      <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", textAlign: "center" }}>Custodian</th>
                      <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", textAlign: "center" }}>Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((asset) => {
                  const statusColor = getStatusColor(asset.status);
                  return (
                    <tr
                      key={asset.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        transition: "background 0.2s",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td
                        style={{
                          padding: "12px 8px",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          color: "#1e3a8a",
                          fontFamily: "monospace",
                        }}
                      >
                        {asset.assetTag}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#0f172a",
                        }}
                      >
                        {asset.name}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          fontSize: "13px",
                          color: "#475569",
                        }}
                      >
                        {asset.category?.name || "General"}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          fontSize: "13px",
                          color: "#475569",
                        }}
                      >
                        {asset.location || "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          fontSize: "13px",
                          color: "#0f766e",
                          fontWeight: 500,
                        }}
                      >
                        {asset.condition}
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <span
                          style={{
                            background: statusColor.bg,
                            color: statusColor.text,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            display: "inline-block",
                            textTransform: "capitalize"
                          }}
                        >
                          {asset.status.toLowerCase().replace(/_/g, ' ')}
                        </span>
                      </td>
                      {!isEmployee && (
                        <>
                          <td
                            style={{
                              padding: "12px 8px",
                              fontSize: "13px",
                              color: "#475569",
                              textAlign: "center"
                            }}
                          >
                            {asset.currentEmployee?.name || "Unassigned"}
                          </td>
                          <td style={{ padding: "12px 8px", textAlign: "center" }}>
                            <button
                              onClick={() => handleDeleteAsset(asset.id)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "5px 10px",
                                backgroundColor: "#fef2f2",
                                color: "#dc2626",
                                border: "1px solid #fee2e2",
                                borderRadius: "6px",
                                fontSize: "11.5px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── CREATE ASSET MODAL ─── */}
      {showCreateModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            padding: "24px",
            width: "480px",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            fontFamily: "Inter, sans-serif"
          }}>
            <h3 style={{ fontSize: "17px", fontWeight: 600, margin: "0 0 16px 0", color: "#0f172a" }}>Register New Asset</h3>
            
            {formError && (
              <div style={{
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                marginBottom: "12px",
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                fontWeight: 500
              }}>{formError}</div>
            )}
            
            <form onSubmit={handleCreateAsset} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11.5px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Asset Name *</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required placeholder="e.g. MacBook Pro M3" style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "13px" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11.5px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Asset Tag *</label>
                  <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} required placeholder="e.g. AST-LPT-002" style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11.5px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Serial Number</label>
                  <input type="text" value={newSerial} onChange={(e) => setNewSerial(e.target.value)} placeholder="e.g. C02DXXXX" style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "13px" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11.5px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Category *</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "13px", height: "36px" }}>
                    <option value="">-- Select Category --</option>
                    {categoriesList.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11.5px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Condition</label>
                  <select value={newCondition} onChange={(e) => setNewCondition(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "13px", height: "36px" }}>
                    <option value="New">New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11.5px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Location</label>
                <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="e.g. HQ - Floor 3" style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "13px" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "4px 0" }}>
                <input type="checkbox" id="newShared" checked={newShared} onChange={(e) => setNewShared(e.target.checked)} style={{ cursor: "pointer" }} />
                <label htmlFor="newShared" style={{ fontSize: "13px", color: "#475569", fontWeight: 500, cursor: "pointer" }}>Make this asset shared/bookable by employees</label>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ padding: "8px 14px", backgroundColor: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ padding: "8px 14px", backgroundColor: "#1e3a8a", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  {submitting && <Loader2 size={12} className="animate-spin" />}
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
