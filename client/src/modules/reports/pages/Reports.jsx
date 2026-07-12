import React from 'react';
import { Download, BarChart3, LineChart, PieChart } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import Button from '../../../shared/components/Button';

const Reports = () => {
  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto">
      <PageHeader 
        title="Reports & Analytics" 
        description="Gain insights into asset utilization, costs, and departmental distribution."
        actions={<Button icon={Download}>Export All Reports</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mock Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 size={18} className="text-primary-600"/>
              Assets by Department
            </h3>
            <button className="text-sm text-gray-500 hover:text-primary-600">Export CSV</button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 border-b border-l border-gray-200 p-4">
            {/* Mock bars */}
            <div className="w-1/6 bg-primary-200 hover:bg-primary-300 rounded-t-sm h-[40%] transition-colors relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100">120</span></div>
            <div className="w-1/6 bg-primary-400 hover:bg-primary-500 rounded-t-sm h-[80%] transition-colors relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100">340</span></div>
            <div className="w-1/6 bg-primary-300 hover:bg-primary-400 rounded-t-sm h-[60%] transition-colors relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100">210</span></div>
            <div className="w-1/6 bg-primary-500 hover:bg-primary-600 rounded-t-sm h-[95%] transition-colors relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100">450</span></div>
            <div className="w-1/6 bg-primary-200 hover:bg-primary-300 rounded-t-sm h-[30%] transition-colors relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100">90</span></div>
          </div>
          <div className="flex justify-between mt-2 px-4 text-xs text-gray-500">
            <span>HR</span>
            <span>Eng</span>
            <span>Mktg</span>
            <span>IT</span>
            <span>Sales</span>
          </div>
        </div>

        {/* Mock Line Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <LineChart size={18} className="text-emerald-600"/>
              Maintenance Costs (YTD)
            </h3>
            <button className="text-sm text-gray-500 hover:text-primary-600">Export CSV</button>
          </div>
          <div className="h-64 border-b border-l border-gray-200 relative p-4">
            {/* Mock SVG Line */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="3"
                points="0,80 20,70 40,75 60,40 80,50 100,20"
              />
              <circle cx="0" cy="80" r="2" fill="#10b981"/>
              <circle cx="20" cy="70" r="2" fill="#10b981"/>
              <circle cx="40" cy="75" r="2" fill="#10b981"/>
              <circle cx="60" cy="40" r="2" fill="#10b981"/>
              <circle cx="80" cy="50" r="2" fill="#10b981"/>
              <circle cx="100" cy="20" r="2" fill="#10b981"/>
            </svg>
          </div>
          <div className="flex justify-between mt-2 px-4 text-xs text-gray-500">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
