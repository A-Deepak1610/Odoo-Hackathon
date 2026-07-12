import React from "react";
import { Download, BarChart3, LineChart } from "lucide-react";

const Reports = () => {
  const statsCards = [
    {
      label: "Total Assets Value",
      value: "$2.4M",
      subtitle: "Organization-wide",
      color: "#1e3a8a",
      bg: "#eff6ff",
    },
    {
      label: "Maintenance Spend",
      value: "$84K",
      subtitle: "YTD",
      color: "#dc2626",
      bg: "#fef2f2",
    },
    {
      label: "Utilization Rate",
      value: "67%",
      subtitle: "Average across assets",
      color: "#16a34a",
      bg: "#ecfdf5",
    },
    {
      label: "ROI",
      value: "156%",
      subtitle: "Asset lifecycle efficiency",
      color: "#7c3aed",
      bg: "#f3e8ff",
    },
  ];

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
            Reports & Analytics
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Gain insights into asset utilization, costs, and departmental
            distribution.
          </p>
        </div>
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
          Export All Reports
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

      {/* ── CHARTS (2-col) ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
        }}
      >
        {/* Bar Chart */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#1e293b",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <BarChart3 size={16} color="#1e3a8a" />
              Assets by Department
            </h3>
            <button
              style={{
                fontSize: "12px",
                color: "#64748b",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Export CSV
            </button>
          </div>
          <div
            style={{
              height: "240px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "8px",
              padding: "8px 0 16px 0",
              borderLeft: "1px solid #e2e8f0",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            {[120, 340, 210, 450, 90].map((val, i) => {
              const maxHeight = 450;
              const height = (val / maxHeight) * 100;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${height}%`,
                    background: "#3b82f6",
                    borderRadius: "4px 4px 0 0",
                    transition: "background 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#2563eb")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "#3b82f6")
                  }
                  title={`${val} assets`}
                />
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "8px",
              fontSize: "11px",
              color: "#64748b",
            }}
          >
            {["HR", "Eng", "Mktg", "IT", "Sales"].map((dept) => (
              <span key={dept}>{dept}</span>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#1e293b",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <LineChart size={16} color="#16a34a" />
              Maintenance Costs (YTD)
            </h3>
            <button
              style={{
                fontSize: "12px",
                color: "#64748b",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Export CSV
            </button>
          </div>
          <div
            style={{
              height: "240px",
              position: "relative",
              padding: "8px 0 16px 0",
              borderLeft: "1px solid #e2e8f0",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <svg
              style={{ width: "100%", height: "100%" }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
                points="0,80 20,70 40,75 60,40 80,50 100,20"
              />
              {[0, 20, 40, 60, 80, 100].map((x, i) => (
                <circle
                  key={x}
                  cx={x}
                  cy={[80, 70, 75, 40, 50, 20][i]}
                  r="1.5"
                  fill="#16a34a"
                />
              ))}
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "8px",
              fontSize: "11px",
              color: "#64748b",
            }}
          >
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
