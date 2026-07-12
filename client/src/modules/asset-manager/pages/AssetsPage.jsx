import React, { useState, useEffect } from 'react';
import { AssetFilters, AssetTable } from '../components/assets';

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

  // Simulate network loading state so you can see the skeleton!
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Asset Directory</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage, filter, and track all company assets in one place.</p>
        </div>
      </div>

      <AssetFilters />
      
      <AssetTable data={MOCK_ASSETS} isLoading={isLoading} />
    </div>
  );
};

export default AssetsPage;
