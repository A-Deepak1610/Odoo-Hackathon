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
  ArrowLeftRight,
  AlertCircle,
  Package
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAuth } from "../../auth";
import { apiFetch } from "../../../services/api";
import { useNavigate } from "react-router-dom";

const MOCK_BOOKINGS = [
  { id: "book-1", startTime: "2026-07-15T10:00", endTime: "2026-07-15T12:00", status: "UPCOMING", asset: { id: "res-1", name: "Boardroom 3B", location: "Building A, 3rd Floor" } },
  { id: "book-2", startTime: "2026-07-12T09:00", endTime: "2026-07-12T17:00", status: "ONGOING", asset: { id: "res-2", name: "Tesla Model 3 (Shared Vehicle)", location: "Parking Lot B" } },
  { id: "book-3", startTime: "2026-07-10T14:00", endTime: "2026-07-10T15:30", status: "CANCELLED", asset: { id: "res-3", name: "Epson Projector Pro", location: "IT Hub" } }
];

const MOCK_ASSETS = [
  { id: "asset-1", name: "MacBook Pro 16\"", assetTag: "AST-2026-001", category: { name: "Laptop" }, condition: "Excellent" },
  { id: "asset-2", name: "Dell 27\" Monitor", assetTag: "AST-2026-002", category: { name: "Monitor" }, condition: "Good" },
  { id: "asset-3", name: "Keychron K2 Keyboard", assetTag: "AST-2026-003", category: { name: "Peripherals" }, condition: "Good" },
  { id: "asset-4", name: "Logitech MX Master 3S Mouse", assetTag: "AST-2026-004", category: { name: "Peripherals" }, condition: "Excellent" }
];

const MOCK_TICKETS = [
  { id: "ticket-1", asset: { name: "MacBook Pro 16\"", assetTag: "AST-2026-001" }, description: "Battery health degraded below 70%, laptop shuts down unexpectedly.", priority: "HIGH", createdAt: "2026-07-01T10:00:00.000Z", status: "IN_PROGRESS", assignedTechnician: "Sarah Connor (IT Dept)" },
  { id: "ticket-2", asset: { name: "Dell 27\" Monitor", assetTag: "AST-2026-002" }, description: "Flickering issue on the screen when connected via USB-C.", priority: "MEDIUM", createdAt: "2026-07-05T14:30:00.000Z", status: "PENDING", assignedTechnician: "" },
  { id: "ticket-3", asset: { name: "Keychron K2 Keyboard", assetTag: "AST-2026-003" }, description: "Spacebar key is double-pressing.", priority: "LOW", createdAt: "2026-06-25T09:15:00.000Z", status: "RESOLVED", assignedTechnician: "John Doe (IT Dept)" }
];

const MOCK_TRANSFERS = [
  { id: "trans-1", status: "PENDING", checkInNotes: "Moving to Design team, transferring screen to Jane Smith.", asset: { name: "Dell 27\" Monitor", assetTag: "AST-2026-002" }, toEmployee: { name: "Jane Smith" }, toDepartment: null },
  { id: "trans-2", status: "APPROVED", checkInNotes: "Keyboard needed for new tester in Engineering department.", asset: { name: "Keychron K2 Keyboard", assetTag: "AST-2026-003" }, toEmployee: null, toDepartment: { name: "Engineering" } }
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // States for Employee Dashboard
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role === 'EMPLOYEE') {
      const fetchEmployeeData = () => {
        try {
          setLoading(true);
          setError(null);

          let storedBookings = localStorage.getItem("assertflow_bookings");
          if (!storedBookings) {
            storedBookings = JSON.stringify(MOCK_BOOKINGS);
            localStorage.setItem("assertflow_bookings", storedBookings);
          }
          const bookings = JSON.parse(storedBookings);

          let storedTickets = localStorage.getItem("assertflow_tickets");
          if (!storedTickets) {
            storedTickets = JSON.stringify(MOCK_TICKETS);
            localStorage.setItem("assertflow_tickets", storedTickets);
          }
          const tickets = JSON.parse(storedTickets);

          let storedTransfers = localStorage.getItem("assertflow_transfers");
          if (!storedTransfers) {
            storedTransfers = JSON.stringify(MOCK_TRANSFERS);
            localStorage.setItem("assertflow_transfers", storedTransfers);
          }
          const transfers = JSON.parse(storedTransfers);

          let storedAssets = localStorage.getItem("assertflow_assets");
          if (!storedAssets) {
            storedAssets = JSON.stringify(MOCK_ASSETS);
            localStorage.setItem("assertflow_assets", storedAssets);
          }
          const assets = JSON.parse(storedAssets);

          const activeBookingsCount = bookings.filter(b => b.status === "UPCOMING" || b.status === "ONGOING").length;
          const pendingMaintenanceCount = tickets.filter(t => t.status === "PENDING" || t.status === "IN_PROGRESS" || t.status === "APPROVED").length;
          const pendingTransfersCount = transfers.filter(t => t.status === "PENDING").length;

          const upcomingReturns = [
            { id: "ret-1", asset: { name: "Dell 27\" Monitor" }, expectedReturnDate: "2026-07-20T17:00:00.000Z" }
          ];

          const recentActivities = [];
          bookings.forEach(b => {
            recentActivities.push({
              id: `act-b-${b.id}`,
              type: "BOOKING",
              message: `${b.asset.name} reservation is ${b.status.toLowerCase()}`,
              time: "Recent"
            });
          });
          tickets.forEach(t => {
            recentActivities.push({
              id: `act-t-${t.id}`,
              type: "MAINTENANCE",
              message: `Maintenance for ${t.asset.name} is ${t.status.toLowerCase()}`,
              time: "Recent"
            });
          });
          transfers.forEach(tr => {
            recentActivities.push({
              id: `act-tr-${tr.id}`,
              type: "ALLOCATION",
              message: `Transfer request for ${tr.asset?.name} is ${tr.status.toLowerCase()}`,
              time: "Recent"
            });
          });

          recentActivities.reverse();

          const dashboardData = {
            cards: {
              myAssetsCount: assets.length,
              activeBookingsCount,
              pendingMaintenanceCount,
              pendingTransfersCount
            },
            myAssets: assets,
            upcomingBookings: bookings.filter(b => b.status === "UPCOMING" && new Date(b.startTime) > new Date()),
            upcomingReturns,
            maintenanceStatus: tickets,
            recentActivities: recentActivities.slice(0, 5)
          };

          setData(dashboardData);
        } catch (err) {
          setError("Failed to compile dashboard data.");
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
        path: "/booking",
        color: "#7c3aed",
        bg: "#f3e8ff",
      },
      {
        icon: Wrench,
        label: "Raise Maintenance",
        description: "Report an issue with your materials",
        path: "/maintenance",
        color: "#b45309",
        bg: "#fef3c7",
      },
      {
        icon: ArrowLeftRight,
        label: "Request Transfer",
        description: "Reallocate an asset to another user",
        path: "/allocations",
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
                onClick={() => navigate(action.path)}
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
  const adminStats = [
    { label: "Available", value: "128", icon: BoxIcon, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Allocated", value: "76", icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Under Maintenance", value: "4", icon: Wrench, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Active Bookings", value: "9", icon: CalendarClock, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Transfers", value: "3", icon: ArrowRightLeft, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Upcoming Returns", value: "12", icon: RotateCcw, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const quickActions = [
    {
      icon: Plus,
      label: "Register Asset",
      description: "Add a new asset to the registry",
      path: "/assets",
      color: "#1e3a8a",
      bg: "#eff6ff",
    },
    {
      icon: CalendarClock,
      label: "Book Resource",
      description: "Schedule a shared resource",
      path: "/booking",
      color: "#16a34a",
      bg: "#ecfdf5",
    },
    {
      icon: Wrench,
      label: "Raise Maintenance",
      description: "Report an issue or repair",
      path: "/maintenance",
      color: "#b45309",
      bg: "#fef3c7",
    },
  ];

  const recentActivity = [
    { log: "Laptop AF-0114 - allocated to Priya Shah - IT dept", time: "10 mins ago", color: "bg-blue-500" },
    { log: "Room B2 - booking confirmed - 2:00 to 3:00 PM", time: "1 hour ago", color: "bg-purple-500" },
    { log: "Projector AF-0062 - maintenance resolved", time: "2 hours ago", color: "bg-emerald-500" },
  ];

  const allocationData = [
    { name: 'Engineering', value: 45 },
    { name: 'Marketing', value: 25 },
    { name: 'Sales', value: 20 },
    { name: 'HR', value: 10 },
  ];
  const COLORS = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'];

  const categoryData = [
    { name: 'Laptops', count: 120 },
    { name: 'Phones', count: 80 },
    { name: 'Desktops', count: 40 },
    { name: 'Vehicles', count: 15 },
  ];

  return (
    <div className="p-8 pb-20 max-w-[1400px] mx-auto font-sans">
      <div className="mb-6">  
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Today's Overview</h1>
        <p className="text-sm text-slate-500">Real-time snapshot of your organization's resources.</p>
      </div>

      {/* STAT CARDS (6-col grid) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {adminStats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={16} className={stat.color} />
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
              onClick={() => navigate(action.path)}
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

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action, i) => (
          <button key={i} className={`bg-white border-2 rounded-xl p-4 flex items-center justify-center gap-3 transition-all group ${action.color} shadow-sm`}>
            <div className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <action.icon size={20} className={action.iconColor} />
            </div>
            <span className="font-semibold text-slate-700">{action.label}</span>
          </button>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity size={18} className="text-blue-700" /> Recent Activity
          </h3>
          <div className="space-y-6">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 ${act.color} shadow-sm`} />
                <div>
                  <p className="text-sm text-slate-700 leading-snug font-medium">{act.log}</p>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INSIGHTS (Recharts) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Allocation by Dept</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={allocationData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Asset Categories</h3>
            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
