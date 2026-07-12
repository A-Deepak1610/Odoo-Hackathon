import React from 'react';
import { Link } from 'react-router-dom'; // Using react-router-dom as specified in stack
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter } from 'lucide-react';
import { AssetCard } from '../components/AssetCard';
import { fetchAssets } from '../api/assetsApi';
import { ASSET_QUERY_KEYS } from '../constants/assetConstants';

export const AssetsList = () => {
  // Placeholder TanStack Query usage
  const { data: assets, isLoading } = useQuery({
    queryKey: [ASSET_QUERY_KEYS.LIST],
    queryFn: fetchAssets,
    initialData: [
      { id: 1, name: 'MacBook Pro M3', category: 'Laptops', status: 'active', assignedTo: 'John Doe' },
      { id: 2, name: 'Dell UltraSharp 27', category: 'Monitors', status: 'active', assignedTo: 'Jane Smith' },
      { id: 3, name: 'ErgoChair Pro', category: 'Furniture', status: 'maintenance', assignedTo: 'Unassigned' },
    ]
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your enterprise assets</p>
        </div>
        <Link 
          to="create" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Asset
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading assets...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <Link key={asset.id} to={\`\${asset.id}\`}>
              <AssetCard asset={asset} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
