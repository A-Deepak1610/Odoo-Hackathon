import React, { useState, useEffect } from "react";
import { 
  Wrench, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Clipboard, 
  User, 
  UserCheck, 
  ThumbsUp, 
  Check, 
  X,
  FileText,
  Clock
} from "lucide-react";
import { apiFetch } from "../../../services/api";
import { useAuth } from "../../auth";

const MOCK_TICKETS = [
  {
    id: "mock-m-001",
    asset: { name: "ThinkPad X1 Carbon Workstation", assetTag: "AST-LPT-001" },
    description: "Battery swollen, trackpad not clicking properly.",
    priority: "HIGH",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "PENDING",
    assignedTechnician: null,
    requestedBy: { name: "Sarah Jenkins", email: "sarah@acme.com" }
  },
  {
    id: "mock-m-002",
    asset: { name: "Conference Room A (Glass) Projector", assetTag: "AST-FAC-002" },
    description: "Display lamp keeps flickering and shutting off after 10 minutes.",
    priority: "MEDIUM",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "APPROVED",
    assignedTechnician: "David Kim (IT Support)",
    requestedBy: { name: "John Doe", email: "employee@assertflow.com" }
  },
  {
    id: "mock-m-003",
    asset: { name: "MX Master 3S Ergonomic Mouse", assetTag: "AST-ACC-014" },
    description: "Double clicking issue on left mouse button.",
    priority: "LOW",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "RESOLVED",
    assignedTechnician: "Jane Smith (Hardware)",
    requestedBy: { name: "Mike Ross", email: "mike@acme.com" }
  }
];

const Maintenance = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER' || user?.role === 'SUPERADMIN';

  const [activeTab, setActiveTab] = useState("tickets"); // tickets | report
  const [myAssets, setMyAssets] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState({ text: "", type: "" });

  // Assign Tech overlay state
  const [assigningId, setAssigningId] = useState(null);
  const [techName, setTechName] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const assetsEndpoint = isAdmin ? "/api/v1/assets" : "/api/v1/assets/my";
      const ticketsEndpoint = isAdmin ? "/api/v1/maintenance" : "/api/v1/maintenance/my-requests";

      const [assetsRes, ticketsRes] = await Promise.all([
        apiFetch(assetsEndpoint),
        apiFetch(ticketsEndpoint)
      ]);

      const assetsResult = await assetsRes.json();
      const ticketsResult = await ticketsRes.json();

      if (assetsRes.ok && ticketsRes.ok) {
        setMyAssets(assetsResult.data || []);
        
        let loadedTickets = ticketsResult.data || [];
        // Apply mock fallbacks if there are no tickets in the database
        if (loadedTickets.length === 0) {
          loadedTickets = MOCK_TICKETS;
        }
        setTickets(loadedTickets);
      } else {
        setError(assetsResult.message || ticketsResult.message || "Failed to load maintenance dashboard.");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReportIssue = async (e) => {
    e.preventDefault();
    setFormMsg({ text: "", type: "" });

    if (!selectedAssetId) {
      setFormMsg({ text: "Please select an asset.", type: "error" });
      return;
    }

    if (!description || description.trim() === "") {
      setFormMsg({ text: "Please enter an issue description.", type: "error" });
      return;
    }

    setSubmitting(true);

    try {
      const res = await apiFetch("/api/v1/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: selectedAssetId,
          description,
          priority,
          photoUrl: photoUrl || undefined
        })
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setFormMsg({ text: "Maintenance request reported successfully!", type: "success" });
        setSelectedAssetId("");
        setPriority("MEDIUM");
        setDescription("");
        setPhotoUrl("");

        await fetchData();
        setTimeout(() => setActiveTab("tickets"), 1500);
      } else {
        setFormMsg({ text: result.message || "Failed to submit request.", type: "error" });
      }
    } catch (err) {
      setFormMsg({ text: "Network error occurred.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveTicket = async (ticketId) => {
    // Check if it is a mock ticket (starts with mock-)
    if (String(ticketId).startsWith("mock-")) {
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: "APPROVED" } : t));
      return;
    }

    try {
      const res = await apiFetch(`/api/v1/maintenance/${ticketId}/approve`, {
        method: "PUT"
      });
      const result = await res.json();
      if (res.ok && result.success) {
        await fetchData();
      } else {
        alert(result.message || "Failed to approve request.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const handleResolveTicket = async (ticketId) => {
    if (String(ticketId).startsWith("mock-")) {
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: "RESOLVED" } : t));
      return;
    }

    try {
      const res = await apiFetch(`/api/v1/maintenance/${ticketId}/resolve`, {
        method: "PUT"
      });
      const result = await res.json();
      if (res.ok && result.success) {
        await fetchData();
      } else {
        alert(result.message || "Failed to resolve request.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const handleAssignTechnician = (e) => {
    e.preventDefault();
    if (!techName) return;

    // Direct mock update or visual support
    setTickets(tickets.map(t => t.id === assigningId ? { 
      ...t, 
      assignedTechnician: techName,
      status: t.status === "PENDING" ? "APPROVED" : t.status 
    } : t));

    setTechName("");
    setAssigningId(null);
  };

  const getPriorityStyle = (pri) => {
    if (pri === "HIGH") return { color: "#dc2626", bg: "#fef2f2", label: "High" };
    if (pri === "MEDIUM") return { color: "#d97706", bg: "#fffbeb", label: "Medium" };
    return { color: "#2563eb", bg: "#eff6ff", label: "Low" };
  };

  const getStatusBadge = (status) => {
    if (status === "PENDING") return { bg: "#f1f5f9", text: "#475569" };
    if (status === "APPROVED") return { bg: "#e0f2fe", text: "#0369a1" };
    if (status === "IN_PROGRESS") return { bg: "#fef3c7", text: "#b45309" };
    if (status === "RESOLVED") return { bg: "#dcfce7", text: "#15803d" };
    return { bg: "#fee2e2", text: "#b91c1c" };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', gap: '16px', fontFamily: 'Inter, sans-serif' }}>
        <Loader2 size={36} className="animate-spin" style={{ color: '#1e3a8a' }} />
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Loading maintenance dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', padding: '24px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <AlertTriangle size={36} color="#ef4444" style={{ marginBottom: "16px" }} />
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Failed to Load Dashboard</h3>
        <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '380px', margin: '0 0 20px 0' }}>{error}</p>
        <button onClick={fetchData} style={{ padding: '8px 16px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px", maxWidth: "1400px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContext: "space-between", alignItems: "center", marginBottom: "28px", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 6px 0", color: "#1e293b" }}>
            {isAdmin ? "Maintenance Console" : "Maintenance Portal"}
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            {isAdmin ? "Oversee requests, assign technical support staff, and sign off resolved logs." : "Report equipment issues and track technician progress."}
          </p>
        </div>
        
        <div style={{ display: "flex", backgroundColor: "#f1f5f9", padding: "4px", borderRadius: "8px" }}>
          <button 
            onClick={() => setActiveTab("tickets")}
            style={{
              padding: "6px 16px",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: activeTab === "tickets" ? "white" : "transparent",
              color: activeTab === "tickets" ? "#1e3a8a" : "#64748b",
              boxShadow: activeTab === "tickets" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
            }}
          >
            {isAdmin ? "All Tickets" : "Issue Tickets"}
          </button>
          {!isAdmin && (
            <button 
              onClick={() => setActiveTab("report")}
              style={{
                padding: "6px 16px",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: activeTab === "report" ? "white" : "transparent",
                color: activeTab === "report" ? "#1e3a8a" : "#64748b",
                boxShadow: activeTab === "report" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
              }}
            >
              Report New Issue
            </button>
          )}
        </div>
      </div>

      {/* Tab: Tickets list */}
      {activeTab === "tickets" && (
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b", margin: "0 0 16px 0" }}>
            {isAdmin ? "Active System Tickets Queue" : "Reported Issues"}
          </h2>
          {tickets.length === 0 ? (
            <div style={{ padding: "36px 0", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
              No maintenance requests submitted.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>
                    <th style={{ padding: "12px 8px" }}>Asset</th>
                    <th style={{ padding: "12px 8px" }}>Asset Tag</th>
                    <th style={{ padding: "12px 8px" }}>Issue Description</th>
                    <th style={{ padding: "12px 8px" }}>Priority</th>
                    <th style={{ padding: "12px 8px" }}>{isAdmin ? "Requested By" : "Reported Date"}</th>
                    <th style={{ padding: "12px 8px" }}>Status</th>
                    <th style={{ padding: "12px 8px" }}>Assigned Tech</th>
                    {isAdmin && <th style={{ padding: "12px 8px", textAlign: "center" }}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => {
                    const statusBadge = getStatusBadge(ticket.status);
                    const pri = getPriorityStyle(ticket.priority);
                    return (
                      <tr key={ticket.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                        <td style={{ padding: "12px 8px", fontWeight: 500, color: "#0f172a" }}>{ticket.asset?.name}</td>
                        <td style={{ padding: "12px 8px", fontFamily: "monospace", color: "#64748b" }}>{ticket.asset?.assetTag}</td>
                        <td style={{ padding: "12px 8px", color: "#475569" }}>{ticket.description}</td>
                        <td style={{ padding: "12px 8px" }}>
                          <span style={{ backgroundColor: pri.bg, color: pri.color, padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>
                            {pri.label}
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          {isAdmin ? (
                            <div>
                              <div style={{ fontWeight: 500, color: "#0f172a" }}>{ticket.requestedBy?.name || "System"}</div>
                              <div style={{ fontSize: "11px", color: "#94a3b8" }}>{ticket.requestedBy?.email}</div>
                            </div>
                          ) : (
                            new Date(ticket.createdAt).toLocaleDateString()
                          )}
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          <span style={{ backgroundColor: statusBadge.bg, color: statusBadge.text, padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>
                            {ticket.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px", color: "#64748b" }}>
                          {ticket.assignedTechnician || (
                            isAdmin ? (
                              <button 
                                onClick={() => setAssigningId(ticket.id)}
                                style={{ padding: "4px 8px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", color: "#475569", cursor: "pointer", fontWeight: 500 }}
                              >
                                Assign
                              </button>
                            ) : "Unassigned"
                          )}
                        </td>
                        {isAdmin && (
                          <td style={{ padding: "12px 8px", textAlign: "center" }}>
                            <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                              {ticket.status === "PENDING" && (
                                <button
                                  onClick={() => handleApproveTicket(ticket.id)}
                                  title="Approve Ticket"
                                  style={{ padding: "6px", background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "6px", color: "#059669", cursor: "pointer" }}
                                >
                                  <ThumbsUp size={13} />
                                </button>
                              )}
                              {["PENDING", "APPROVED", "IN_PROGRESS"].includes(ticket.status) && (
                                <button
                                  onClick={() => handleResolveTicket(ticket.id)}
                                  title="Mark Resolved"
                                  style={{ padding: "6px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", color: "#2563eb", cursor: "pointer" }}
                                >
                                  <Check size={13} />
                                </button>
                              )}
                              {ticket.status === "RESOLVED" && (
                                <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 500 }}>Completed</span>
                              )}
                            </div>
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
      )}

      {/* Tab: Report new issue */}
      {activeTab === "report" && !isAdmin && (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          
          {/* Form */}
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <Wrench size={18} color="#1e3a8a" /> Raise Maintenance Request
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

            <form onSubmit={handleReportIssue} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Select Damaged/Defective Asset</label>
                <select 
                  value={selectedAssetId} 
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  required
                  style={{ width: "100%", height: "38px", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0 8px", fontSize: "13px" }}
                >
                  <option value="">-- Select Assigned Asset --</option>
                  {myAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} [{asset.assetTag}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Ticket Priority</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ width: "100%", height: "38px", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0 8px", fontSize: "13px" }}
                >
                  <option value="LOW">Low (Non-blocking bug)</option>
                  <option value="MEDIUM">Medium (Degraded performance)</option>
                  <option value="HIGH">High (Equipment unusable/broken)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Issue Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the defect (e.g. screen has vertical lines, laptop shuts down randomly after 15 mins)..."
                  rows={4}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "13px",
                    resize: "none",
                    fontFamily: "Inter, sans-serif"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Image Link / Reference URL (Optional)</label>
                <input 
                  type="text" 
                  value={photoUrl} 
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/defect-photo.jpg"
                  style={{
                    width: "100%",
                    height: "36px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: "0 10px",
                    fontSize: "13px"
                  }}
                />
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
                File Ticket
              </button>
            </form>
          </div>

          {/* Right Info Box */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Clipboard size={16} color="#b45309" /> Issue Reporting
              </h3>
              <p style={{ fontSize: "12.5px", color: "#64748b", lineHeight: "1.6", margin: 0 }}>
                Tickets are assigned to our IT Helpdesk or Facilities teams. Standard turnaround is 24 hours for Medium tickets and under 4 hours for High priority tickets. You will receive notifications when a technician is assigned.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ── ASSIGN TECHNICIAN OVERLAY MODAL ─── */}
      {assigningId && (
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
            width: "400px",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            fontFamily: "Inter, sans-serif"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0, color: "#0f172a" }}>Assign Support Technician</h3>
              <button 
                onClick={() => setAssigningId(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAssignTechnician} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Select Technician</label>
                <select 
                  value={techName} 
                  onChange={(e) => setTechName(e.target.value)}
                  required
                  style={{ width: "100%", height: "38px", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0 8px", fontSize: "13px" }}
                >
                  <option value="">-- Choose Support Staff --</option>
                  <option value="David Kim (IT Support)">David Kim (IT Support)</option>
                  <option value="Jane Smith (Hardware Desk)">Jane Smith (Hardware Desk)</option>
                  <option value="Robert Lee (Facilities Office)">Robert Lee (Facilities Office)</option>
                  <option value="Alice Johnson (Network Admin)">Alice Johnson (Network Admin)</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button 
                  type="button"
                  onClick={() => setAssigningId(null)}
                  style={{ padding: "8px 16px", background: "white", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "13px", color: "#64748b", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: "8px 16px", background: "#1e3a8a", border: "none", borderRadius: "6px", fontSize: "13px", color: "white", cursor: "pointer", fontWeight: 600 }}
                >
                  Assign Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Maintenance;
