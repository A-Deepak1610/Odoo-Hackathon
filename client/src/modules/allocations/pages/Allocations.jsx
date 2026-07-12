import React, { useState } from "react";
import { ArrowRightLeft, AlertTriangle, Plus } from "lucide-react";

const Allocations = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const statsCards = [
    {
      label: "Total Allocations",
      value: "3,812",
      subtitle: "Current active",
      color: "#1e3a8a",
      bg: "#eff6ff",
    },
    {
      label: "Pending Returns",
      value: "24",
      subtitle: "Overdue by 3+ days",
      color: "#dc2626",
      bg: "#fef2f2",
    },
    {
      label: "Transfer Requests",
      value: "12",
      subtitle: "Awaiting approval",
      color: "#b45309",
      bg: "#fef3c7",
    },
    {
      label: "Allocation Success",
      value: "98.5%",
      subtitle: "On-time delivery",
      color: "#16a34a",
      bg: "#ecfdf5",
    },
  ];

  const mockAllocations = [
    {
      id: "AL-901",
      asset: 'MacBook Pro 16" (AST-1042)',
      assignedTo: "Sarah Jenkins",
      assignedBy: "Jane Smith",
      date: "Oct 12, 2023",
      status: "Allocated",
    },
    {
      id: "AL-902",
      asset: "Dell XPS 15 (AST-1043)",
      assignedTo: "Mike Ross",
      assignedBy: "Jane Smith",
      date: "Nov 05, 2023",
      status: "Pending Return",
    },
    {
      id: "AL-903",
      asset: "Delivery Van #4 (AST-1045)",
      assignedTo: "Logistics Team A",
      assignedBy: "Admin",
      date: "Jan 15, 2024",
      status: "Allocated",
    },
  ];

  const getStatusColor = (status) => {
    if (status === "Allocated") return { bg: "#dcfce7", text: "#15803d" };
    if (status === "Pending Return") return { bg: "#fef3c7", text: "#b45309" };
    return { bg: "#f1f5f9", text: "#475569" };
  };

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
            Allocation & Transfer
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Manage asset assignments and handle transfer requests between
            employees.
          </p>
        </div>
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
          New Allocation
        </button>
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
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
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

      {/* ── MAIN CONTENT (2:1 split) ─── */}
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}
      >
        {/* Left column — allocations table */}
        <div>
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#1e293b",
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ArrowRightLeft size={16} color="#1e3a8a" />
              Current Allocations
            </h3>

            {/* Search */}
            <div style={{ marginBottom: "16px", position: "relative" }}>
              <input
                type="text"
                placeholder="Search allocations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "0 12px",
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

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 0",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      Asset
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      Assigned To
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockAllocations.map((row) => {
                    const statusColor = getStatusColor(row.status);
                    return (
                      <tr
                        key={row.id}
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
                            color: "#64748b",
                            fontFamily: "monospace",
                          }}
                        >
                          {row.id}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#1e293b",
                          }}
                        >
                          {row.asset}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: "13px",
                            color: "#1e293b",
                          }}
                        >
                          {row.assignedTo}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: "12px",
                            color: "#64748b",
                          }}
                        >
                          {row.date}
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
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column — conflict resolution */}
        <div>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#1e293b",
              margin: "0 0 16px 0",
            }}
          >
            Conflict Resolution
          </h2>

          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #fed7aa",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#fef3c7",
                padding: "16px",
                borderBottom: "1px solid #fed7aa",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <AlertTriangle
                color="#b45309"
                size={20}
                style={{ marginTop: "2px", flexShrink: 0 }}
              />
              <div>
                <h4
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#92400e",
                    marginBottom: "4px",
                    margin: 0,
                  }}
                >
                  Allocation Conflict
                </h4>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#b45309",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  An employee is requesting an asset currently allocated to
                  someone else.
                </p>
              </div>
            </div>
            <div
              style={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    color: "#64748b",
                    fontWeight: 600,
                    letterSpacing: "0.4px",
                    marginBottom: "6px",
                  }}
                >
                  Requested Asset
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  Projector A1 (AST-1044)
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    color: "#64748b",
                    fontWeight: 600,
                    letterSpacing: "0.4px",
                    marginBottom: "6px",
                  }}
                >
                  Currently Held By
                </div>
                <div style={{ fontSize: "13px", color: "#1e293b" }}>
                  Mike Ross (Marketing)
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    color: "#64748b",
                    fontWeight: 600,
                    letterSpacing: "0.4px",
                    marginBottom: "6px",
                  }}
                >
                  Requested By
                </div>
                <div style={{ fontSize: "13px", color: "#1e293b" }}>
                  Sarah Jenkins (Engineering)
                </div>
              </div>
              <div
                style={{
                  paddingTop: "8px",
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <button
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#1e3a8a",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Approve Transfer
                </button>
                <button
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "white",
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#dc2626";
                    e.currentTarget.style.color = "#dc2626";
                    e.currentTarget.style.background = "#fef2f2";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.color = "#64748b";
                    e.currentTarget.style.background = "white";
                  }}
                >
                  Deny Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allocations;
