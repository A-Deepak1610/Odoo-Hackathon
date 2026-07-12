import React from 'react';
import { Laptop, Tooling, AlertTriangle } from 'lucide-react';

export const AssetCard = ({ asset }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Laptop className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{asset.name || 'Unknown Asset'}</h3>
            <p className="text-sm text-gray-500">{asset.category || 'Uncategorized'}</p>
          </div>
        </div>
        <span className={\`px-2.5 py-0.5 rounded-full text-xs font-medium \${
          asset.status === 'active' ? 'bg-green-100 text-green-800' :
          asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }\`}>
          {asset.status}
        </span>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 flex justify-between">
        <span>Assigned to: {asset.assignedTo || 'Unassigned'}</span>
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">View Details</button>
      </div>
    </div>
  );
};
