import React from 'react';
import { 
  Box, 
  ArrowRightLeft, 
  Wrench, 
  CalendarClock, 
  ArrowLeftRight, 
  RotateCcw,
  AlertTriangle,
  Plus,
  Activity
} from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import StatCard from '../../../shared/components/StatCard';
import Button from '../../../shared/components/Button';
import StatusPill from '../../../shared/components/StatusPill';

const kpiData = [
  { title: 'Assets Available', value: '1,245', icon: Box, color: 'indigo', trend: { value: '4.2%', direction: 'up' } },
  { title: 'Assets Allocated', value: '3,812', icon: ArrowRightLeft, color: 'emerald', trend: { value: '2.1%', direction: 'up' } },
  { title: 'Maintenance Today', value: '18', icon: Wrench, color: 'amber', trend: { value: '12%', direction: 'down' } },
  { title: 'Active Bookings', value: '64', icon: CalendarClock, color: 'violet', trend: { value: '8.4%', direction: 'up' } },
  { title: 'Pending Transfers', value: '12', icon: ArrowLeftRight, color: 'blue', trend: { value: '0%', direction: 'neutral' } },
  { title: 'Upcoming Returns', value: '29', icon: RotateCcw, color: 'emerald', trend: { value: '5%', direction: 'up' } },
];

const quickActions = [
  { title: 'Register Asset', description: 'Add a new asset to the registry', icon: Plus, color: 'bg-primary-50 text-primary-600' },
  { title: 'Book Resource', description: 'Schedule a shared resource', icon: CalendarClock, color: 'bg-emerald-50 text-emerald-600' },
  { title: 'Raise Maintenance', description: 'Report an issue or repair', icon: Wrench, color: 'bg-amber-50 text-amber-600' },
];

const recentActivity = [
  { id: 1, user: 'Sarah Jenkins', action: 'allocated', item: 'MacBook Pro 16"', time: '10 mins ago', status: 'Allocated' },
  { id: 2, user: 'Mike Ross', action: 'returned', item: 'Projector A1', time: '1 hour ago', status: 'Available' },
  { id: 3, user: 'System', action: 'flagged for maintenance', item: 'Delivery Van #4', time: '2 hours ago', status: 'Under Maintenance' },
  { id: 4, user: 'Elena Gilbert', action: 'requested transfer of', item: 'iPad Pro', time: '3 hours ago', status: 'Pending' },
];

const overdueItems = [
  { id: '101', type: 'Return', item: 'Dell XPS 15', user: 'Tom Hanks', daysOverdue: 2 },
  { id: '102', type: 'Maintenance', item: 'HVAC System Unit B', user: 'Tech Team', daysOverdue: 5 },
];

const Dashboard = () => {
  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your organization's assets and resource utilization."
        actions={
          <Button icon={Plus}>Register Asset</Button>
        }
      />

      {/* Overdue Alerts Banner */}
      {overdueItems.length > 0 && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-4 shadow-sm">
          <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-red-800 font-semibold text-sm">Requires Attention ({overdueItems.length} items overdue)</h3>
            <div className="mt-2 flex flex-col gap-2">
              {overdueItems.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white/60 p-2 rounded-lg border border-red-100 text-sm">
                  <div className="flex items-center gap-3 text-red-900">
                    <span className="font-medium">{item.item}</span>
                    <span className="text-red-600/60">•</span>
                    <span>{item.type}</span>
                    <span className="text-red-600/60">•</span>
                    <span className="text-red-700">{item.user}</span>
                  </div>
                  <StatusPill status="Overdue" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {kpiData.map((kpi, idx) => (
          <StatCard key={idx} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (Left 2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action, idx) => (
                <button 
                  key={idx} 
                  className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col items-start gap-3 hover:border-primary-300 hover:shadow-sm transition-all text-left"
                >
                  <div className={`p-2.5 rounded-lg ${action.color}`}>
                    <action.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{action.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</button>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="divide-y divide-gray-100">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                        <Activity size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.item}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                    <StatusPill status={activity.status} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Area (Right 1/3) */}
        <div className="space-y-8">
          {/* We can place mini-charts or other widgets here later if needed, leaving it empty for now to match the clean dashboard aesthetic */}
           <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-6 text-white shadow-md">
            <h3 className="font-semibold text-lg mb-2">Need help?</h3>
            <p className="text-primary-100 text-sm mb-4 line-clamp-3">
              Check out our new documentation on setting up automated maintenance workflows and asset tracking.
            </p>
            <Button variant="secondary" size="sm" className="w-full">
              Read Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
