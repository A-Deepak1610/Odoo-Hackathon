import React, { useState } from 'react';
import { 
  Bell, AlertTriangle, Calendar, Wrench, ArrowRightLeft, 
  ClipboardCheck, Search, Filter, Check, CheckCircle2, 
  Clock, Box, ShieldAlert, ArrowDownToLine
} from 'lucide-react';
import { DashboardCard } from '../components';

// Static Data
const TABS = [
  { id: 'all', label: 'All Activity', count: 14 },
  { id: 'alerts', label: 'Alerts', count: 2 },
  { id: 'bookings', label: 'Bookings', count: 4 },
  { id: 'maintenance', label: 'Maintenance', count: 3 },
  { id: 'transfers', label: 'Transfers', count: 4 },
  { id: 'audit', label: 'Audit', count: 1 }
];

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'alerts',
    title: 'Asset Overdue Warning',
    message: 'Dell XPS 15 (AST-2024-042) is 48 hours overdue for return by Sarah Jenkins.',
    timestamp: '10 mins ago',
    unread: true,
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200'
  },
  {
    id: 2,
    type: 'bookings',
    title: 'New Booking Request',
    message: 'Mike Ross requested Conference Projector A for Tomorrow, 2:00 PM.',
    timestamp: '1 hour ago',
    unread: true,
    icon: Calendar,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  {
    id: 3,
    type: 'maintenance',
    title: 'Maintenance Ticket Resolved',
    message: 'Ticket TKT-1029 for Screen flickering has been closed by IT Support.',
    timestamp: '3 hours ago',
    unread: false,
    icon: Wrench,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  },
  {
    id: 4,
    type: 'transfers',
    title: 'Transfer Approved',
    message: 'Department transfer for Sony A7IV Camera to Marketing is approved.',
    timestamp: 'Yesterday',
    unread: false,
    icon: ArrowRightLeft,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  {
    id: 5,
    type: 'audit',
    title: 'Q3 Audit Cycle Closed',
    message: 'The audit cycle was finalized by System Admin. 2 discrepancies recorded.',
    timestamp: '2 days ago',
    unread: false,
    icon: ClipboardCheck,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'border-slate-200'
  }
];

const MOCK_LOGS = [
  { id: 'L-8901', user: 'System', action: 'Auto-generated Maintenance Ticket', target: 'HVAC Unit 2', time: 'Oct 24, 09:41 AM', status: 'Success' },
  { id: 'L-8900', user: 'Jane Doe (Admin)', action: 'Updated Asset Record', target: 'AST-2024-001', time: 'Oct 24, 08:30 AM', status: 'Success' },
  { id: 'L-8899', user: 'John Smith', action: 'Failed Login Attempt', target: 'Portal', time: 'Oct 24, 07:15 AM', status: 'Failed' },
  { id: 'L-8898', user: 'Sarah Jenkins', action: 'Downloaded Report', target: 'Q3_Audit.pdf', time: 'Oct 23, 16:45 PM', status: 'Success' },
  { id: 'L-8897', user: 'System', action: 'Database Backup Completed', target: 'Server', time: 'Oct 23, 02:00 AM', status: 'Success' },
];


const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const filteredNotifs = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Activity Logs & Notifications
            {unreadCount > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full ml-2 border border-blue-200">
                {unreadCount} New
              </span>
            )}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Monitor system alerts, requests, and historical activity logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Column - Notifications Feed */}
        <div className="xl:col-span-2 space-y-6">
          <DashboardCard title="Notification Center">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 mt-2">
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar">
                {TABS.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none ${
                      activeTab === tab.id 
                        ? 'bg-slate-800 text-white shadow-sm' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={markAllRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={16} /> Mark All Read
                </button>
              </div>
            </div>

            {/* Notification Feed */}
            <div className="space-y-3">
              {filteredNotifs.length > 0 ? (
                filteredNotifs.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`relative p-4 rounded-xl border transition-all ${
                      notif.unread 
                        ? 'bg-blue-50/30 border-blue-200 hover:bg-blue-50/50 hover:shadow-sm' 
                        : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {/* Unread Indicator Dot */}
                    {notif.unread && (
                      <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-blue-600 rounded-full shadow-sm"></div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-lg border shrink-0 mt-0.5 ${notif.bg} ${notif.color} ${notif.border}`}>
                        <notif.icon size={20} />
                      </div>
                      <div className="flex-1 pr-6">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-bold ${notif.unread ? 'text-slate-900' : 'text-slate-800'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-xs font-medium text-slate-400">• {notif.timestamp}</span>
                        </div>
                        <p className={`text-sm ${notif.unread ? 'text-slate-700' : 'text-slate-600'}`}>
                          {notif.message}
                        </p>
                        
                        {notif.unread && (
                          <div className="mt-3 flex gap-2">
                            <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors">
                              View Details
                            </button>
                            <button 
                              onClick={() => markRead(notif.id)}
                              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 transition-colors"
                            >
                              Mark Read
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                  <Bell size={48} className="mb-4 opacity-20" />
                  <p className="font-semibold text-slate-600">No notifications to display</p>
                  <p className="text-sm">You're all caught up in this category!</p>
                </div>
              )}
            </div>
            
          </DashboardCard>
        </div>

        {/* Right Column - Activity Log Table */}
        <div className="space-y-6">
          <DashboardCard 
            title="System Activity Log" 
            action={
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors">
                <ArrowDownToLine size={16} />
              </button>
            }
          >
            <div className="relative mb-4 mt-2">
              <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search system logs..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-slate-50"
              />
            </div>

            <div className="space-y-0 relative">
              {/* Vertical line connecting logs */}
              <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200 -z-0"></div>

              {MOCK_LOGS.map((log, index) => (
                <div key={log.id} className="relative z-10 flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors group">
                  <div className={`mt-1.5 w-2 h-2 rounded-full ring-4 ring-white shrink-0 ${log.status === 'Success' ? 'bg-slate-400 group-hover:bg-blue-500' : 'bg-red-500'}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="text-sm font-bold text-slate-800 truncate">{log.action}</p>
                      <span className="text-xs font-mono text-slate-400 shrink-0 ml-2">{log.id}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate"><span className="font-medium text-slate-700">{log.user}</span> → {log.target}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors focus:outline-none">
              Load More Logs
            </button>
          </DashboardCard>
        </div>

      </div>
    </div>
  );
};

export default NotificationsPage;
