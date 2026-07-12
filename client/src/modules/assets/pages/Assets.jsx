import React, { useState } from 'react';
import { Search, Filter, Plus, Download, MoreHorizontal } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import DataTable from '../../../shared/components/DataTable';
import StatusPill from '../../../shared/components/StatusPill';
import Button from '../../../shared/components/Button';

const mockAssets = [
  { id: 'AST-1042', name: 'MacBook Pro 16"', category: 'Laptops', department: 'Engineering', location: 'HQ - Floor 3', status: 'Allocated' },
  { id: 'AST-1043', name: 'Dell XPS 15', category: 'Laptops', department: 'Marketing', location: 'HQ - Floor 2', status: 'Available' },
  { id: 'AST-1044', name: 'Projector A1', category: 'A/V Equipment', department: 'Facilities', location: 'Conf Room A', status: 'Reserved' },
  { id: 'AST-1045', name: 'Delivery Van #4', category: 'Vehicles', department: 'Logistics', location: 'Warehouse North', status: 'Under Maintenance' },
  { id: 'AST-1046', name: 'iPad Pro', category: 'Tablets', department: 'Sales', location: 'HQ - Floor 1', status: 'Lost' },
  { id: 'AST-1047', name: 'Ergonomic Chair', category: 'Furniture', department: 'Engineering', location: 'HQ - Floor 3', status: 'Available' },
  { id: 'AST-1048', name: 'Server Rack C', category: 'IT Infrastructure', department: 'IT', location: 'Server Room 1', status: 'Retired' },
];

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto">
      <PageHeader 
        title="Asset Registry" 
        description="View and manage all organization assets across departments and locations."
        actions={
          <>
            <Button variant="secondary" icon={Download}>Export</Button>
            <Button icon={Plus}>Register Asset</Button>
          </>
        }
      />
      
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by tag, serial, or name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>All Categories</option>
            <option>Laptops</option>
            <option>Vehicles</option>
          </select>
          <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>All Statuses</option>
            <option>Available</option>
            <option>Allocated</option>
          </select>
          <Button variant="ghost" icon={Filter} className="px-3 border border-gray-200 text-gray-700">More Filters</Button>
        </div>
      </div>

      <DataTable 
        data={mockAssets}
        columns={[
          { 
            header: 'Asset Tag', 
            accessor: 'id',
            cellClassName: 'font-mono text-gray-900 font-medium'
          },
          { header: 'Name', accessor: 'name', cellClassName: 'font-medium text-gray-900' },
          { header: 'Category', accessor: 'category', cellClassName: 'text-gray-500' },
          { header: 'Department', accessor: 'department', cellClassName: 'text-gray-500' },
          { header: 'Location', accessor: 'location', cellClassName: 'text-gray-500' },
          { 
            header: 'Status', 
            accessor: 'status',
            cell: (row) => <StatusPill status={row.status} /> 
          },
          {
            header: 'Actions',
            cell: () => <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18}/></button>,
            className: 'text-right',
            cellClassName: 'text-right'
          }
        ]}
      />
    </div>
  );
};

export default Assets;
