import React, { useState } from "react";
import { User, Phone, MapPin, Key, Save, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { apiFetch } from "../../../services/api";

const ProfilePage = () => {
  const { user, login } = useAuth(); // login exposes the update user helper

  // Profile fields state
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
  const [passMsg, setPassMsg] = useState({ text: "", type: "" });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ text: "", type: "" });

    try {
      const res = await apiFetch("/api/v1/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, address, avatarUrl }),
      });
      const result = await res.json();
      
      if (res.ok && result.success) {
        setProfileMsg({ text: "Profile updated successfully!", type: "success" });
        // Force refresh session state in React Context by saving token & user info
        const storedAuth = JSON.parse(localStorage.getItem("auth_session"));
        if (storedAuth) {
          storedAuth.user = result.data.user;
          localStorage.setItem("auth_session", JSON.stringify(storedAuth));
          window.dispatchEvent(new Event("storage")); // Trigger Context reload
        }
      } else {
        setProfileMsg({ text: result.message || "Failed to update profile", type: "error" });
      }
    } catch (err) {
      setProfileMsg({ text: "Network error occurred.", type: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ text: "", type: "" });

    if (newPassword !== confirmPassword) {
      setPassMsg({ text: "New passwords do not match.", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setPassMsg({ text: "New password must be at least 6 characters.", type: "error" });
      return;
    }

    setChangingPass(true);

    try {
      const res = await apiFetch("/api/v1/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setPassMsg({ text: "Password changed successfully!", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPassMsg({ text: result.message || "Incorrect current password.", type: "error" });
      }
    } catch (err) {
      setPassMsg({ text: "Network error occurred.", type: "error" });
    } finally {
      setChangingPass(false);
    }
  };

  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : "U";

  return (
    <div style={{
      padding: "24px 32px",
      maxWidth: "1100px",
      margin: "0 auto",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 6px 0", color: "#1e293b" }}>My Profile</h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>View and update your personal details and account settings.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
        
        {/* Left Side: Avatar and Non-Changeable Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Profile Avatar"
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "16px",
                  border: "2px solid #e2e8f0"
                }}
                onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}` }}
              />
            ) : (
              <div style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                backgroundColor: "#eff6ff",
                color: "#1e3a8a",
                fontSize: "32px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px"
              }}>
                {initials}
              </div>
            )}
            
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>{user?.name}</h2>
            <span style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#1e3a8a",
              backgroundColor: "#eff6ff",
              padding: "4px 10px",
              borderRadius: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>{user?.role.replace(/_/g, ' ')}</span>

            <div style={{
              width: "100%",
              marginTop: "24px",
              borderTop: "1px solid #f1f5f9",
              paddingTop: "16px",
              textAlign: "left",
              fontSize: "13px",
              color: "#475569",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              <div>
                <span style={{ fontWeight: 600, color: "#94a3b8", display: "block", fontSize: "11px", textTransform: "uppercase" }}>Employee ID</span>
                <span style={{ fontWeight: 500, fontFamily: "monospace", color: "#0f172a" }}>{user?.id.substring(0, 8).toUpperCase()}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: "#94a3b8", display: "block", fontSize: "11px", textTransform: "uppercase" }}>Email Address</span>
                <span style={{ fontWeight: 500, color: "#0f172a" }}>{user?.email}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: "#94a3b8", display: "block", fontSize: "11px", textTransform: "uppercase" }}>Department</span>
                <span style={{ fontWeight: 500, color: "#0f172a" }}>{user?.departmentId ? "Engineering" : "General Operations"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Update Fields & Password Change */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Profile Form */}
          <div style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "24px"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={18} color="#1e3a8a" /> Profile Details
            </h3>

            {profileMsg.text && (
              <div style={{
                padding: "10px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: profileMsg.type === "success" ? "#dcfce7" : "#fee2e2",
                color: profileMsg.type === "success" ? "#15803d" : "#b91c1c"
              }}>
                <AlertCircle size={16} /> {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Phone Number</label>
                  <div style={{ position: "relative" }}>
                    <Phone size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      style={{
                        width: "100%",
                        paddingLeft: "34px",
                        paddingRight: "10px",
                        height: "36px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        fontSize: "13px",
                        color: "#0f172a"
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Profile Image URL</label>
                  <input 
                    type="text" 
                    value={avatarUrl} 
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    style={{
                      width: "100%",
                      paddingLeft: "12px",
                      paddingRight: "10px",
                      height: "36px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "13px",
                      color: "#0f172a"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Mailing Address</label>
                <div style={{ position: "relative" }}>
                  <MapPin size={16} style={{ position: "absolute", left: "10px", top: "10px", color: "#94a3b8" }} />
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Corporate Blvd, Suite 100"
                    rows={3}
                    style={{
                      width: "100%",
                      paddingLeft: "34px",
                      paddingRight: "10px",
                      paddingTop: "8px",
                      paddingBottom: "8px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "13px",
                      color: "#0f172a",
                      resize: "none",
                      fontFamily: "Inter, sans-serif"
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                style={{
                  alignSelf: "flex-end",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#1e3a8a",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {savingProfile ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save Changes
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "24px"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <Key size={18} color="#b45309" /> Security & Password
            </h3>

            {passMsg.text && (
              <div style={{
                padding: "10px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: passMsg.type === "success" ? "#dcfce7" : "#fee2e2",
                color: passMsg.type === "success" ? "#15803d" : "#b91c1c"
              }}>
                <AlertCircle size={16} /> {passMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    paddingLeft: "12px",
                    paddingRight: "10px",
                    height: "36px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "#0f172a"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      paddingLeft: "12px",
                      paddingRight: "10px",
                      height: "36px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "13px",
                      color: "#0f172a"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      paddingLeft: "12px",
                      paddingRight: "10px",
                      height: "36px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "13px",
                      color: "#0f172a"
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPass}
                style={{
                  alignSelf: "flex-end",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#b45309",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {changingPass ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
                Update Password
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
