import React, { useState, useEffect } from 'react';
import { AssetFilters, AssetTable, RegisterAssetModal } from '../components/assets';
import { Button } from '../components/ui';
import { Download, Plus, X } from 'lucide-react';
<<<<<<< HEAD

// Placeholder Data
const MOCK_ASSETS = [
  {
    id: '1',
    tag: 'AST-2024-001',
    name: 'MacBook Pro 16" M3 Max',
    category: 'Electronics',
    status: 'Allocated',
    department: 'Engineering',
    holder: 'Sarah Jenkins',
    location: 'Building A, Floor 3',
    condition: 'Good',
  },
  {
    id: '2',
    tag: 'AST-2024-002',
    name: 'Dell UltraSharp 32" 4K Monitor',
    category: 'Electronics',
    status: 'Available',
    department: 'IT',
    holder: 'IT Storage',
    location: 'Storage Room B',
    condition: 'Good',
  },
  {
    id: '3',
    tag: 'AST-2024-003',
    name: 'Herman Miller Aeron Chair',
    category: 'Furniture',
    status: 'In Maintenance',
    department: 'Facilities',
    holder: 'Maintenance Dept',
    location: 'Repair Shop',
    condition: 'Fair',
  },
  {
    id: '4',
    tag: 'AST-2024-004',
    name: 'Logitech MX Master 3S',
    category: 'Electronics',
    status: 'Allocated',
    department: 'Marketing',
    holder: 'Alex Chen',
    location: 'Building A, Floor 2',
    condition: 'Good',
  },
  {
    id: '5',
    tag: 'AST-2024-005',
    name: 'Conference Room Projector',
    category: 'Electronics',
    status: 'Available',
    department: 'Facilities',
    holder: 'Meeting Room 4',
    location: 'Building C, Floor 1',
    condition: 'Good',
  },
  {
    id: '6',
    tag: 'AST-2024-006',
    name: 'Standing Desk Pro',
    category: 'Furniture',
    status: 'Missing',
    department: 'HR',
    holder: 'Unknown',
    location: 'Unknown',
    condition: 'Poor',
  },
  {
    id: '7',
    tag: 'AST-2024-007',
    name: 'Ford Transit Connect Cargo Van',
    category: 'Vehicles',
    status: 'Allocated',
    department: 'Logistics',
    holder: 'Mike Ross',
    location: 'Parking Bay 12',
    condition: 'Good',
  },
];

const AssetsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Simulate network loading state so you can see the skeleton!
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
=======
import { getAssetsApi } from '../api';

const AssetsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const res = await getAssetsApi();
      if (res.success) {
        // Map the backend data structure to fit the AssetTable if necessary
        const mappedAssets = res.data.map(asset => ({
          id: asset.id,
          tag: asset.assetTag,
          name: asset.name,
          category: asset.category?.name || 'Uncategorized',
          status: asset.status === 'AVAILABLE' ? 'Available' : asset.status === 'ALLOCATED' ? 'Allocated' : asset.status === 'UNDER_MAINTENANCE' ? 'In Maintenance' : asset.status === 'LOST' ? 'Missing' : asset.status,
          department: asset.currentDepartment?.name || 'Unassigned',
          holder: asset.currentEmployee ? asset.currentEmployee.name : (asset.currentDepartment ? asset.currentDepartment.name : 'Unknown'),
          location: asset.location || 'Unknown',
          condition: asset.condition || 'Unknown',
        }));
        setAssets(mappedAssets);
      }
    } catch (err) {
      console.error('Failed to load assets', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
>>>>>>> c6229ab (resolved bug in imports)
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Asset Directory</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage, filter, and track all company assets in one place.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2" onClick={() => setIsExportModalOpen(true)}>
            <Download size={16} /> Export Directory
          </Button>
          <Button className="gap-2" onClick={() => setIsRegisterModalOpen(true)}>
            <Plus size={16} /> Register Asset
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-170px)]">
        
        {/* Filters Bar */}
        <AssetFilters />
        
        {/* Data Table */}
        <div className="flex-1 overflow-auto bg-slate-50 relative">
<<<<<<< HEAD
          <AssetTable data={MOCK_ASSETS} isLoading={isLoading} />
=======
          <AssetTable data={assets} isLoading={isLoading} />
>>>>>>> c6229ab (resolved bug in imports)
        </div>
      </div>

      <RegisterAssetModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
<<<<<<< HEAD
=======
        onAssetCreated={loadAssets}
>>>>>>> c6229ab (resolved bug in imports)
      />

      {/* Export Directory Dialog */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg">Export Directory</h3>
              <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-1 rounded-md transition-colors"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Format</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option>CSV (Excel)</option>
                  <option>JSON</option>
                  <option>PDF Summary</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Data Scope</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option>All Assets (1,248)</option>
                  <option>Current Filter Results</option>
                  <option>Active Assets Only</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsExportModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsExportModalOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Download size={16} /> Export
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AssetsPage;
