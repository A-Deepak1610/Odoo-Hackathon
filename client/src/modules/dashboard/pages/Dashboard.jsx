import React from "react";
import {
  Box,
  ArrowRightLeft,
  Wrench,
  CalendarClock,
  ArrowLeftRight,
  RotateCcw,
  AlertTriangle,
  Plus,
  Activity,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const statsCards = [
    {
      icon: "lucide:box",
      label: "Assets Available",
      value: "1,245",
      subtitle: "4.2% increase",
      color: "#1e3a8a",
      bg: "#eff6ff",
    },
    {
      icon: "lucide:arrow-right-left",
      label: "Assets Allocated",
      value: "3,812",
      subtitle: "2.1% increase",
      color: "#16a34a",
      bg: "#ecfdf5",
    },
    {
      icon: "lucide:wrench",
      label: "Maintenance Today",
      value: "18",
      subtitle: "12% decrease",
      color: "#b45309",
      bg: "#fef3c7",
    },
    {
      icon: "lucide:calendar-clock",
      label: "Active Bookings",
      value: "64",
      subtitle: "8.4% increase",
      color: "#7c3aed",
      bg: "#f3e8ff",
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      label: "Register Asset",
      description: "Add a new asset to the registry",
      path: "#",
      color: "#1e3a8a",
      bg: "#eff6ff",
    },
    {
      icon: CalendarClock,
      label: "Book Resource",
      description: "Schedule a shared resource",
      path: "#",
      color: "#16a34a",
      bg: "#ecfdf5",
    },
    {
      icon: Wrench,
      label: "Raise Maintenance",
      description: "Report an issue or repair",
      path: "#",
      color: "#b45309",
      bg: "#fef3c7",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: "Sarah Jenkins",
      action: "allocated",
      item: 'MacBook Pro 16"',
      time: "10 mins ago",
      status: "Allocated",
    },
    {
      id: 2,
      user: "Mike Ross",
      action: "returned",
      item: "Projector A1",
      time: "1 hour ago",
      status: "Available",
    },
    {
      id: 3,
      user: "System",
      action: "flagged for maintenance",
      item: "Delivery Van #4",
      time: "2 hours ago",
      status: "Under Maintenance",
    },
  ];

  const getStatusColor = (status) => {
    if (status === "Allocated") return { bg: "#dcfce7", text: "#15803d" };
    if (status === "Available") return { bg: "#dcfce7", text: "#15803d" };
    if (status === "Under Maintenance")
      return { bg: "#fef3c7", text: "#b45309" };
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
            Dashboard
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Overview of your organization's assets and resource utilization.
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
          Register Asset
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
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: stat.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {stat.icon === "lucide:box" && (
                <Box size={22} color={stat.color} />
              )}
              {stat.icon === "lucide:arrow-right-left" && (
                <ArrowRightLeft size={22} color={stat.color} />
              )}
              {stat.icon === "lucide:wrench" && (
                <Wrench size={22} color={stat.color} />
              )}
              {stat.icon === "lucide:calendar-clock" && (
                <CalendarClock size={22} color={stat.color} />
              )}
            </div>
            <div style={{ flex: 1 }}>
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
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <TrendingUp size={12} /> {stat.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS (3-col) ─── */}
      <div style={{ marginBottom: "28px" }}>
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#1e293b",
            margin: "0 0 16px 0",
          }}
        >
          Quick Actions
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px",
          }}
        >
          {quickActions.map((action, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "18px 20px",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                cursor: "pointer",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = action.color;
                e.currentTarget.style.boxShadow = `0 4px 12px ${action.color}15`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: action.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <action.icon size={22} color={action.color} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: "2px",
                  }}
                >
                  {action.label}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  {action.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT (2:1 split) ─── */}
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}
      >
        {/* Left column — primary content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                <Activity size={16} color="#1e3a8a" />
                Recent Activity
              </h3>
              <a
                href="#"
                style={{
                  fontSize: "12px",
                  color: "#1e3a8a",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                View All →
              </a>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {recentActivity.map((activity, i) => {
                const statusColor = getStatusColor(activity.status);
                return (
                  <div
                    key={activity.id}
                    style={{
                      padding: "12px 0",
                      borderBottom:
                        i < recentActivity.length - 1
                          ? "1px solid #e2e8f0"
                          : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "#f1f5f9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#64748b",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {activity.user.charAt(0)}
                        {activity.user.split(" ")[1]?.charAt(0)}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#1e293b",
                            marginBottom: "2px",
                          }}
                        >
                          {activity.user} {activity.action} {activity.item}
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                          {activity.time}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        background: statusColor.bg,
                        color: statusColor.text,
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {activity.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column — secondary content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
              borderRadius: "12px",
              padding: "20px",
              color: "white",
            }}
          >
            <h3
              style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 8px 0" }}
            >
              Need help?
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "#bfdbfe",
                margin: "0 0 12px 0",
                lineHeight: "1.5",
              }}
            >
              Check out our documentation on asset tracking and maintenance
              workflows.
            </p>
            <button
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "white",
                color: "#1e3a8a",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#f1f5f9")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "white")}
            >
              Read Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
