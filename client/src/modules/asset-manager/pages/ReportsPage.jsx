import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Download, TrendingUp, TrendingDown, Wrench, Building2, Calendar, FileText, ArrowRight } from 'lucide-react';
import { DashboardCard } from '../components';

// Static Chart Data
const utilizationData = [
  { name: 'Jan', usage: 45, capacity: 100 },
  { name: 'Feb', usage: 52, capacity: 100 },
  { name: 'Mar', usage: 48, capacity: 100 },
  { name: 'Apr', usage: 70, capacity: 100 },
  { name: 'May', usage: 78, capacity: 100 },
  { name: 'Jun', usage: 85, capacity: 100 },
  { name: 'Jul', usage: 82, capacity: 100 },
];

const maintenanceData = [
  { name: 'Jan', 'Preventative': 12, 'Reactive': 5 },
  { name: 'Feb', 'Preventative': 15, 'Reactive': 8 },
  { name: 'Mar', 'Preventative': 10, 'Reactive': 12 },
  { name: 'Apr', 'Preventative': 20, 'Reactive': 4 },
  { name: 'May', 'Preventative': 18, 'Reactive': 6 },
  { name: 'Jun', 'Preventative': 14, 'Reactive': 10 },
];

const departmentData = [
  { name: 'Engineering', value: 340 },
  { name: 'Marketing', value: 120 },
  { name: 'Sales', value: 95 },
  { name: 'HR', value: 45 },
  { name: 'Facilities', value: 65 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

// Heatmap generator
const generateHeatmap = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const weeks = Array.from({length: 12}, (_, i) => `W${i+1}`);
  const grid = [];
  
  for(let d=0; d<days.length; d++) {
    const row = [];
    for(let w=0; w<weeks.length; w++) {
      // Generate random intensity 0-4
      const intensity = Math.floor(Math.random() * 5);
      row.push(intensity);
    }
    grid.push({ day: days[d], intensities: row });
  }
  return { weeks, grid };
};
const heatmapData = generateHeatmap();

const ReportsPage = () => {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Reports & Analytics</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Visualize asset utilization, departmental allocation, and maintenance metrics.</p>
        </div>
        <button className="flex justify-center items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 w-full sm:w-auto">
          <Download size={16} /> Export Full Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Asset Utilization Area Chart */}
          <DashboardCard title="Asset Utilization Trend (YTD)">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={utilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          {/* Side by side charts on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Maintenance Frequency */}
            <DashboardCard title="Maintenance Frequency">
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maintenanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="Preventative" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} barSize={24} />
                    <Bar dataKey="Reactive" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            {/* Department Allocation */}
            <DashboardCard title="Department Allocation">
              <div className="h-[250px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

          </div>

          {/* Booking Heatmap */}
          <DashboardCard title="Resource Booking Heatmap (Last 12 Weeks)">
            <div className="overflow-x-auto pb-2 mt-2">
              <div className="min-w-max flex gap-2">
                {/* Y-Axis Labels */}
                <div className="flex flex-col gap-1.5 pt-6 pr-2 text-xs text-slate-500 font-medium justify-between">
                  {heatmapData.grid.map(row => <div key={row.day} className="h-[20px] flex items-center">{row.day}</div>)}
                </div>
                
                {/* Heatmap Grid */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex gap-1.5 pl-0.5">
                    {heatmapData.weeks.map(w => <div key={w} className="w-[20px] text-center text-[10px] text-slate-400 font-medium">{w.replace('W','')}</div>)}
                  </div>
                  
                  {heatmapData.grid.map((row, i) => (
                    <div key={i} className="flex gap-1.5">
                      {row.intensities.map((intensity, j) => {
                        // Tailwind color mapping based on intensity
                        const colors = ['bg-slate-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600', 'bg-blue-800'];
                        return (
                          <div 
                            key={j} 
                            className={`w-[20px] h-[20px] rounded-sm ${colors[intensity]} hover:ring-2 hover:ring-slate-400 cursor-pointer transition-all`}
                            title={`${row.day}, Week ${j+1}: ${intensity} bookings`}
                          ></div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 text-xs font-medium text-slate-500">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-slate-100"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-200"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-800"></div>
              </div>
              <span>More</span>
            </div>
          </DashboardCard>
          
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          
          {/* Most Used Assets */}
          <DashboardCard title="Most Used Assets">
            <div className="space-y-4">
              {[
                { name: 'Conf. Projector A', uses: 45, icon: TrendingUp, color: 'text-emerald-500' },
                { name: 'Dell XPS 15 (AST-042)', uses: 38, icon: TrendingUp, color: 'text-emerald-500' },
                { name: 'Sony A7IV Camera', uses: 32, icon: TrendingUp, color: 'text-emerald-500' }
              ].map((asset, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="font-semibold text-sm text-slate-800">{asset.name}</div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">
                    {asset.uses} <asset.icon size={12} className={asset.color} />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Least Used Assets */}
          <DashboardCard title="Least Used Assets">
            <div className="space-y-4">
              {[
                { name: 'Mobile Projector Screen', uses: 2, icon: TrendingDown, color: 'text-red-500' },
                { name: 'iPad Pro (AST-011)', uses: 4, icon: TrendingDown, color: 'text-red-500' },
                { name: 'Standing Desk Pro', uses: 5, icon: TrendingDown, color: 'text-red-500' }
              ].map((asset, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="font-semibold text-sm text-slate-800">{asset.name}</div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">
                    {asset.uses} <asset.icon size={12} className={asset.color} />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Department Summary */}
          <DashboardCard title="Department Summary">
            <div className="space-y-4">
              {departmentData.map((dept, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-sm font-semibold text-slate-800">{dept.name}</span>
                    <span className="text-xs font-medium text-slate-500">{dept.value} Assets</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ width: `${(dept.value / 340) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Upcoming Maintenance */}
          <DashboardCard title="Upcoming Maintenance">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-amber-200 bg-amber-50 rounded-lg">
                <div className="p-2 bg-white rounded-md text-amber-600 shrink-0"><Calendar size={16} /></div>
                <div>
                  <p className="text-sm font-bold text-amber-900">HVAC Inspection</p>
                  <p className="text-xs text-amber-700">Scheduled for Tomorrow</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-slate-200 bg-slate-50 rounded-lg">
                <div className="p-2 bg-white rounded-md text-slate-600 shrink-0"><Calendar size={16} /></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Server Rack Cleanup</p>
                  <p className="text-xs text-slate-500">Scheduled for Friday</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              View Schedule <ArrowRight size={14} />
            </button>
          </DashboardCard>

        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
