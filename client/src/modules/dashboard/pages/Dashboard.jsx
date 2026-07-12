import React, { useState, useEffect } from "react";
import {
  Box as BoxIcon,
  ArrowRightLeft,
  Wrench,
  CalendarClock,
  RotateCcw,
  Plus,
  Activity,
  TrendingUp,
  Loader2,
  AlertTriangle,
  FileText,
  User,
  ArrowLeftRight
} from "lucide-react";
import { useAuth } from "../../auth";
import { apiFetch } from "../../../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  
  // States for Employee Dashboard
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role === 'EMPLOYEE') {
      const fetchEmployeeData = async () => {
        try {
          setLoading(true);
          const res = await apiFetch('/api/v1/dashboard/employee');
          const result = await res.json();
          if (res.ok && result.success) {
            setData(result.data);
          } else {
            setError(result.message || 'Failed to load dashboard data.');
          }
        } catch (err) {
          setError('Failed to connect to backend server.');
        } finally {
          setLoading(false);
        }
      };
      fetchEmployeeData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Trigger useEffect reload
    const event = new Event('storage');
    window.dispatchEvent(event);
  };

  // ── RENDER LOADING STATE ───
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        gap: '16px',
        fontFamily: 'Inter, sans-serif'
      }}>
        <Loader2 size={36} className="animate-spin" style={{ color: '#1e3a8a' }} />
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
          Assembling your personal dashboard...
        </p>
      </div>
    );
  }

  // ── RENDER ERROR STATE ───
  if (error && user?.role === 'EMPLOYEE') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ef4444',
          marginBottom: '16px'
        }}>
          <AlertTriangle size={28} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
          Unable to Load Dashboard
        </h3>
        <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '380px', margin: '0 0 20px 0', lineHeight: 1.5 }}>
          {error}. Please check your connection and ensure the database seeder has been executed.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── EMPLOYEE DASHBOARD VIEW ───
  if (user?.role === 'EMPLOYEE' && data) {
    const statsCards = [
      {
        icon: BoxIcon,
        label: "My Assets",
        value: data.cards.myAssetsCount,
        color: "#1e3a8a",
        bg: "#eff6ff",
      },
      {
        icon: CalendarClock,
        label: "Active Bookings",
        value: data.cards.activeBookingsCount,
        color: "#7c3aed",
        bg: "#f3e8ff",
      },
      {
        icon: Wrench,
        label: "Pending Maintenance",
        value: data.cards.pendingMaintenanceCount,
        color: "#b45309",
        bg: "#fef3c7",
      },
      {
        icon: ArrowRightLeft,
        label: "Pending Transfers",
        value: data.cards.pendingTransfersCount,
        color: "#16a34a",
        bg: "#ecfdf5",
      },
    ];

    const employeeQuickActions = [
      {
        icon: CalendarClock,
        label: "Book Resource",
        description: "Schedule a shared room or equipment",
        color: "#7c3aed",
        bg: "#f3e8ff",
      },
      {
        icon: Wrench,
        label: "Raise Maintenance",
        description: "Report an issue with your materials",
        color: "#b45309",
        bg: "#fef3c7",
      },
      {
        icon: ArrowLeftRight,
        label: "Request Transfer",
        description: "Reallocate an asset to another user",
        color: "#16a34a",
        bg: "#ecfdf5",
      },
    ];

    const getMaintStatusColor = (status) => {
      if (status === "PENDING") return { bg: "#f1f5f9", text: "#475569" };
      if (status === "APPROVED") return { bg: "#e0f2fe", text: "#0369a1" };
      if (status === "IN_PROGRESS") return { bg: "#fef3c7", text: "#b45309" };
      if (status === "RESOLVED") return { bg: "#dcfce7", text: "#15803d" };
      return { bg: "#fee2e2", text: "#b91c1c" };
    };

    return (
      <div style={{
        padding: "24px 32px",
        maxWidth: "1400px",
        margin: "0 auto",
        fontFamily: "Inter, sans-serif",
      }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{
            fontSize: "26px",
            fontWeight: 700,
            margin: "0 0 6px 0",
            color: "#1e293b",
            textTransform: 'capitalize'
          }}>
            Welcome back, {user.name || user.email.split('@')[0]}
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Here is a summary of your assigned organizational resources and active schedules.
          </p>
        </div>

        {/* Personalized Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "28px",
        }}>
          {statsCards.map((stat, i) => (
            <div key={i} style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: stat.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <stat.icon size={22} color={stat.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500, marginBottom: "4px" }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#1e293b" }}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions (Employee Specific) */}
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", margin: "0 0 16px 0" }}>
            Self-Service Actions
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px",
          }}>
            {employeeQuickActions.map((action, i) => (
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
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: action.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <action.icon size={22} color={action.color} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b", marginBottom: "2px" }}>
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

        {/* Content Split Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
          
          {/* LEFT: Assigned Assets and Schedules */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* My Assets List */}
            <div style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "20px",
            }}>
              <h3 style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#1e293b",
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <BoxIcon size={16} color="#1e3a8a" />
                My Assigned Materials
              </h3>
              
              {data.myAssets.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                  No materials currently assigned to you.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b' }}>
                        <th style={{ padding: '8px 4px', fontWeight: 500 }}>Asset Name</th>
                        <th style={{ padding: '8px 4px', fontWeight: 500 }}>Tag ID</th>
                        <th style={{ padding: '8px 4px', fontWeight: 500 }}>Category</th>
                        <th style={{ padding: '8px 4px', fontWeight: 500 }}>Condition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.myAssets.map((asset) => (
                        <tr key={asset.id} style={{ borderBottom: '1px solid #f8fafc', color: '#0f172a' }}>
                          <td style={{ padding: '10px 4px', fontWeight: 500 }}>{asset.name}</td>
                          <td style={{ padding: '10px 4px', color: '#64748b' }}>{asset.assetTag}</td>
                          <td style={{ padding: '10px 4px' }}>
                            <span style={{
                              backgroundColor: '#f1f5f9',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 500,
                            }}>{asset.category.name}</span>
                          </td>
                          <td style={{ padding: '10px 4px', color: '#0f766e', fontWeight: 500 }}>{asset.condition || 'Good'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Upcoming Schedules (Bookings and Returns) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              
              {/* Upcoming Bookings */}
              <div style={{
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                padding: "20px",
              }}>
                <h3 style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1e293b",
                  margin: "0 0 12px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <CalendarClock size={16} color="#7c3aed" />
                  Upcoming Bookings
                </h3>
                {data.upcomingBookings.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0' }}>No future reservations.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {data.upcomingBookings.map((book) => (
                      <div key={book.id} style={{
                        padding: '10px',
                        backgroundColor: '#f9f5ff',
                        borderRadius: '8px',
                        borderLeft: '4px solid #7c3aed',
                        fontSize: '12px',
                      }}>
                        <div style={{ fontWeight: 600, color: '#5b21b6', marginBottom: '2px' }}>{book.asset.name}</div>
                        <div style={{ color: '#6d28d9' }}>
                          {new Date(book.startTime).toLocaleDateString()} @ {new Date(book.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Returns */}
              <div style={{
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                padding: "20px",
              }}>
                <h3 style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1e293b",
                  margin: "0 0 12px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <RotateCcw size={16} color="#b45309" />
                  Upcoming Returns
                </h3>
                {data.upcomingReturns.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0' }}>No assets due for return.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {data.upcomingReturns.map((ret) => (
                      <div key={ret.id} style={{
                        padding: '10px',
                        backgroundColor: '#fffbeb',
                        borderRadius: '8px',
                        borderLeft: '4px solid #b45309',
                        fontSize: '12px',
                      }}>
                        <div style={{ fontWeight: 600, color: '#92400e', marginBottom: '2px' }}>{ret.asset.name}</div>
                        <div style={{ color: '#b45309' }}>
                          Due Date: {new Date(ret.expectedReturnDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Maintenance Request Tracker */}
            <div style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "20px",
            }}>
              <h3 style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#1e293b",
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <Wrench size={16} color="#b45309" />
                Maintenance Status
              </h3>
              {data.maintenanceStatus.length === 0 ? (
                <div style={{ padding: '12px 0', color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>
                  No maintenance requests submitted.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.maintenanceStatus.map((maint) => {
                    const statusStyle = getMaintStatusColor(maint.status);
                    return (
                      <div key={maint.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'between',
                        padding: '10px 12px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}>
                        <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                          <span style={{ fontWeight: 600, color: '#334155' }}>{maint.asset.name}</span>
                          <span style={{ color: '#64748b', marginLeft: '6px' }}>— "{maint.description}"</span>
                        </div>
                        <span style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}>{maint.status}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Activity Log and Assistance */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Activity Stream */}
            <div style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "20px",
            }}>
              <h3 style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#1e293b",
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <Activity size={16} color="#1e3a8a" />
                Recent Activities
              </h3>
              
              {data.recentActivities.length === 0 ? (
                <div style={{ padding: '16px 0', color: '#94a3b8', fontSize: '12px', textAlign: 'center' }}>
                  No recent activities recorded.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: '14px' }}>
                  {data.recentActivities.map((act) => (
                    <div key={act.id} style={{ display: 'flex', gap: '10px', fontSize: '12.5px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: act.type === 'ALLOCATION' ? '#1e3a8a' : act.type === 'BOOKING' ? '#7c3aed' : '#b45309',
                        marginTop: '5px',
                        flexShrink: 0,
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#334155', fontWeight: 500, lineHeight: '1.4' }}>{act.message}</div>
                        <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assistance Card */}
            <div style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
              borderRadius: "12px",
              padding: "20px",
              color: "white",
            }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 8px 0" }}>
                Employee Portal Help
              </h3>
              <p style={{
                fontSize: "12px",
                color: "#bfdbfe",
                margin: "0 0 12px 0",
                lineHeight: "1.5",
              }}>
                Review resources guidelines or submit re-allocation requests to the logistics team.
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
                onMouseOver={(e) => e.currentTarget.style.background = "#f1f5f9"}
                onMouseOut={(e) => e.currentTarget.style.background = "white"}
              >
                Read Guidelines
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ── DEFAULT ADMIN DASHBOARD VIEW ───
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
                <BoxIcon size={22} color={stat.color} />
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
