import React from "react";
import { ClipboardCheck, Plus, MoreHorizontal } from "lucide-react";

const Audit = () => {
  const statsCards = [
    {
      label: "Total Audits",
      value: "24",
      subtitle: "Lifetime",
      color: "#1e3a8a",
      bg: "#eff6ff",
    },
    {
      label: "In Progress",
      value: "1",
      subtitle: "Active cycle",
      color: "#b45309",
      bg: "#fef3c7",
    },
    {
      label: "Compliance",
      value: "98%",
      subtitle: "Pass rate",
      color: "#16a34a",
      bg: "#ecfdf5",
    },
    {
      label: "Discrepancies",
      value: "2",
      subtitle: "Found",
      color: "#dc2626",
      bg: "#fef2f2",
    },
  ];

  const mockAudits = [
    {
      id: "AUD-2024-Q1",
      name: "Q1 Comprehensive Asset Audit",
      scope: "All Departments",
      auditors: "Jane Smith, Tech Team",
      status: "Completed",
      discrepancies: 2,
    },
    {
      id: "AUD-2024-Q2",
      name: "Q2 IT Infrastructure Audit",
      scope: "IT Department",
      auditors: "External Auditor",
      status: "In Progress",
      discrepancies: 0,
    },
    {
      id: "AUD-2024-Q3",
      name: "Q3 Vehicle Fleet Check",
      scope: "Logistics",
      auditors: "Sarah Jenkins",
      status: "Pending",
      discrepancies: 0,
    },
  ];

  const getStatusColor = (status) => {
    if (status === "Completed") return { bg: "#dcfce7", text: "#15803d" };
    if (status === "In Progress") return { bg: "#fef3c7", text: "#b45309" };
    if (status === "Pending") return { bg: "#dbeafe", text: "#1d4ed8" };
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
            Asset Audits
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Manage audit cycles, track discrepancies, and ensure compliance.
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
          New Audit Cycle
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

      {/* ── AUDITS TABLE ─── */}
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
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ClipboardCheck size={16} color="#1e3a8a" />
          Audit Cycles
        </h2>

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
                  Audit ID
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
                  Audit Name
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
                  Scope
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
                  Auditors
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
                  Discrepancies
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
              {mockAudits.map((audit, idx) => {
                const statusColor = getStatusColor(audit.status);
                return (
                  <tr
                    key={audit.id}
                    style={{
                      borderBottom:
                        idx < mockAudits.length - 1
                          ? "1px solid #e2e8f0"
                          : "none",
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
                        fontFamily: "monospace",
                        color: "#64748b",
                      }}
                    >
                      {audit.id}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#1e293b",
                      }}
                    >
                      {audit.name}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontSize: "13px",
                        color: "#64748b",
                      }}
                    >
                      {audit.scope}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontSize: "13px",
                        color: "#64748b",
                      }}
                    >
                      {audit.auditors}
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
                        {audit.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background:
                            audit.discrepancies > 0 ? "#fef2f2" : "#f1f5f9",
                          color:
                            audit.discrepancies > 0 ? "#dc2626" : "#64748b",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {audit.discrepancies}
                      </div>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
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

export default Audit;
