import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, ArrowRightLeft, CalendarClock, CheckCircle2,
  PlusCircle, Wrench, Clock, AlertTriangle, ChevronRight,
  Activity, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
  LineChart, Line
} from 'recharts';
import { 
  StatsCard, DashboardCard, AlertCard, QuickActionCard, ActivityCard 
} from '../components/dashboard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Card, CardContent } from '../components/ui';
import { RegisterAssetModal } from '../components/assets';

// DENSE MOCK DATA
const UTILIZATION_DATA = [
  { name: 'Jan', value: 65, active: 40 }, { name: 'Feb', value: 72, active: 50 },
  { name: 'Mar', value: 68, active: 45 }, { name: 'Apr', value: 85, active: 65 },
  { name: 'May', value: 82, active: 60 }, { name: 'Jun', value: 92, active: 80 },
  { name: 'Jul', value: 88, active: 75 }, { name: 'Aug', value: 95, active: 85 },
];

const DEPARTMENT_DATA = [
  { name: 'Engineering', value: 400, color: '#1e40af' },
  { name: 'Marketing', value: 300, color: '#3b82f6' },
  { name: 'Sales', value: 300, color: '#60a5fa' },
  { name: 'HR', value: 200, color: '#93c5fd' },
  { name: 'Facilities', value: 150, color: '#bfdbfe' },
];

const STATUS_DATA = [
  { name: 'Allocated', value: 1200, color: '#10b981' },
  { name: 'Available', value: 800, color: '#3b82f6' },
  { name: 'Maintenance', value: 150, color: '#f59e0b' },
  { name: 'Retired', value: 50, color: '#64748b' },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="p-3 md:p-4 w-full space-y-3 md:space-y-4 bg-slate-100 min-h-screen">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Asset Manager Command Center</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Real-time telemetry and overview of all organizational assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success" className="animate-pulse">Live Sync Active</Badge>
          <div className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Last updated: Just now
          </div>
        </div>
      </div>

      {/* Extreme Density KPI Cards (6 columns on large screens) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 items-start">
        <StatsCard title="Total Assets" value="2,498" icon={Box} trend="up" trendValue="12%" color="blue" />
        <StatsCard title="In Active Use" value="1,842" icon={Activity} trend="up" trendValue="5%" color="emerald" />
        <StatsCard title="Under Maintenance" value="124" icon={Wrench} trend="down" trendValue="2%" color="amber" />
        <StatsCard title="Shared Resources" value="86" icon={CalendarClock} trend="up" trendValue="4%" color="indigo" />
        <StatsCard title="Pending Transfers" value="18" icon={ArrowRightLeft} trend="up" trendValue="18%" color="purple" />
        <StatsCard title="Critical Alerts" value="3" icon={AlertTriangle} trend="down" trendValue="50%" color="danger" />
      </div>

      {/* Critical Alerts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
        <AlertCard 
          title="Overdue Returns Detected" 
          message="7 assets have exceeded their scheduled return date. Immediate action required."
          actionText="Review Overdue"
          onAction={() => navigate("/asset-manager/allocations")}
        />
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 shadow-sm flex items-start justify-between">
          <div className="flex gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-amber-100 text-amber-600">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-lg">High Maintenance Volume</h3>
              <p className="text-sm font-medium text-amber-700 mt-1">15 new HVAC tickets created in the last 24 hours.</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate("/asset-manager/maintenance")}>View Queue</Button>
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 items-start">
        
        {/* Main Chart spanning 2 cols */}
        <div className="xl:col-span-2">
          <DashboardCard title="Asset Utilization vs Active Allocations (YTD)">
            <div className="h-[220px] w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={UTILIZATION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="value" name="Total Capacity" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  <Area type="monotone" dataKey="active" name="Active Usage" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>

        {/* Small Pie Chart */}
        <div className="xl:col-span-1">
          <DashboardCard title="Department Distribution">
            <div className="h-[220px] w-full flex items-center justify-center pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={DEPARTMENT_DATA} cx="50%" cy="45%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {DEPARTMENT_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>

        {/* Small Bar Chart */}
        <div className="xl:col-span-1">
          <DashboardCard title="Asset Status Breakdown">
            <div className="h-[220px] w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={STATUS_DATA} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                  <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {STATUS_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Complex Density Grid (3 columns layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
        
        {/* Left Col: Lists */}
        <div className="space-y-3">
          <DashboardCard title="Pending Transfers (Urgent)" action={<Button variant="ghost" size="sm" onClick={() => navigate("/asset-manager/allocations")}>View All</Button>}>
            <div className="space-y-3">
              {[
                { name: 'MacBook Pro 16"', from: 'IT Dept', to: 'Sarah Jenkins', status: 'Pending' },
                { name: 'Dell UltraSharp 27"', from: 'Storage', to: 'Engineering', status: 'In Transit' },
                { name: 'Conf. Mic Set', from: 'Facilities', to: 'Room 4', status: 'In Transit' },
                { name: 'Herman Miller Chair', from: 'HR Dept', to: 'Marketing', status: 'Pending' },
                { name: 'iPad Pro 12.9"', from: 'Sales', to: 'John Doe', status: 'In Transit' },
                { name: 'Sony Camera Kit', from: 'Storage', to: 'Media Team', status: 'Pending' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{item.name}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{item.from} &rarr; {item.to}</p>
                  </div>
                  <Badge variant={item.status === 'Pending' ? 'warning' : 'info'}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Middle Col: Upcoming & Maintenance */}
        <div className="space-y-3">
          <DashboardCard title="Upcoming Returns Schedule">
            <div className="space-y-2.5">
              {[
                { name: 'Sony A7IV Camera Kit', alloc: 'Marketing Dept', time: 'Today, 5:00 PM', due: 'In 5 hours' },
                { name: 'Projector Mobile Stand', alloc: 'John Doe', time: 'Tomorrow, 10:00 AM', due: null },
                { name: 'Dell XPS 15 Laptop', alloc: 'Engineering', time: 'Tomorrow, 2:00 PM', due: null },
                { name: 'Wireless Lavalier Mic', alloc: 'Sarah Jenkins', time: 'Oct 25, 9:00 AM', due: null },
                { name: 'Standing Desk Converter', alloc: 'HR Dept', time: 'Oct 26, 4:00 PM', due: null },
              ].map((item, i) => (
                <Card key={i} className="cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group border-slate-200">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors"><Clock size={16} /></div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs font-medium text-slate-500">Allocated to: {item.alloc}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-slate-700">{item.time}</p>
                      {item.due && <p className="text-[10px] uppercase font-bold text-blue-600 mt-0.5">{item.due}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Recent Maintenance Activity">
            <div className="space-y-3">
              {[
                { id: 'TKT-1045', asset: 'HVAC Floor 2', status: 'Resolved', time: '1 hr ago' },
                { id: 'TKT-1046', asset: 'MacBook Pro Battery', status: 'In Progress', time: '3 hrs ago' },
                { id: 'TKT-1047', asset: 'Chair Caster Fix', status: 'Pending', time: '5 hrs ago' },
              ].map((t, i) => (
                <div key={i} className="flex justify-between p-2.5 bg-white border border-slate-200 rounded-xl">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{t.id}</span>
                    <span className="text-sm font-bold text-slate-800">{t.asset}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold text-slate-500">{t.time}</span>
                    <Badge variant={t.status === 'Resolved' ? 'success' : (t.status === 'Pending' ? 'warning' : 'info')}>{t.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Right Col: Actions & Logs */}
        <div className="space-y-3">
          <DashboardCard title="Quick Action Panel" className="bg-white border-slate-200">
            <div className="space-y-3">
              <Button onClick={() => setIsRegisterModalOpen(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start gap-3 h-12">
                <PlusCircle size={18} /> Register New Asset
              </Button>
              <Button onClick={() => navigate('/asset-manager/allocations')} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 justify-start gap-3 h-12">
                <ArrowRightLeft size={18} /> Initiate Transfer
              </Button>
              <Button onClick={() => navigate('/asset-manager/maintenance')} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 justify-start gap-3 h-12">
                <Wrench size={18} /> Schedule Maintenance
              </Button>
            </div>
          </DashboardCard>

          <DashboardCard title="System Activity Feed">
            <div className="pt-2 pl-2 overflow-y-auto max-h-[300px] custom-scrollbar">
              <ActivityCard title="Asset Allocated" description="MacBook Pro assigned to Jane Smith." timestamp="2 hrs ago" icon={CheckCircle2} iconColor="emerald" />
              <ActivityCard title="Maintenance Completed" description="HVAC Unit 3 routine servicing finished." timestamp="5 hrs ago" icon={Wrench} iconColor="blue" />
              <ActivityCard title="Transfer Rejected" description="Transfer of Server Rack B denied by IT Head." timestamp="Yesterday" icon={AlertTriangle} iconColor="amber" />
              <ActivityCard title="New Asset Registered" description="Batch of 50 Dell Monitors added." timestamp="2 days ago" icon={Box} iconColor="purple" />
              <ActivityCard title="Asset Retired" description="ThinkPad T480 marked as retired." timestamp="3 days ago" icon={Box} iconColor="slate" />
              <ActivityCard title="Booking Cancelled" description="Conference Room A booking cancelled." timestamp="4 days ago" icon={CalendarClock} iconColor="amber" />
              <ActivityCard title="Audit Cycle Closed" description="Q3 Hardware Audit marked as completed." timestamp="5 days ago" icon={CheckCircle2} iconColor="emerald" />
            </div>
          </DashboardCard>
        </div>
      </div>
      
      <RegisterAssetModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </div>
  );
};

export default DashboardPage;
