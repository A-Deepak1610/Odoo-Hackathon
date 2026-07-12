import React, { useState, useEffect } from "react";
import { Search, Download, Plus, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "../../auth";
import { apiFetch } from "../../../services/api";

const Assets = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const res = await apiFetch('/api/v1/assets');
        const result = await res.json();
        if (res.ok && result.success) {
          setAssets(result.data);
        } else {
          setError(result.message || 'Failed to load assets.');
        }
      } catch (err) {
        setError('Failed to connect to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

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

      {/* --- ADD/EDIT MODAL --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Asset' : 'Register New Asset'}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleSave}>Save Asset</Button>
          </>
        }
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
                    <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", textAlign: "center" }}>Custodian</th>
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
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assets;
