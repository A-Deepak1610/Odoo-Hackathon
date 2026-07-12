import React from 'react';
import { Building2, Users, Activity, ShieldCheck } from 'lucide-react';
import { useSuperAdmin } from '../store/SuperAdminContext';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
      </div>
    </div>
  </div>
);

const SuperAdminDashboard = () => {
  const { tenants } = useSuperAdmin();

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === 'Active').length;
  const totalUsers = tenants.reduce((acc, curr) => acc + curr.usersCount, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Global overview of all tenants and system health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Tenants" 
          value={totalTenants} 
          icon={Building2} 
          colorClass="bg-blue-600 text-blue-600"
        />
        <StatCard 
          title="Active Tenants" 
          value={activeTenants} 
          icon={Activity} 
          colorClass="bg-emerald-500 text-emerald-500"
        />
        <StatCard 
          title="Total Users across system" 
          value={totalUsers} 
          icon={Users} 
          colorClass="bg-purple-500 text-purple-500"
        />
        <StatCard 
          title="System Health" 
          value="99.9% Uptime" 
          icon={ShieldCheck} 
          colorClass="bg-indigo-500 text-indigo-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity Logs</h3>
        <div className="space-y-4">
          {[
            { msg: 'System backup completed successfully.', time: '2 mins ago' },
            { msg: 'Tenant "Initech" was suspended by Admin.', time: '1 hour ago' },
            { msg: 'Database optimization routine ran.', time: '3 hours ago' },
          ].map((log, idx) => (
            <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0 last:pb-0">
              <span className="text-sm text-slate-700">{log.msg}</span>
              <span className="text-xs text-slate-400">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
