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
  LogOut
} from 'lucide-react';
import { cn } from '../../shared/utils/cn';
import { useAuth } from '../../modules/auth';

const navGroups = [
  {
    label: 'MAIN',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Notifications', path: '/notifications', icon: Bell },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { name: 'Organization Setup', path: '/organization', icon: Building2, roles: ['ADMIN'] },
      { name: 'Assets', path: '/assets', icon: Box, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD'] },
      { name: 'Allocation & Transfer', path: '/allocations', icon: ArrowRightLeft },
      { name: 'Resource Booking', path: '/booking', icon: CalendarClock },
      { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    ],
  },
  {
    label: 'REPORTS & COMPLIANCE',
    items: [
      { name: 'Audit', path: '/audit', icon: ClipboardCheck, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD'] },
      { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD'] },
    ],
  }
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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0 font-sans">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2 text-primary-600 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          AssetFlow
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
        {filteredNavGroups.map((group) => (
          <div key={group.label}>
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
                    isActive 
                      ? "text-primary-700 bg-primary-50" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r-md" />
                      )}
                      <item.icon size={18} className={isActive ? "text-primary-600" : "text-gray-400"} />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-gray-100 shrink-0 bg-gray-50/50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate capitalize">{displayName}</p>
              <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wide truncate">{displayRole}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shrink-0"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
