import React, { useState } from 'react';
import { Search, Download, Plus, Pencil, Trash2, Box, Package, RefreshCw, Wrench } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import DataTable from '../../../shared/components/DataTable';
import StatusPill from '../../../shared/components/StatusPill';
import StatCard from '../../../shared/components/StatCard';
import Button from '../../../shared/components/Button';
import Modal from '../../../shared/components/Modal';

// --- MOCK DATA ---
const initialAssets = [
  { id: 'AST-1042', name: 'MacBook Pro 16"', category: 'Laptops', department: 'Engineering', location: 'HQ - Floor 3', status: 'Allocated' },
  { id: 'AST-1043', name: 'Dell XPS 15', category: 'Laptops', department: 'Marketing', location: 'HQ - Floor 2', status: 'Available' },
  { id: 'AST-1044', name: 'Projector A1', category: 'A/V Equipment', department: 'Facilities', location: 'Conf Room A', status: 'Reserved' },
  { id: 'AST-1045', name: 'Delivery Van #4', category: 'Vehicles', department: 'Logistics', location: 'Warehouse North', status: 'Under Maintenance' },
  { id: 'AST-1046', name: 'iPad Pro', category: 'Tablets', department: 'Sales', location: 'HQ - Floor 1', status: 'Lost' },
];

const Assets = () => {
  // --- STATE ---
  const [assets, setAssets] = useState(initialAssets);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    id: '', name: '', category: 'Laptops', department: '', location: '', status: 'Available'
  });

  // --- STATS CALCULATION ---
  const totalAssets = assets.length;
  const availableCount = assets.filter(a => a.status === 'Available').length;
  const allocatedCount = assets.filter(a => a.status === 'Allocated').length;
  const maintenanceCount = assets.filter(a => a.status === 'Under Maintenance').length;

  // --- FILTERING ---
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || asset.category === categoryFilter;
    const matchesStatus = statusFilter === 'All Statuses' || asset.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // --- CRUD ACTIONS ---
  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        id: `AST-${1000 + Math.floor(Math.random() * 9000)}`, // Auto-generate random ID for mock
        name: '', category: 'Laptops', department: '', location: '', status: 'Available'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = () => {
    if (editingItem) {
      setAssets(assets.map(a => a.id === editingItem.id ? formData : a));
    } else {
      setAssets([...assets, formData]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto font-sans">
      <PageHeader 
        title="Asset Registry" 
        description="View and manage all organization assets across departments and locations."
        actions={
          <>
            <Button variant="secondary" icon={Download}>Export</Button>
            <Button onClick={() => handleOpenModal()} icon={Plus}>Register Asset</Button>
          </>
        }
      />

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Assets" value={totalAssets} subtitle="Across all departments" color="indigo" icon={Box} />
        <StatCard title="Available" value={availableCount} subtitle="Ready for allocation" color="emerald" icon={Package} />
        <StatCard title="Allocated" value={allocatedCount} subtitle="Currently in use" color="blue" icon={RefreshCw} />
        <StatCard title="Under Maintenance" value={maintenanceCount} subtitle="Scheduled returns" color="amber" icon={Wrench} />
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Asset Directory</h2>
              <p className="text-sm text-gray-500 mt-1">{filteredAssets.length} assets found</p>
            </div>
            
            {/* FILTERS */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              
              <select 
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white cursor-pointer"
              >
                <option>All Categories</option>
                <option>Laptops</option>
                <option>A/V Equipment</option>
                <option>Vehicles</option>
                <option>Tablets</option>
                <option>Furniture</option>
              </select>

              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white cursor-pointer"
              >
                <option>All Statuses</option>
                <option>Available</option>
                <option>Allocated</option>
                <option>Reserved</option>
                <option>Under Maintenance</option>
                <option>Lost</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <DataTable 
            data={filteredAssets}
            columns={[
              { header: 'Tag', accessor: 'id', cellClassName: 'font-mono text-xs text-primary-700 font-semibold' },
              { header: 'Name', accessor: 'name', cellClassName: 'font-medium text-gray-900' },
              { header: 'Category', accessor: 'category' },
              { header: 'Department', accessor: 'department' },
              { header: 'Location', accessor: 'location' },
              { 
                header: 'Status', 
                accessor: 'status',
                cell: (row) => <StatusPill status={row.status} /> 
              },
              {
                header: 'Actions',
                cell: (row) => (
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(row)} className="text-gray-400 hover:text-primary-600 transition-colors p-1.5 rounded hover:bg-primary-50">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ),
                className: 'text-right',
                cellClassName: 'text-right'
              }
            ]}
          />
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Asset' : 'Register New Asset'}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleSave}>Save Asset</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset ID (Auto)</label>
              <input value={formData.id} disabled className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md font-mono text-sm text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})} 
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-primary-500"
              >
                <option>Available</option>
                <option>Allocated</option>
                <option>Reserved</option>
                <option>Under Maintenance</option>
                <option>Lost</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
            <input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" 
              placeholder="e.g. MacBook Pro 16"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-primary-500"
            >
              <option>Laptops</option>
              <option>A/V Equipment</option>
              <option>Vehicles</option>
              <option>Tablets</option>
              <option>Furniture</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input 
                value={formData.department} 
                onChange={e => setFormData({...formData, department: e.target.value})} 
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 outline-none" 
                placeholder="e.g. Engineering"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})} 
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 outline-none" 
                placeholder="e.g. HQ - Floor 3"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Assets;
