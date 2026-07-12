import React, { useState } from "react";
import {
  Bell,
  AlertCircle,
  Wrench,
  CheckCircle,
  ArrowRightLeft,
  CheckCheck,
  Trash2,
} from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    type: "alert",
    title: "Asset Overdue",
    message: "Dell XPS 15 (AST-1043) is 2 days overdue from Tom Hanks.",
    time: "2 hours ago",
    unread: true,
    icon: AlertCircle,
  },
  {
    id: 2,
    type: "maintenance",
    title: "Maintenance Request Approved",
    message: "Request MNT-4021 for HVAC System has been approved.",
    time: "4 hours ago",
    unread: true,
    icon: Wrench,
  },
  {
    id: 3,
    type: "transfer",
    title: "Transfer Request",
    message: "Sarah Jenkins requested transfer of Projector A1.",
    time: "1 day ago",
    unread: false,
    icon: ArrowRightLeft,
  },
  {
    id: 4,
    type: "success",
    title: "Audit Completed",
    message: "Q1 Comprehensive Asset Audit has been marked as completed.",
    time: "2 days ago",
    unread: false,
    icon: CheckCircle,
  },
  {
    id: 5,
    type: "alert",
    title: "Low Stock Alert",
    message: "USB-C cables inventory is below minimum threshold.",
    time: "3 days ago",
    unread: false,
    icon: AlertCircle,
  },
  {
    id: 6,
    type: "maintenance",
    title: "Scheduled Maintenance",
    message: "Server maintenance scheduled for Sunday 02:00 AM.",
    time: "4 days ago",
    unread: false,
    icon: Wrench,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const statsCards = [
    {
      label: "Total Notifications",
      value: notifications.length.toString(),
      subtitle: "All time",
      color: "#1e3a8a",
      bg: "#eff6ff",
    },
    {
      label: "Unread",
      value: notifications.filter((n) => n.unread).length.toString(),
      subtitle: "Require attention",
      color: "#dc2626",
      bg: "#fef2f2",
    },
    {
      label: "Alerts",
      value: notifications.filter((n) => n.type === "alert").length.toString(),
      subtitle: "Critical issues",
      color: "#ea580c",
      bg: "#fef3c7",
    },
    {
      label: "Actions Needed",
      value: notifications
        .filter((n) => n.type === "maintenance" || n.type === "transfer")
        .length.toString(),
      subtitle: "Pending approvals",
      color: "#0891b2",
      bg: "#ecfdfd",
    },
  ];

  const quickActions = [
    {
      icon: CheckCheck,
      label: "Mark All Read",
      action: () =>
        setNotifications(notifications.map((n) => ({ ...n, unread: false }))),
    },
    { icon: AlertCircle, label: "Alert Settings", action: () => {} },
    { icon: Trash2, label: "Clear All", action: () => setNotifications([]) },
  ];

  const getTypeColor = (type) => {
    if (type === "alert")
      return { bg: "#fef2f2", text: "#dc2626", icon: "#dc2626" };
    if (type === "maintenance")
      return { bg: "#fef3c7", text: "#b45309", icon: "#b45309" };
    if (type === "transfer")
      return { bg: "#dbeafe", text: "#1d4ed8", icon: "#1d4ed8" };
    if (type === "success")
      return { bg: "#dcfce7", text: "#15803d", icon: "#15803d" };
    return { bg: "#f1f5f9", text: "#64748b", icon: "#64748b" };
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
      {/* HEADER */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "700",
            color: "#1e293b",
            margin: "0 0 8px 0",
          }}
        >
          Notifications
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: "0" }}>
          Manage your system alerts and updates
        </p>
      </div>

      {/* STATS GRID (4 columns) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {statsCards.map((stat, idx) => (
          <div
            key={idx}
            style={{
              padding: "20px",
              backgroundColor: stat.bg,
              borderRadius: "12px",
              border: `1px solid ${stat.color}33`,
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: stat.color,
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: stat.color,
                marginBottom: "4px",
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              {stat.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS (3 columns) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {quickActions.map((action, idx) => {
          const IconComp = action.icon;
          return (
            <button
              key={idx}
              onClick={action.action}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 18px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                color: "#1e293b",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f1f5f9";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#f8fafc";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              <IconComp size={18} style={{ color: "#64748b" }} />
              {action.label}
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT: NOTIFICATIONS LIST */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          <div
            style={{ fontSize: "15px", fontWeight: "600", color: "#1e293b" }}
          >
            Notifications Activity
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            {notifications.length} total
          </div>
        </div>

        <div>
          {notifications.length === 0 ? (
            <div style={{ padding: "48px 32px", textAlign: "center" }}>
              <Bell
                size={48}
                style={{ color: "#cbd5e1", margin: "0 auto 16px" }}
              />
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "500",
                  color: "#1e293b",
                  marginBottom: "4px",
                }}
              >
                No notifications
              </div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                All clear! You're all caught up.
              </div>
            </div>
          ) : (
            notifications.map((note, idx) => {
              const typeColor = getTypeColor(note.type);
              const IconComp = note.icon;
              return (
                <div
                  key={note.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    padding: "16px 20px",
                    borderBottom:
                      idx < notifications.length - 1
                        ? "1px solid #e2e8f0"
                        : "none",
                    backgroundColor: note.unread ? "#f0f9ff" : "#ffffff",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = note.unread
                      ? "#e0f2fe"
                      : "#f8fafc";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = note.unread
                      ? "#f0f9ff"
                      : "#ffffff";
                  }}
                >
                  {/* Icon Circle */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "40px",
                      height: "40px",
                      backgroundColor: typeColor.bg,
                      borderRadius: "8px",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    <IconComp size={20} style={{ color: typeColor.icon }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "6px",
                        gap: "12px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "14px",
                          fontWeight: note.unread ? "600" : "500",
                          color: "#1e293b",
                          margin: "0",
                        }}
                      >
                        {note.title}
                      </h4>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          whiteSpace: "nowrap",
                          marginTop: "2px",
                        }}
                      >
                        {note.time}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#64748b",
                        margin: "0",
                        lineHeight: "1.5",
                      }}
                    >
                      {note.message}
                    </p>
                  </div>

                  {/* Unread Indicator */}
                  {note.unread && (
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: "#1e3a8a",
                        borderRadius: "50%",
                        flexShrink: 0,
                        marginTop: "6px",
                      }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
