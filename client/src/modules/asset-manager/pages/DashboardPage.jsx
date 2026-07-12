import React from 'react';
import { 
  Box, 
  ArrowRightLeft, 
  CalendarClock, 
  CheckCircle2,
  PlusCircle,
  FileText,
  Wrench,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { 
  StatsCard, 
  DashboardCard, 
  AlertCard, 
  QuickActionCard, 
  ActivityCard 
} from '../components/dashboard';

const DashboardPage = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Asset Manager Overview</h2>
        <div className="text-sm font-medium text-slate-500">Last updated: Today, 09:41 AM</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        onAction={() => console.log("Review overdue clicked")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column - spans 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pending Transfers */}
          <DashboardCard 
            title="Pending Transfers" 
            action={<button className="text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors focus:outline-none">View All</button>}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                    <th className="pb-3 pl-2 font-medium">Asset</th>
                    <th className="pb-3 font-medium">From</th>
                    <th className="pb-3 font-medium">To</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pl-2 font-medium text-slate-800">MacBook Pro 16"</td>
                    <td className="py-3.5 text-slate-600">IT Dept</td>
                    <td className="py-3.5 text-slate-600">Sarah Jenkins</td>
                    <td className="py-3.5"><span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-semibold">Pending Approval</span></td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pl-2 font-medium text-slate-800">Dell UltraSharp 27"</td>
                    <td className="py-3.5 text-slate-600">Storage Room A</td>
                    <td className="py-3.5 text-slate-600">Engineering</td>
                    <td className="py-3.5"><span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">In Transit</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pl-2 font-medium text-slate-800">Conference Mic Set</td>
                    <td className="py-3.5 text-slate-600">Facilities</td>
                    <td className="py-3.5 text-slate-600">Meeting Room 4</td>
                    <td className="py-3.5"><span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">In Transit</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DashboardCard>

          {/* Upcoming Returns */}
          <DashboardCard 
            title="Upcoming Returns"
            action={<button className="text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors focus:outline-none">Schedule</button>}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm hover:bg-blue-50/20 transition-all bg-white cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500"><Clock size={18} /></div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">Sony A7IV Camera Kit</p>
                    <p className="text-xs text-slate-500 mt-0.5">Allocated to: Marketing Dept</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700">Today, 5:00 PM</p>
                  <p className="text-xs font-medium text-blue-600 mt-0.5">In 5 hours</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm hover:bg-blue-50/20 transition-all bg-white cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500"><Clock size={18} /></div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">Projector Mobile Stand</p>
                    <p className="text-xs text-slate-500 mt-0.5">Allocated to: John Doe</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700">Tomorrow, 10:00 AM</p>
                </div>
              </div>
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
                onClick={() => console.log('Register asset')}
              />
              <QuickActionCard 
                title="Initiate Transfer"
                description="Transfer an asset to a different department or employee."
                icon={ArrowRightLeft}
                onClick={() => console.log('Transfer')}
              />
              <QuickActionCard 
                title="Schedule Maintenance"
                description="Log a repair or routine check for an existing asset."
                icon={Wrench}
                onClick={() => console.log('Maintenance')}
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
    </div>
  );
};

export default DashboardPage;
