import React, { useState, useEffect } from "react";
import { Wrench, Loader2, AlertTriangle, CheckCircle, Plus, Clipboard, Clock, HeartCrack } from "lucide-react";
import { apiFetch } from "../../../services/api";

const Maintenance = () => {
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

  const MOCK_ASSETS = [
    { id: "asset-1", name: "MacBook Pro 16\"", assetTag: "AST-2026-001" },
    { id: "asset-2", name: "Dell 27\" Monitor", assetTag: "AST-2026-002" },
    { id: "asset-3", name: "Keychron K2 Keyboard", assetTag: "AST-2026-003" },
    { id: "asset-4", name: "Logitech MX Master 3S Mouse", assetTag: "AST-2026-004" }
  ];

  const MOCK_TICKETS = [
    {
      id: "ticket-1",
      asset: { name: "MacBook Pro 16\"", assetTag: "AST-2026-001" },
      description: "Battery health degraded below 70%, laptop shuts down unexpectedly.",
      priority: "HIGH",
      createdAt: "2026-07-01T10:00:00.000Z",
      status: "IN_PROGRESS",
      assignedTechnician: "Sarah Connor (IT Dept)"
    },
    {
      id: "ticket-2",
      asset: { name: "Dell 27\" Monitor", assetTag: "AST-2026-002" },
      description: "Flickering issue on the screen when connected via USB-C.",
      priority: "MEDIUM",
      createdAt: "2026-07-05T14:30:00.000Z",
      status: "PENDING",
      assignedTechnician: ""
    },
    {
      id: "ticket-3",
      asset: { name: "Keychron K2 Keyboard", assetTag: "AST-2026-003" },
      description: "Spacebar key is double-pressing.",
      priority: "LOW",
      createdAt: "2026-06-25T09:15:00.000Z",
      status: "RESOLVED",
      assignedTechnician: "John Doe (IT Dept)"
    }
  ];
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let storedTickets = localStorage.getItem("assertflow_tickets");
      if (!storedTickets) {
        storedTickets = JSON.stringify(MOCK_TICKETS);
        localStorage.setItem("assertflow_tickets", storedTickets);
      }

      setMyAssets(MOCK_ASSETS);
      setTickets(JSON.parse(storedTickets));
    } catch (err) {
      setError("Failed to load maintenance dashboard.");
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

    setTimeout(() => {
      const selectedAsset = myAssets.find(a => a.id === selectedAssetId);
      const newTicket = {
        id: `ticket-${Date.now()}`,
        asset: {
          name: selectedAsset ? selectedAsset.name : "Assigned Asset",
          assetTag: selectedAsset ? selectedAsset.assetTag : "N/A"
        },
        description,
        priority,
        createdAt: new Date().toISOString(),
        status: "PENDING",
        assignedTechnician: ""
      };

      const updated = [newTicket, ...tickets];
      setTickets(updated);
      localStorage.setItem("assertflow_tickets", JSON.stringify(updated));

      setFormMsg({ text: "Maintenance request reported successfully!", type: "success" });
      setSelectedAssetId("");
      setPriority("MEDIUM");
      setDescription("");
      setPhotoUrl("");
      setSubmitting(false);

      setTimeout(() => setActiveTab("tickets"), 1500);
    }, 600);
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
          <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 6px 0", color: "#1e293b" }}>Maintenance Portal</h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Report equipment issues and track technician progress.</p>
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
            Issue Tickets
          </button>
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
        </div>
      </div>

      {/* Tab: Tickets list */}
      {activeTab === "tickets" && (
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b", margin: "0 0 16px 0" }}>Reported Issues</h2>
          {tickets.length === 0 ? (
            <div style={{ padding: "36px 0", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
              No maintenance requests submitted. Click "Report New Issue" to file a ticket.
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
                    <th style={{ padding: "12px 8px" }}>Reported Date</th>
                    <th style={{ padding: "12px 8px" }}>Status</th>
                    <th style={{ padding: "12px 8px" }}>Assigned Tech</th>
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
                        <td style={{ padding: "12px 8px" }}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: "12px 8px" }}>
                          <span style={{ backgroundColor: statusBadge.bg, color: statusBadge.text, padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>
                            {ticket.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px", color: "#64748b" }}>{ticket.assignedTechnician || "Unassigned"}</td>
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
      {activeTab === "report" && (
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

    </div>
  );
};

export default Maintenance;
