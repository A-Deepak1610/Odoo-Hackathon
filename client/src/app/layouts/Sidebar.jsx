import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Box, 
  ArrowRightLeft, 
  CalendarClock, 
  Wrench, 
  ClipboardCheck, 
  BarChart3, 
  Bell,
  Bot,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../modules/auth';

const navGroups = [
  {
    label: "MAIN",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "Notifications", path: "/notifications", icon: Bell },
    ],
  },
  {
    label: "MANAGEMENT",    
    items: [
<<<<<<< HEAD
      { name: 'Assets', path: '/admin/assets', icon: Box, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD'] },
=======
      { name: 'Organization Setup', path: '/organization', icon: Building2, roles: ['ADMIN', 'SUPERADMIN'] },
      { name: 'Assets', path: '/assets', icon: Box, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPERADMIN', 'EMPLOYEE'] },
>>>>>>> ac64105ae519cd60a7787a78173a1a5a8ac3debb
      { name: 'Allocation & Transfer', path: '/allocations', icon: ArrowRightLeft },
      { name: 'Resource Booking', path: '/booking', icon: CalendarClock },
      { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    ],
  },
  {
    label: "REPORTS & COMPLIANCE",
    items: [
<<<<<<< HEAD
      { name: 'Audit', path: '/admin/audit', icon: ClipboardCheck, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD'] },
      { name: 'Reports', path: '/admin/reports', icon: BarChart3, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD'] },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      { name: 'Organization Setup', path: '/admin/organization', icon: Building2, roles: ['ADMIN'] },
      { name: "DB Assistant", path: "/admin/db-assistant", icon: Bot, roles: ['ADMIN'] },
=======
      { name: 'Audit', path: '/audit', icon: ClipboardCheck, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPERADMIN'] },
      { name: "DB Assistant", path: "/db-assistant", icon: Bot },
      { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPERADMIN'] },
>>>>>>> ac64105ae519cd60a7787a78173a1a5a8ac3debb
    ],
  },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'User');
  const initials = displayName.substring(0, 2).toUpperCase();
  const displayRole = user?.role ? user.role.replace(/_/g, ' ') : 'EMPLOYEE';

  // Filter navigation items based on user role permissions
  const filteredNavGroups = navGroups.map(group => {
    const items = group.items.filter(item => {
      if (!item.roles) return true;
      return user && item.roles.includes(user.role);
    });
    return { ...group, items };
  }).filter(group => group.items.length > 0);

  return (
    <aside
      style={{
        width: "256px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flexShrink: 0,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Logo Area */}
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "24px",
          paddingRight: "24px",
          borderBottom: "1px solid #f1f5f9",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#1e3a8a",
            fontWeight: "700",
            fontSize: "18px",
            letterSpacing: "-0.5px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#1e3a8a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
            }}
          >
            <Box size={20} />
          </div>
          AssetFlow
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingTop: '16px',
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingBottom: '16px',
      }}>
        {filteredNavGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: '24px' }}>
            <h3 style={{
              paddingLeft: '12px',
              paddingRight: '12px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
            }}>
              {group.label}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {group.items.map((item) => {
                const IconComp = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    style={({ isActive }) => ({
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      paddingLeft: "12px",
                      paddingRight: "12px",
                      paddingTop: "8px",
                      paddingBottom: "8px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      textDecoration: "none",
                      transition: "all 0.2s",
                      position: "relative",
                      backgroundColor: isActive ? "#f0f9ff" : "transparent",
                      color: isActive ? "#1e3a8a" : "#0f172a",
                    })}
                    onMouseOver={(e) => {
                      if (
                        e.currentTarget.getAttribute("aria-current") !== "page"
                      ) {
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (
                        e.currentTarget.getAttribute("aria-current") !== "page"
                      ) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: "4px",
                              backgroundColor: "#1e3a8a",
                              borderRadius: "0 4px 4px 0",
                            }}
                          />
                        )}
                        <IconComp
                          size={18}
                          style={{
                            color: isActive ? "#1e3a8a" : "#94a3b8",
                          }}
                        />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #f1f5f9',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingTop: '8px',
          paddingBottom: '8px',
          paddingLeft: '8px',
          paddingRight: '8px',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onClick={() => navigate('/profile')}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#f8fafc';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e3a8a',
            fontWeight: '700',
            fontSize: '14px',
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#0f172a',
              margin: '0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>{displayName}</p>
            <p style={{
              fontSize: '12px',
              color: '#64748b',
              margin: '2px 0 0 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textTransform: 'uppercase',
            }}>{displayRole}</p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }}
            title="Log Out"
            style={{
              padding: '6px',
              color: '#94a3b8',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#ef4444';
              e.currentTarget.style.backgroundColor = '#fee2e2';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
