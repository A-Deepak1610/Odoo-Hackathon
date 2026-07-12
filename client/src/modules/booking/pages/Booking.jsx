import React, { useState, useEffect } from "react";
import { CalendarClock, AlertTriangle, Loader2, CheckCircle, Plus, Calendar, Clock, XCircle, RefreshCw } from "lucide-react";
import { apiFetch } from "../../../services/api";

const Booking = () => {
  const [activeTab, setActiveTab] = useState("history"); // history | new
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [formMsg, setFormMsg] = useState({ text: "", type: "" });
  const [submitting, setSubmitting] = useState(false);

  // Reschedule state
  const [reschedulingId, setReschedulingId] = useState(null);
  const [rescheduleStart, setRescheduleStart] = useState("");
  const [rescheduleEnd, setRescheduleEnd] = useState("");
  const [rescheduleMsg, setRescheduleMsg] = useState({ text: "", type: "" });
  const [updatingReschedule, setUpdatingReschedule] = useState(false);

  const fetchBookingsAndResources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [bookingsRes, resourcesRes] = await Promise.all([
        apiFetch("/api/v1/bookings"),
        apiFetch("/api/v1/bookings/resources")
      ]);

      const bookingsResult = await bookingsRes.json();
      const resourcesResult = await resourcesRes.json();

      if (bookingsRes.ok && resourcesRes.ok) {
        setBookings(bookingsResult.data);
        setResources(resourcesResult.data);
      } else {
        setError(bookingsResult.message || resourcesResult.message || "Failed to load booking details.");
      }
    } catch (err) {
      setError("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsAndResources();
  }, []);

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setFormMsg({ text: "", type: "" });

    if (!selectedAssetId || !startTime || !endTime) {
      setFormMsg({ text: "Please select a resource and time range.", type: "error" });
      return;
    }

    setSubmitting(true);

    try {
      const res = await apiFetch("/api/v1/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId: selectedAssetId, startTime, endTime }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setFormMsg({ text: "Booking created successfully!", type: "success" });
        setSelectedAssetId("");
        setStartTime("");
        setEndTime("");
        // Reload booking list
        const refreshed = await apiFetch("/api/v1/bookings");
        const refreshedData = await refreshed.json();
        if (refreshed.ok) setBookings(refreshedData.data);
        setTimeout(() => setActiveTab("history"), 1500);
      } else {
        setFormMsg({ text: result.message || "Failed to create booking", type: "error" });
      }
    } catch (err) {
      setFormMsg({ text: "Network error occurred.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await apiFetch(`/api/v1/bookings/${bookingId}/cancel`, {
        method: "PUT",
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: "CANCELLED" } : b));
      } else {
        alert(result.message || "Failed to cancel booking.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    setRescheduleMsg({ text: "", type: "" });
    setUpdatingReschedule(true);

    try {
      const res = await apiFetch(`/api/v1/bookings/${reschedulingId}/reschedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime: rescheduleStart, endTime: rescheduleEnd }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setRescheduleMsg({ text: "Booking rescheduled successfully!", type: "success" });
        // Update list
        setBookings(bookings.map(b => b.id === reschedulingId ? result.data : b));
        setTimeout(() => {
          setReschedulingId(null);
          setRescheduleStart("");
          setRescheduleEnd("");
          setRescheduleMsg({ text: "", type: "" });
        }, 1500);
      } else {
        setRescheduleMsg({ text: result.message || "Failed to reschedule booking.", type: "error" });
      }
    } catch (err) {
      setRescheduleMsg({ text: "Network error.", type: "error" });
    } finally {
      setUpdatingReschedule(false);
    }
  };

  const getBookingStatusBadge = (status) => {
    if (status === "UPCOMING") return { bg: "#e0f2fe", text: "#0369a1" };
    if (status === "ONGOING") return { bg: "#dcfce7", text: "#15803d" };
    if (status === "CANCELLED") return { bg: "#fee2e2", text: "#b91c1c" };
    return { bg: "#f1f5f9", text: "#475569" };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', gap: '16px', fontFamily: 'Inter, sans-serif' }}>
        <Loader2 size={36} className="animate-spin" style={{ color: '#1e3a8a' }} />
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Loading bookings schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', padding: '24px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <AlertTriangle size={36} color="#ef4444" style={{ marginBottom: "16px" }} />
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Failed to Load Bookings</h3>
        <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '380px', margin: '0 0 20px 0' }}>{error}</p>
        <button onClick={fetchBookingsAndResources} style={{ padding: '8px 16px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px", maxWidth: "1400px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 6px 0", color: "#1e293b" }}>Resource Booking</h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Schedule and manage rooms, vehicles, and shared equipment.</p>
        </div>
        <div style={{ display: "flex", backgroundColor: "#f1f5f9", padding: "4px", borderRadius: "8px" }}>
          <button 
            onClick={() => setActiveTab("history")}
            style={{
              padding: "6px 16px",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: activeTab === "history" ? "white" : "transparent",
              color: activeTab === "history" ? "#1e3a8a" : "#64748b",
              boxShadow: activeTab === "history" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
            }}
          >
            My Bookings
          </button>
          <button 
            onClick={() => setActiveTab("new")}
            style={{
              padding: "6px 16px",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: activeTab === "new" ? "white" : "transparent",
              color: activeTab === "new" ? "#1e3a8a" : "#64748b",
              boxShadow: activeTab === "new" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
            }}
          >
            New Reservation
          </button>
        </div>
      </div>

      {/* Reschedule Modal Overlay */}
      {reschedulingId && (
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
            width: "420px",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 16px 0", color: "#0f172a" }}>Reschedule Reservation</h3>
            {rescheduleMsg.text && (
              <div style={{
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                marginBottom: "12px",
                backgroundColor: rescheduleMsg.type === "success" ? "#dcfce7" : "#fee2e2",
                color: rescheduleMsg.type === "success" ? "#15803d" : "#b91c1c"
              }}>{rescheduleMsg.text}</div>
            )}
            <form onSubmit={handleReschedule} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Start Time</label>
                <input type="datetime-local" value={rescheduleStart} onChange={(e) => setRescheduleStart(e.target.value)} required style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>End Time</label>
                <input type="datetime-local" value={rescheduleEnd} onChange={(e) => setRescheduleEnd(e.target.value)} required style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "13px" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button type="button" onClick={() => setReschedulingId(null)} style={{ padding: "8px 14px", backgroundColor: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={updatingReschedule} style={{ padding: "8px 14px", backgroundColor: "#1e3a8a", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  {updatingReschedule && <Loader2 size={12} className="animate-spin" />}
                  Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab: History */}
      {activeTab === "history" && (
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b", margin: "0 0 16px 0" }}>Your Bookings</h2>
          {bookings.length === 0 ? (
            <div style={{ padding: "36px 0", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
              You have no active or past bookings. Click "New Reservation" to book a resource.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>
                    <th style={{ padding: "12px 8px" }}>Resource</th>
                    <th style={{ padding: "12px 8px" }}>Location</th>
                    <th style={{ padding: "12px 8px" }}>Start Time</th>
                    <th style={{ padding: "12px 8px" }}>End Time</th>
                    <th style={{ padding: "12px 8px" }}>Status</th>
                    <th style={{ padding: "12px 8px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const badge = getBookingStatusBadge(booking.status);
                    const isUpcoming = booking.status === "UPCOMING" && new Date(booking.startTime) > new Date();
                    return (
                      <tr key={booking.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                        <td style={{ padding: "12px 8px", fontWeight: 500, color: "#0f172a" }}>{booking.asset?.name}</td>
                        <td style={{ padding: "12px 8px", color: "#64748b" }}>{booking.asset?.location || "N/A"}</td>
                        <td style={{ padding: "12px 8px" }}>{new Date(booking.startTime).toLocaleString()}</td>
                        <td style={{ padding: "12px 8px" }}>{new Date(booking.endTime).toLocaleString()}</td>
                        <td style={{ padding: "12px 8px" }}>
                          <span style={{ backgroundColor: badge.bg, color: badge.text, padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>
                            {booking.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px", textAlign: "center" }}>
                          {isUpcoming ? (
                            <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                              <button 
                                onClick={() => {
                                  setReschedulingId(booking.id);
                                  setRescheduleStart(booking.startTime.substring(0, 16));
                                  setRescheduleEnd(booking.endTime.substring(0, 16));
                                }}
                                style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", backgroundColor: "#fffbeb", color: "#b45309", border: "1px solid #fef3c7", borderRadius: "6px", fontSize: "11.5px", fontWeight: 600, cursor: "pointer" }}
                              >
                                <RefreshCw size={12} /> Reschedule
                              </button>
                              <button 
                                onClick={() => handleCancelBooking(booking.id)}
                                style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fee2e2", borderRadius: "6px", fontSize: "11.5px", fontWeight: 600, cursor: "pointer" }}
                              >
                                <XCircle size={12} /> Cancel
                              </button>
                            </div>
                          ) : (
                            <span style={{ color: "#94a3b8", fontSize: "12px" }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: New Reservation */}
      {activeTab === "new" && (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          
          {/* Form */}
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={18} color="#1e3a8a" /> Make a Reservation
            </h2>

            {formMsg.text && (
              <div style={{
                padding: "10px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: formMsg.type === "success" ? "#dcfce7" : "#fee2e2",
                color: formMsg.type === "success" ? "#15803d" : "#b91c1c"
              }}>
                {formMsg.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                {formMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateBooking} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Select Resource</label>
                <select 
                  value={selectedAssetId} 
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  required
                  style={{ width: "100%", height: "38px", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0 8px", fontSize: "13px" }}
                >
                  <option value="">-- Select Shared Room or Equipment --</option>
                  {resources.map((res) => (
                    <option key={res.id} value={res.id}>
                      [{res.category?.name || "Shared"}] {res.name} — {res.location || "No Location"}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Start Time</label>
                  <input 
                    type="datetime-local" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)} 
                    required 
                    style={{ width: "100%", height: "36px", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0 10px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>End Time</label>
                  <input 
                    type="datetime-local" 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)} 
                    required 
                    style={{ width: "100%", height: "36px", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0 10px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  alignSelf: "flex-end",
                  padding: "10px 20px",
                  backgroundColor: "#1e3a8a",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Confirm Booking
              </button>
            </form>
          </div>

          {/* Guidelines */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock size={16} color="#7c3aed" /> Reservation Guidelines
              </h3>
              <ul style={{ fontSize: "12.5px", color: "#64748b", paddingLeft: "16px", margin: 0, lineHeight: "1.6" }}>
                <li style={{ marginBottom: "6px" }}>Bookings are immediate and run collision checks instantly.</li>
                <li style={{ marginBottom: "6px" }}>Cancellations can be made up to the start time of the reservation.</li>
                <li style={{ marginBottom: "6px" }}>Rescheduling is blocked if the new slot overlaps with another reservation.</li>
              </ul>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Booking;
