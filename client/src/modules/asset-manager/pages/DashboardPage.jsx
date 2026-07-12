import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  ArrowRightLeft, 
  CalendarClock, 
  CheckCircle2,
  PlusCircle,
  Wrench,
  Clock,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  StatsCard, 
  DashboardCard, 
  AlertCard, 
  QuickActionCard, 
  ActivityCard 
} from '../components/dashboard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Card, CardContent } from '../components/ui';
import { RegisterAssetModal } from '../components/assets';

const UTILIZATION_DATA = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 72 },
  { name: 'Mar', value: 68 },
  { name: 'Apr', value: 85 },
  { name: 'May', value: 82 },
  { name: 'Jun', value: 92 },
  { name: 'Jul', value: 88 },
];

const DEPARTMENT_DATA = [
  { name: 'Engineering', value: 400, color: '#1e40af' },
  { name: 'Marketing', value: 300, color: '#3b82f6' },
  { name: 'Sales', value: 300, color: '#60a5fa' },
  { name: 'HR', value: 200, color: '#93c5fd' },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Asset Manager Overview</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Monitor asset utilization and team activity.</p>
        </div>
        <div className="text-sm font-medium text-slate-500 hidden sm:block">Last updated: Today, 09:41 AM</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Assets Available" 
          value="1,248" 
          icon={Box} 
          trend="up" 
          trendValue="12%" 
          color="blue" 
        />
        <StatsCard 
          title="Assets Allocated" 
          value="3,842" 
          icon={CheckCircle2} 
          trend="up" 
          trendValue="5%" 
          color="emerald" 
        />
        <StatsCard 
          title="Available Resources" 
          value="56" 
          icon={CalendarClock} 
          trend="down" 
          trendValue="2%" 
          color="indigo" 
        />
        <StatsCard 
          title="Active Bookings" 
          value="124" 
          icon={ArrowRightLeft} 
          trend="up" 
          trendValue="18%" 
          color="amber" 
        />
      </div>

      {/* Overdue Returns Alert */}
      <AlertCard 
        title="Overdue Returns Detected" 
        message="There are 7 assets that have exceeded their scheduled return date by more than 48 hours."
        actionText="Review Overdue"
        onAction={() => navigate("/asset-manager/directory")}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard title="Asset Utilization Trend">
            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={UTILIZATION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>
        <div>
          <DashboardCard title="Department Allocation">
            <div className="h-[280px] w-full flex items-center justify-center pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEPARTMENT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {DEPARTMENT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#475569' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column - spans 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pending Transfers */}
          <DashboardCard 
            title="Pending Transfers" 
            action={
              <Button variant="ghost" size="sm" className="text-blue-600 font-semibold gap-1" onClick={() => navigate("/asset-manager/allocations")}>
                View All <ChevronRight size={14} />
              </Button>
            }
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Asset</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold text-slate-800">MacBook Pro 16"</TableCell>
                  <TableCell className="font-medium text-slate-600">IT Dept</TableCell>
                  <TableCell className="font-medium text-slate-600">Sarah Jenkins</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="warning">Pending Approval</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-slate-800">Dell UltraSharp 27"</TableCell>
                  <TableCell className="font-medium text-slate-600">Storage Room A</TableCell>
                  <TableCell className="font-medium text-slate-600">Engineering</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="info">In Transit</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-slate-800">Conference Mic Set</TableCell>
                  <TableCell className="font-medium text-slate-600">Facilities</TableCell>
                  <TableCell className="font-medium text-slate-600">Meeting Room 4</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="info">In Transit</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DashboardCard>

          {/* Upcoming Returns */}
          <DashboardCard 
            title="Upcoming Returns"
            action={<Button variant="ghost" size="sm" onClick={() => navigate("/asset-manager/allocations")}>Schedule</Button>}
          >
            <div className="space-y-3">
              {[
                { name: 'Sony A7IV Camera Kit', alloc: 'Marketing Dept', time: 'Today, 5:00 PM', due: 'In 5 hours' },
                { name: 'Projector Mobile Stand', alloc: 'John Doe', time: 'Tomorrow, 10:00 AM', due: null },
              ].map((item, i) => (
                <Card key={i} className="cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{item.name}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Allocated to: {item.alloc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-700">{item.time}</p>
                      {item.due && <p className="text-xs font-semibold text-blue-600 mt-0.5">{item.due}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DashboardCard>

        </div>

        {/* Side Column - spans 1 col */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <DashboardCard title="Quick Actions">
            <div className="space-y-3">
              <QuickActionCard 
                title="Register New Asset"
                description="Add a new hardware or software asset to the directory."
                icon={PlusCircle}
                onClick={() => setIsRegisterModalOpen(true)}
              />
              <QuickActionCard 
                title="Initiate Transfer"
                description="Transfer an asset to a different department or employee."
                icon={ArrowRightLeft}
                onClick={() => navigate('/asset-manager/allocations')}
              />
              <QuickActionCard 
                title="Schedule Maintenance"
                description="Log a repair or routine check for an existing asset."
                icon={Wrench}
                onClick={() => navigate('/asset-manager/maintenance')}
              />
            </div>
          </DashboardCard>

          {/* Recent Activity */}
          <DashboardCard title="Recent Activity">
            <div className="pt-2 pl-2">
              <ActivityCard 
                title="Asset Allocated"
                description="MacBook Pro assigned to Jane Smith."
                timestamp="2 hrs ago"
                icon={CheckCircle2}
                iconColor="emerald"
              />
              <ActivityCard 
                title="Maintenance Completed"
                description="HVAC Unit 3 routine servicing finished."
                timestamp="5 hrs ago"
                icon={Wrench}
                iconColor="blue"
              />
              <ActivityCard 
                title="Transfer Rejected"
                description="Transfer of Server Rack B denied by IT Head."
                timestamp="Yesterday"
                icon={AlertTriangle}
                iconColor="amber"
              />
              <ActivityCard 
                title="New Asset Registered"
                description="Batch of 50 Dell Monitors added."
                timestamp="2 days ago"
                icon={Box}
                iconColor="purple"
              />
            </div>
          </DashboardCard>

        </div>
      </div>
      
      <RegisterAssetModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
      />
    </div>
  );
};

export default DashboardPage;
