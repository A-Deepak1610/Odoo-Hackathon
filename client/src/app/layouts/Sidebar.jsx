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
  Bell 
} from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

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
      { name: 'Organization Setup', path: '/organization', icon: Building2 },
      { name: 'Assets', path: '/assets', icon: Box },
      { name: 'Allocation & Transfer', path: '/allocations', icon: ArrowRightLeft },
      { name: 'Resource Booking', path: '/booking', icon: CalendarClock },
      { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    ],
  },
  {
    label: 'REPORTS & COMPLIANCE',
    items: [
      { name: 'Audit', path: '/audit', icon: ClipboardCheck },
      { name: 'Reports', path: '/reports', icon: BarChart3 },
    ],
  }
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2 text-primary-600 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
            <Box size={20} />
          </div>
          AssetFlow
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
        {navGroups.map((group) => (
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

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
            JS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Jane Smith</p>
            <p className="text-xs text-gray-500 truncate">Org Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
