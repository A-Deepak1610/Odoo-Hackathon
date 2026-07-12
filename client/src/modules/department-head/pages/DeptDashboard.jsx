import React, { useState } from 'react';
import { Layers, Wrench, Clock } from 'lucide-react';
import { useDeptHead } from '../store/DeptHeadContext';
import StatCard from '../components/StatCard';
import AssetTable from '../components/AssetTable';
import RequestAssetModal from '../components/RequestAssetModal';

const DeptDashboard = () => {
  const { assets, requests, requestAsset } = useDeptHead();
  
  // Local state for UI
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedAssetId, setExpandedAssetId] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [reason, setReason] = useState('');

  const itemsPerPage = 5;

  const totalAssets = assets.length;
  const underMaintenance = assets.filter(a => a.status === 'Under Maintenance').length;
  const pendingRequests = requests.length;

  // Handlers
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!assetName) return;
    
    requestAsset({ assetName, reason });
    setIsModalOpen(false);
    setAssetName('');
    setReason('');
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
          onClick={() => setIsModalOpen(true)}
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
      <AssetTable 
        assets={filteredAssets}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        cycleFilter={cycleFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        paginatedAssets={paginatedAssets}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        expandedAssetId={expandedAssetId}
        setExpandedAssetId={setExpandedAssetId}
      />

      {/* Request Asset Modal */}
      <RequestAssetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRequestSubmit}
        assetName={assetName}
        setAssetName={setAssetName}
        reason={reason}
        setReason={setReason}
      />
    </div>
  );
};

export default DeptDashboard;
