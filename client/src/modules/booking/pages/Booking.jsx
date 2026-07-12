import React from "react";
import { CalendarClock, Plus, Clock } from "lucide-react";

const Booking = () => {
  const statsCards = [
    {
      label: "Total Bookings",
      value: "145",
      subtitle: "Active this month",
      color: "#1e3a8a",
      bg: "#eff6ff",
    },
    {
      label: "Ongoing",
      value: "3",
      subtitle: "Right now",
      color: "#0891b2",
      bg: "#ecfeff",
    },
    {
      label: "Upcoming",
      value: "24",
      subtitle: "Next 7 days",
      color: "#7c3aed",
      bg: "#f3e8ff",
    },
    {
      label: "Completion",
      value: "96%",
      subtitle: "On-time rate",
      color: "#16a34a",
      bg: "#ecfdf5",
    },
  ];

  const mockBookings = [
    {
      id: "BK-001",
      resource: "Conf Room A",
      user: "Tom Hanks",
      time: "10:00 AM - 11:30 AM",
      date: "Today",
      dateNum: "12",
      status: "Ongoing",
    },
    {
      id: "BK-002",
      resource: "Projector A1",
      user: "Mike Ross",
      time: "2:00 PM - 4:00 PM",
      date: "Today",
      dateNum: "12",
      status: "Upcoming",
    },
    {
      id: "BK-003",
      resource: "Delivery Van #2",
      user: "Logistics",
      time: "9:00 AM - 5:00 PM",
      date: "Tomorrow",
      dateNum: "13",
      status: "Upcoming",
    },
    {
      id: "BK-004",
      resource: "Conf Room B",
      user: "Sarah Jenkins",
      time: "9:00 AM - 10:00 AM",
      date: "Yesterday",
      dateNum: "11",
      status: "Completed",
    },
  ];

  const getStatusColor = (status) => {
    if (status === "Ongoing") return { bg: "#fef3c7", text: "#b45309" };
    if (status === "Upcoming") return { bg: "#dbeafe", text: "#1d4ed8" };
    if (status === "Completed") return { bg: "#dcfce7", text: "#15803d" };
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
            Resource Booking
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Schedule and manage bookings for shared assets and facilities.
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
          Book Resource
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

      {/* ── BOOKINGS ─── */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
            <CalendarClock size={16} color="#1e3a8a" />
            Booking Slots
          </h3>
          <select
            style={{
              fontSize: "12px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "6px 10px",
              background: "white",
              color: "#1e293b",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
            }}
          >
            <option>All Resources</option>
            <option>Rooms</option>
            <option>Vehicles</option>
            <option>Equipment</option>
          </select>
        </div>

        <div style={{ borderTop: "1px solid #e2e8f0" }}>
          {mockBookings.map((booking, idx) => {
            const statusColor = getStatusColor(booking.status);
            return (
              <div
                key={booking.id}
                style={{
                  padding: "16px 20px",
                  borderBottom:
                    idx < mockBookings.length - 1
                      ? "1px solid #e2e8f0"
                      : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#f8fafc")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flex: 1,
                  }}
                >
                  {/* Date box */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      background: "#eff6ff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#1e3a8a",
                        textTransform: "uppercase",
                      }}
                    >
                      {booking.date.slice(0, 3)}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#1e3a8a",
                        lineHeight: 1,
                      }}
                    >
                      {booking.dateNum}
                    </div>
                  </div>
                  {/* Content */}
                  <div>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#1e293b",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {booking.resource}
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Clock size={12} color="#94a3b8" />
                        {booking.time}
                      </span>
                      <span>•</span>
                      <span>{booking.user}</span>
                    </div>
                  </div>
                </div>
                {/* Status & action */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
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
                    {booking.status}
                  </span>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#1e3a8a",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Manage
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Booking;
