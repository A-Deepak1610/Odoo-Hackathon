import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart
} from 'recharts';
import { Download, TrendingUp, TrendingDown, Wrench, Building2, Calendar, FileText, ArrowRight, Filter, X, CheckCircle, AlertTriangle, Car } from 'lucide-react';
import { DashboardCard } from '../components/dashboard';
import { Button } from '../components/ui';

// DENSE STATIC DATA
const utilizationData = [
  { name: 'Jan', usage: 45, cost: 4000 }, { name: 'Feb', usage: 52, cost: 3000 },
  { name: 'Mar', usage: 48, cost: 2000 }, { name: 'Apr', usage: 70, cost: 2780 },
  { name: 'May', usage: 78, cost: 1890 }, { name: 'Jun', usage: 85, cost: 2390 },
  { name: 'Jul', usage: 82, cost: 3490 }, { name: 'Aug', usage: 90, cost: 2000 },
];

const maintenanceData = [
  { name: 'Jan', 'Preventative': 12, 'Reactive': 5, 'Critical': 2 },
  { name: 'Feb', 'Preventative': 15, 'Reactive': 8, 'Critical': 1 },
  { name: 'Mar', 'Preventative': 10, 'Reactive': 12, 'Critical': 4 },
  { name: 'Apr', 'Preventative': 20, 'Reactive': 4, 'Critical': 0 },
  { name: 'May', 'Preventative': 18, 'Reactive': 6, 'Critical': 1 },
  { name: 'Jun', 'Preventative': 14, 'Reactive': 10, 'Critical': 3 },
  { name: 'Jul', 'Preventative': 22, 'Reactive': 5, 'Critical': 1 },
  { name: 'Aug', 'Preventative': 19, 'Reactive': 7, 'Critical': 2 },
];

const departmentData = [
  { name: 'Engineering', value: 340 }, { name: 'Marketing', value: 120 },
  { name: 'Sales', value: 95 }, { name: 'HR', value: 45 },
  { name: 'Facilities', value: 165 }, { name: 'Finance', value: 85 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b', '#ec4899'];

const depreciationData = [
  { year: '2024', laptops: 50000, furniture: 20000, av: 15000 },
  { year: '2025', laptops: 40000, furniture: 18000, av: 12000 },
  { year: '2026', laptops: 32000, furniture: 16200, av: 9600 },
  { year: '2027', laptops: 25600, furniture: 14580, av: 7680 },
];

const generateHeatmap = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const weeks = Array.from({length: 16}, (_, i) => `W${i+1}`);
  const grid = [];
  for(let d=0; d<days.length; d++) {
    const row = [];
    for(let w=0; w<weeks.length; w++) {
      row.push(Math.floor(Math.random() * 5));
    }
    grid.push({ day: days[d], intensities: row });
  }
  return { weeks, grid };
};
const heatmapData = generateHeatmap();

const ReportsPage = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div className="p-4 md:p-6 w-full space-y-4 md:space-y-6 bg-slate-100 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics Engine</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Deep dive into asset lifecycles, maintenance costs, and predictive depreciation.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="secondary" className="flex-1 sm:flex-none gap-2">
            <Filter size={16} /> Filter Data
          </Button>
          <Button className="flex-1 sm:flex-none gap-2 bg-indigo-600 hover:bg-indigo-700 text-white border-none" onClick={() => setIsExportModalOpen(true)}>
            <Download size={16} /> Export Reports
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        
        {/* Main Analytics Area (3 cols) */}
        <div className="xl:col-span-3 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DashboardCard title="Utilization & Cost Correlation (YTD)">
              <div className="h-[280px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={utilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Area yAxisId="left" type="monotone" dataKey="usage" fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" name="Utilization %" />
                    <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#ec4899" strokeWidth={3} name="Maint. Cost ($)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            <DashboardCard title="Maintenance Ticket Resolution">
              <div className="h-[280px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maintenanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="Preventative" stackId="a" fill="#10b981" barSize={32} />
                    <Bar dataKey="Reactive" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="Critical" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DashboardCard title="Asset Value Depreciation Forecast" className="md:col-span-2">
              <div className="h-[240px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={depreciationData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Area type="monotone" dataKey="laptops" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                    <Area type="monotone" dataKey="furniture" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
                    <Area type="monotone" dataKey="av" stackId="1" stroke="#10b981" fill="#10b981" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            <DashboardCard title="Total Organization Allocation">
              <div className="h-[240px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={departmentData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                      {departmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>

          <DashboardCard title="Facility / Shared Resource Booking Heatmap (Last 16 Weeks)">
            <div className="overflow-x-auto pb-2 mt-2 w-full">
              <div className="min-w-max flex gap-2">
                <div className="flex flex-col gap-1.5 pt-6 pr-2 text-xs text-slate-500 font-semibold justify-between">
                  {heatmapData.grid.map(row => <div key={row.day} className="h-[24px] flex items-center">{row.day}</div>)}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex gap-1.5 pl-0.5">
                    {heatmapData.weeks.map(w => <div key={w} className="w-[24px] text-center text-[10px] text-slate-400 font-semibold">{w.replace('W','')}</div>)}
                  </div>
                  {heatmapData.grid.map((row, i) => (
                     <div key={i} className="flex gap-1.5">
                      {row.intensities.map((intensity, j) => {
                        const colors = ['bg-slate-100', 'bg-indigo-200', 'bg-indigo-400', 'bg-indigo-600', 'bg-indigo-800'];
                        return <div key={j} className={`w-[24px] h-[24px] rounded-sm ${colors[intensity]} hover:ring-2 hover:ring-slate-400 cursor-pointer transition-all shadow-sm`}></div>
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DashboardCard>
          
        </div>

        {/* Dense Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          
          <DashboardCard title="Most Used Assets">
            <div className="space-y-2">
              {[
                { name: 'Conf. Projector A', uses: 45, icon: TrendingUp, color: 'text-emerald-500' },
                { name: 'Dell XPS 15 (AST-042)', uses: 38, icon: TrendingUp, color: 'text-emerald-500' },
                { name: 'Sony A7IV Camera', uses: 32, icon: TrendingUp, color: 'text-emerald-500' },
                { name: 'Meeting Room 1', uses: 28, icon: TrendingUp, color: 'text-emerald-500' },
                { name: 'Mobile Hotspot Z', uses: 25, icon: TrendingUp, color: 'text-emerald-500' },
              ].map((asset, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-bold text-xs text-slate-900">{asset.name}</div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">
                    {asset.uses} <asset.icon size={12} className={asset.color} />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Least Used Assets">
            <div className="space-y-2">
              {[
                { name: 'Mobile Projector Screen', uses: 2, icon: TrendingDown, color: 'text-red-500' },
                { name: 'iPad Pro (AST-011)', uses: 4, icon: TrendingDown, color: 'text-red-500' },
                { name: 'Standing Desk Pro', uses: 5, icon: TrendingDown, color: 'text-red-500' },
                { name: 'Wacom Tablet Small', uses: 5, icon: TrendingDown, color: 'text-red-500' },
                { name: 'Old Conf. Phone', uses: 7, icon: TrendingDown, color: 'text-red-500' },
              ].map((asset, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-bold text-xs text-slate-900">{asset.name}</div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">
                    {asset.uses} <asset.icon size={12} className={asset.color} />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Maintenance Schedule (7 Days)">
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 border border-amber-200 bg-amber-50 rounded-lg">
                <div className="p-1.5 bg-white rounded text-amber-600 shadow-sm"><Wrench size={14} /></div>
                <div><p className="text-xs font-bold text-amber-900">HVAC Inspection</p><p className="text-[10px] font-medium text-amber-700">Tomorrow</p></div>
              </div>
              <div className="flex items-center gap-3 p-2 border border-slate-200 bg-slate-50 rounded-lg">
                <div className="p-1.5 bg-white rounded text-slate-600 shadow-sm"><CheckCircle size={14} /></div>
                <div><p className="text-xs font-bold text-slate-900">Server Cleanup</p><p className="text-[10px] font-medium text-slate-500">Friday</p></div>
              </div>
              <div className="flex items-center gap-3 p-2 border border-red-200 bg-red-50 rounded-lg">
                <div className="p-1.5 bg-white rounded text-red-600 shadow-sm"><AlertTriangle size={14} /></div>
                <div><p className="text-xs font-bold text-red-900">Fire Extinguishers</p><p className="text-[10px] font-medium text-red-700">Oct 28</p></div>
              </div>
              <div className="flex items-center gap-3 p-2 border border-slate-200 bg-slate-50 rounded-lg">
                <div className="p-1.5 bg-white rounded text-slate-600 shadow-sm"><Car size={14} /></div>
                <div><p className="text-xs font-bold text-slate-900">Vehicle Servicing</p><p className="text-[10px] font-medium text-slate-500">Nov 2</p></div>
              </div>
            </div>
          </DashboardCard>

        </div>
      </div>

      {isExportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Export Report</h3>
            <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white"><option>PDF Document</option><option>Excel (CSV)</option></select>
            <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white"><option>Last 6 Months</option><option>This Year (YTD)</option></select>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="secondary" onClick={() => setIsExportModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsExportModalOpen(false)} className="bg-indigo-600 text-white">Download</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportsPage;
