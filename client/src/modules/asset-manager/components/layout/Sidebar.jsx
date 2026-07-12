import React from 'react';
import { NavLink } from 'react-router-dom';
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
import { useAuth } from '../../../auth';

const navGroups = [
  {
    label: "MAIN",
    items: [
      { name: "Dashboard", path: "/asset-manager/dashboard", icon: LayoutDashboard },
      { name: "Activity Logs & Notifications", path: "/asset-manager/notifications", icon: Bell },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { name: 'Organization Setup', path: '/asset-manager/organization', icon: Building2, roles: ['ADMIN', 'SUPERADMIN'] },
      { name: 'Asset Registration & Directory', path: '/asset-manager/directory', icon: Box, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPERADMIN'] },
      { name: 'Asset Allocation & Transfer', path: '/asset-manager/allocations', icon: ArrowRightLeft },
      { name: 'Resource Booking', path: '/asset-manager/booking', icon: CalendarClock },
      { name: 'Maintenance Management', path: '/asset-manager/maintenance', icon: Wrench },
    ],
  },
  {
    label: "REPORTS & COMPLIANCE",
    items: [
      { name: 'Asset Audit', path: '/asset-manager/audit', icon: ClipboardCheck, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPERADMIN'] },
      { name: 'Reports & Analytics', path: '/asset-manager/reports', icon: BarChart3, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPERADMIN'] },
    ],
  },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

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
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 font-sans">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2 text-blue-900 font-bold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white">
            <Box size={20} />
          </div>
          AssetFlow
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        {filteredNavGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {group.label}
            </h3>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const IconComp = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-all relative ${
                        isActive 
                          ? "bg-blue-50 text-blue-900" 
                          : "text-slate-900 hover:bg-slate-50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-900 rounded-r-md" />
                        )}
                        <IconComp
                          size={18}
                          className={isActive ? "text-blue-900" : "text-slate-400"}
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
      <div className="p-4 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors hover:bg-slate-50 group">
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 m-0 truncate">{displayName}</p>
            <p className="text-xs font-semibold text-slate-500 m-0 mt-0.5 truncate uppercase">{displayRole}</p>
          </div>
          <button 
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-slate-400 bg-transparent border-none rounded-lg cursor-pointer flex items-center justify-center transition-all hover:text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
