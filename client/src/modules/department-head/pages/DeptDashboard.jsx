import React, { useState } from 'react';
import { Layers, Wrench, Clock, Search, Filter, MoreVertical, CheckCircle2 } from 'lucide-react';
import { useDeptHead } from '../store/DeptHeadContext';

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
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
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <span className={trend.isPositive ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
          {trend.value}
        </span>
        <span className="text-slate-500 ml-2">vs last month</span>
      </div>
    )}
  </div>
);

const DeptDashboard = () => {
  const { assets, requests, setRequests, requestAsset } = useDeptHead();
  
  // Local state for UI
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedAssetId, setExpandedAssetId] = useState(null);
  const itemsPerPage = 5;

  const totalAssets = assets.length;
  const underMaintenance = assets.filter(a => a.status === 'Under Maintenance').length;
  const pendingRequests = requests.length;

  // Handlers
  const handleRequestNewAsset = () => {
    requestAsset();
    alert("A dummy asset request has been added to your Approvals queue!");
  };

  const cycleFilter = () => {
    const filters = ['All', 'Available', 'Allocated', 'Under Maintenance'];
    const nextIdx = (filters.indexOf(statusFilter) + 1) % filters.length;
    setStatusFilter(filters[nextIdx]);
    setCurrentPage(1);
  };

  // Derived state
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'All' || asset.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Department Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Manage assets and resources for the Engineering team.</p>
        </div>
        <button 
          onClick={handleRequestNewAsset}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          Request New Asset
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Department Assets" 
          value={totalAssets} 
          icon={Layers} 
          colorClass="bg-blue-600 text-blue-600"
        />
        <StatCard 
          title="Under Maintenance" 
          value={underMaintenance} 
          icon={Wrench} 
          colorClass="bg-amber-500 text-amber-500"
        />
        <StatCard 
          title="Pending Requests" 
          value={pendingRequests} 
          icon={Clock} 
          colorClass="bg-indigo-500 text-indigo-500"
        />
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Department Assets</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to page 1 on search
                }}
                placeholder="Search assets..." 
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64 transition-shadow"
              />
            </div>
            <button 
              onClick={cycleFilter}
              className={`p-2 border rounded-lg transition-colors flex items-center gap-2 ${
                statusFilter !== 'All' ? 'bg-primary-50 text-primary-600 border-primary-200' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`} 
              title="Filter Assets"
            >
              <Filter size={18} />
              {statusFilter !== 'All' && <span className="text-xs font-medium pr-1">{statusFilter}</span>}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-semibold">Asset Tag & Name</th>
                <th className="px-6 py-4 font-semibold">Assignee</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Condition</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedAssets.length > 0 ? (
                paginatedAssets.map((asset, idx) => (
                  <React.Fragment key={idx}>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{asset.name}</span>
                      <span className="text-xs text-slate-500">{asset.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {asset.assignee !== 'Unassigned' ? (
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                          {asset.assignee.split(' ').map(n => n[0]).join('')}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-dashed border-slate-300">
                          -
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{asset.assignee}</span>
                        <span className="text-xs text-slate-500">{asset.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      asset.status === 'Allocated' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      asset.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {asset.status === 'Allocated' && <CheckCircle2 size={12} />}
                      {asset.status === 'Under Maintenance' && <Wrench size={12} />}
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${
                        asset.condition === 'Excellent' || asset.condition === 'New' ? 'bg-emerald-500' :
                        asset.condition === 'Good' ? 'bg-blue-500' : 'bg-rose-500'
                      }`}></div>
                      <span className="text-sm text-slate-600">{asset.condition}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setExpandedAssetId(expandedAssetId === asset.id ? null : asset.id)}
                      className={`p-1.5 rounded transition-colors ${
                        expandedAssetId === asset.id ? 'bg-primary-100 text-primary-700' : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
                {expandedAssetId === asset.id && (
                  <tr key={`details-${asset.id}`} className="bg-slate-50/80 border-b border-slate-100">
                    <td colSpan="5" className="px-6 py-4">
                      <div className="text-sm text-slate-600 grid grid-cols-3 gap-4">
                        <div><strong className="text-slate-900 block mb-1">Purchase Date:</strong> Jan 15, 2023</div>
                        <div><strong className="text-slate-900 block mb-1">Warranty Expires:</strong> Jan 15, 2026</div>
                        <div><strong className="text-slate-900 block mb-1">Serial Number:</strong> S/N-998822001</div>
                      </div>
                    </td>
                  </tr>
                )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                  No assets found matching "{searchQuery}"
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
          <span>
            Showing {filteredAssets.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAssets.length)} of {filteredAssets.length} assets
          </span>
          <div className="flex gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-300 rounded hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border border-slate-300 rounded hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeptDashboard;
