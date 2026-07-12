import React, { useState } from "react";
import { Search, Download, Plus, MoreHorizontal } from "lucide-react";

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const statsCards = [
    {
      label: "Total Assets",
      value: "7,342",
      subtitle: "Across all departments",
      color: "#1e3a8a",
      bg: "#eff6ff",
    },
    {
      label: "Available",
      value: "2,156",
      subtitle: "Ready for allocation",
      color: "#16a34a",
      bg: "#ecfdf5",
    },
    {
      label: "Allocated",
      value: "4,891",
      subtitle: "Currently in use",
      color: "#0891b2",
      bg: "#ecfeff",
    },
    {
      label: "Under Maintenance",
      value: "295",
      subtitle: "Scheduled returns",
      color: "#b45309",
      bg: "#fef3c7",
    },
  ];

  const mockAssets = [
    {
      id: "AST-1042",
      name: 'MacBook Pro 16"',
      category: "Laptops",
      department: "Engineering",
      location: "HQ - Floor 3",
      status: "Allocated",
    },
    {
      id: "AST-1043",
      name: "Dell XPS 15",
      category: "Laptops",
      department: "Marketing",
      location: "HQ - Floor 2",
      status: "Available",
    },
    {
      id: "AST-1044",
      name: "Projector A1",
      category: "A/V Equipment",
      department: "Facilities",
      location: "Conf Room A",
      status: "Reserved",
    },
    {
      id: "AST-1045",
      name: "Delivery Van #4",
      category: "Vehicles",
      department: "Logistics",
      location: "Warehouse North",
      status: "Under Maintenance",
    },
    {
      id: "AST-1046",
      name: "iPad Pro",
      category: "Tablets",
      department: "Sales",
      location: "HQ - Floor 1",
      status: "Lost",
    },
  ];

  const getStatusColor = (status) => {
    if (status === "Allocated") return { bg: "#dcfce7", text: "#15803d" };
    if (status === "Available") return { bg: "#dbeafe", text: "#1d4ed8" };
    if (status === "Reserved") return { bg: "#fef3c7", text: "#b45309" };
    if (status === "Under Maintenance")
      return { bg: "#fef3c7", text: "#b45309" };
    if (status === "Lost") return { bg: "#fef2f2", text: "#dc2626" };
    return { bg: "#f1f5f9", text: "#475569" };
  };

  const filtered = mockAssets.filter(
    (asset) =>
      (searchTerm === "" ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.id.includes(searchTerm)) &&
      (categoryFilter === "All" || asset.category === categoryFilter) &&
      (statusFilter === "All" || asset.status === statusFilter),
  );

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
            Asset Registry
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            View and manage all organization assets across departments and
            locations.
          </p>
        </div>
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
      </div>

      {/* ── STAT CARDS (4-col) ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {statsCards.map((stat, i) => (
          <div
            key={i}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
                fontWeight: 500,
                marginBottom: "4px",
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: "2px",
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>
              {stat.subtitle}
            </div>
          </div>
        ))}
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
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "#1e293b",
            margin: "0 0 16px 0",
          }}
        >
          Asset Directory
        </h2>
        <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>
          {filtered.length} assets total
        </p>

        {/* Search & Filters */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginBottom: "16px",
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
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "36px",
                paddingRight: "12px",
                height: "36px",
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
            <option>All Categories</option>
            <option>Laptops</option>
            <option>A/V Equipment</option>
            <option>Vehicles</option>
            <option>Tablets</option>
            <option>Furniture</option>
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
            <option>All Statuses</option>
            <option>Available</option>
            <option>Allocated</option>
            <option>Reserved</option>
            <option>Under Maintenance</option>
            <option>Lost</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 0",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Tag
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Category
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Department
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Location
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "10px 12px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => {
                const statusColor = getStatusColor(asset.status);
                return (
                  <tr
                    key={asset.id}
                    style={{
                      borderBottom: "1px solid #e2e8f0",
                      transition: "background 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#f8fafc")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "12px 0",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#1e3a8a",
                        fontFamily: "monospace",
                      }}
                    >
                      {asset.id}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#1e293b",
                      }}
                    >
                      {asset.name}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontSize: "13px",
                        color: "#64748b",
                      }}
                    >
                      {asset.category}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontSize: "13px",
                        color: "#64748b",
                      }}
                    >
                      {asset.department}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontSize: "13px",
                        color: "#64748b",
                      }}
                    >
                      {asset.location}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          background: statusColor.bg,
                          color: statusColor.text,
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 600,
                          display: "inline-block",
                        }}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "center", padding: "12px" }}>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#94a3b8",
                          padding: "4px",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.color = "#1e293b")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.color = "#94a3b8")
                        }
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Assets;
