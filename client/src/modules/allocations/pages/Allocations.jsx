import React, { useState, useEffect } from "react";
import { ArrowRightLeft, Loader2, AlertTriangle, CheckCircle, Plus, User, Building, Trash2 } from "lucide-react";
import { apiFetch } from "../../../services/api";
import { useAuth } from "../auth/store/AuthContext";

const Allocations = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("transfers"); // transfers | request
  const [myAssets, setMyAssets] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [destinationType, setDestinationType] = useState("employee"); // employee | department
  const [destEmployeeId, setDestEmployeeId] = useState("");
  const [destDeptId, setDestDeptId] = useState("");
  const [reason, setReason] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState({ text: "", type: "" });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [assetsRes, transfersRes, orgRes] = await Promise.all([
        apiFetch("/api/v1/assets/my"),
        apiFetch("/api/v1/allocation/my-transfers"),
        apiFetch("/api/v1/organization") // Fetch users and departments if available, or fall back
      ]);

      const assetsResult = await assetsRes.json();
      const transfersResult = await transfersRes.json();

      if (assetsRes.ok && transfersRes.ok) {
        setMyAssets(assetsResult.data);
        setTransfers(transfersResult.data);
      } else {
        setError(assetsResult.message || transfersResult.message || "Failed to load transfer dashboard.");
      }

      // Try reading users/departments list if organization endpoint is available
      if (orgRes.ok) {
        const orgData = await orgRes.json();
        if (orgData.success && orgData.data) {
          setUsers(orgData.data.users || []);
          setDepartments(orgData.data.departments || []);
        }
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

  const handleRequestTransfer = async (e) => {
    e.preventDefault();
    setFormMsg({ text: "", type: "" });

    if (!selectedAssetId) {
      setFormMsg({ text: "Please select an asset to transfer.", type: "error" });
      return;
    }

    if (destinationType === "employee" && !destEmployeeId) {
      setFormMsg({ text: "Please select a destination employee.", type: "error" });
      return;
    }

    if (destinationType === "department" && !destDeptId) {
      setFormMsg({ text: "Please select a destination department.", type: "error" });
      return;
    }

    if (!reason || reason.trim() === "") {
      setFormMsg({ text: "Please enter a transfer reason.", type: "error" });
      return;
    }

    setSubmitting(true);

    try {
      const res = await apiFetch("/api/v1/allocation/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: selectedAssetId,
          toEmployeeId: destinationType === "employee" ? destEmployeeId : undefined,
          toDepartmentId: destinationType === "department" ? destDeptId : undefined,
          reason
        })
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setFormMsg({ text: "Transfer request submitted successfully!", type: "success" });
        setSelectedAssetId("");
        setDestEmployeeId("");
        setDestDeptId("");
        setReason("");
        
        // Reload list
        const refreshed = await apiFetch("/api/v1/allocation/my-transfers");
        const refData = await refreshed.json();
        if (refreshed.ok) setTransfers(refData.data);
        setTimeout(() => setActiveTab("transfers"), 1500);
      } else {
        setFormMsg({ text: result.message || "Failed to submit request", type: "error" });
      }
    } catch (err) {
      setFormMsg({ text: "Network error occurred.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelTransfer = async (transferId) => {
    if (!window.confirm("Are you sure you want to cancel this transfer request?")) return;

    try {
      const res = await apiFetch(`/api/v1/allocation/transfer/${transferId}/cancel`, {
        method: "PUT"
      });
      if (res.ok) {
        setTransfers(transfers.filter(t => t.id !== transferId));
      } else {
        const result = await res.json();
        alert(result.message || "Failed to cancel transfer request.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "PENDING") return { bg: "#f1f5f9", text: "#475569" };
    if (status === "APPROVED") return { bg: "#dcfce7", text: "#15803d" };
    if (status === "REJECTED") return { bg: "#fee2e2", text: "#b91c1c" };
    return { bg: "#f1f5f9", text: "#475569" };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', gap: '16px', fontFamily: 'Inter, sans-serif' }}>
        <Loader2 size={36} className="animate-spin" style={{ color: '#1e3a8a' }} />
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Loading transfers dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', padding: '24px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <AlertTriangle size={36} color="#ef4444" style={{ marginBottom: "16px" }} />
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Failed to Load Transfers</h3>
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
          <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 6px 0", color: "#1e293b" }}>Asset Transfer</h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Request transfers of allocated equipment and track review status.</p>
        </div>
        
        <div style={{ display: "flex", backgroundColor: "#f1f5f9", padding: "4px", borderRadius: "8px" }}>
          <button 
            onClick={() => setActiveTab("transfers")}
            style={{
              padding: "6px 16px",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: activeTab === "transfers" ? "white" : "transparent",
              color: activeTab === "transfers" ? "#1e3a8a" : "#64748b",
              boxShadow: activeTab === "transfers" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
            }}
          >
            Transfer History
          </button>
          <button 
            onClick={() => setActiveTab("request")}
            style={{
              padding: "6px 16px",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: activeTab === "request" ? "white" : "transparent",
              color: activeTab === "request" ? "#1e3a8a" : "#64748b",
              boxShadow: activeTab === "request" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
            }}
          >
            New Request
          </button>
        </div>
      </div>

      {/* Tab: Transfers List */}
      {activeTab === "transfers" && (
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b", margin: "0 0 16px 0" }}>Transfer Directory</h2>
          {transfers.length === 0 ? (
            <div style={{ padding: "36px 0", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
              No transfer requests found. Click "New Request" to initiate a transfer.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>
                    <th style={{ padding: "12px 8px" }}>Asset</th>
                    <th style={{ padding: "12px 8px" }}>Asset Tag</th>
                    <th style={{ padding: "12px 8px" }}>Destination Type</th>
                    <th style={{ padding: "12px 8px" }}>Destination Details</th>
                    <th style={{ padding: "12px 8px" }}>Reason</th>
                    <th style={{ padding: "12px 8px" }}>Status</th>
                    <th style={{ padding: "12px 8px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((trans) => {
                    const badge = getStatusBadge(trans.status);
                    const destType = trans.toDepartmentId ? "Department" : "Employee";
                    const destVal = trans.toDepartment ? trans.toDepartment.name : (trans.toEmployee ? trans.toEmployee.name : "System Team");
                    
                    return (
                      <tr key={trans.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                        <td style={{ padding: "12px 8px", fontWeight: 500, color: "#0f172a" }}>{trans.asset?.name}</td>
                        <td style={{ padding: "12px 8px", fontFamily: "monospace", color: "#64748b" }}>{trans.asset?.assetTag}</td>
                        <td style={{ padding: "12px 8px" }}>{destType}</td>
                        <td style={{ padding: "12px 8px" }}>{destVal}</td>
                        <td style={{ padding: "12px 8px", color: "#475569" }}>{trans.checkInNotes || "No reason"}</td>
                        <td style={{ padding: "12px 8px" }}>
                          <span style={{ backgroundColor: badge.bg, color: badge.text, padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>
                            {trans.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px", textAlign: "center" }}>
                          {trans.status === "PENDING" ? (
                            <button 
                              onClick={() => handleCancelTransfer(trans.id)}
                              style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px", backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fee2e2", borderRadius: "6px", fontSize: "11.5px", fontWeight: 600, cursor: "pointer" }}
                            >
                              <Trash2 size={12} /> Cancel
                            </button>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>—</span>
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

      {/* Tab: New Request */}
      {activeTab === "request" && (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          
          {/* Request Form */}
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <ArrowRightLeft size={18} color="#1e3a8a" /> Request Asset Transfer
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

            <form onSubmit={handleRequestTransfer} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Select Asset to Transfer</label>
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
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Transfer To</label>
                <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
                    <input 
                      type="radio" 
                      name="destType" 
                      value="employee" 
                      checked={destinationType === "employee"} 
                      onChange={() => setDestinationType("employee")} 
                    />
                    <User size={14} /> Another Employee
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
                    <input 
                      type="radio" 
                      name="destType" 
                      value="department" 
                      checked={destinationType === "department"} 
                      onChange={() => setDestinationType("department")} 
                    />
                    <Building size={14} /> A Department
                  </label>
                </div>

                {destinationType === "employee" ? (
                  <select 
                    value={destEmployeeId} 
                    onChange={(e) => setDestEmployeeId(e.target.value)}
                    required
                    style={{ width: "100%", height: "38px", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0 8px", fontSize: "13px" }}
                  >
                    <option value="">-- Select Recipient Employee --</option>
                    {users.filter(u => u.id !== user?.id).map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                    {/* Fallback mock list if organization has no loaded users */}
                    {users.length === 0 && (
                      <>
                        <option value="m-ross-id">Mike Ross (m.ross@acme.com)</option>
                        <option value="s-jenkins-id">Sarah Jenkins (s.jenkins@acme.com)</option>
                      </>
                    )}
                  </select>
                ) : (
                  <select 
                    value={destDeptId} 
                    onChange={(e) => setDestDeptId(e.target.value)}
                    required
                    style={{ width: "100%", height: "38px", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0 8px", fontSize: "13px" }}
                  >
                    <option value="">-- Select Destination Department --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                    {departments.length === 0 && (
                      <>
                        <option value="d-eng-id">Engineering</option>
                        <option value="d-mkt-id">Marketing</option>
                        <option value="d-sales-id">Sales</option>
                      </>
                    )}
                  </select>
                )}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Reason for Transfer</label>
                <textarea 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why this resource is being transferred (e.g. employee department transfer, project change)..."
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
                Submit Request
              </button>
            </form>
          </div>

          {/* Info Side Panel */}
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", height: "fit-content" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", marginBottom: "12px" }}>Transfer Policy</h3>
            <p style={{ fontSize: "12.5px", color: "#64748b", lineHeight: "1.6", margin: 0 }}>
              Transfer requests are submitted to administration and department managers for verification. The transfer will only complete when approved by an authorized administrator. You can cancel your request while its status remains <strong>Pending</strong>.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};

export default Allocations;
