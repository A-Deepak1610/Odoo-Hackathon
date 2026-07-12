import React, { useState } from 'react';
import { MoreVertical, ArrowUpDown, QrCode, FileEdit, Trash2, ShieldAlert } from 'lucide-react';
import { AssetStatusBadge } from './AssetStatusBadge';

export const AssetTable = ({ data, isLoading }) => {
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleAll = () => {
    if (selectedAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map(item => item.id));
    }
    setSelectedAll(!selectedAll);
  };

  const toggleItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
      setSelectedAll(false);
    } else {
      setSelectedItems([...selectedItems, id]);
      if (selectedItems.length + 1 === data.length) setSelectedAll(true);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-pulse">
        <div className="h-12 bg-slate-50 border-b border-slate-200"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-b border-slate-100 flex items-center px-6 gap-4">
            <div className="w-4 h-4 bg-slate-200 rounded"></div>
            <div className="w-24 h-4 bg-slate-200 rounded"></div>
            <div className="flex-1 h-4 bg-slate-200 rounded"></div>
            <div className="w-24 h-6 bg-slate-200 rounded-full"></div>
            <div className="w-32 h-4 bg-slate-200 rounded"></div>
            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert size={32} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">No assets found</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          We couldn't find any assets matching your current filters. Try adjusting your search or register a new asset.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <th className="py-4 pl-6 pr-4 w-12">
                <input 
                  type="checkbox" 
                  checked={selectedAll} 
                  onChange={toggleAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="py-4 px-4 cursor-pointer hover:text-slate-700 transition-colors">
                <div className="flex items-center gap-1">Asset Tag <ArrowUpDown size={12} /></div>
              </th>
              <th className="py-4 px-4 cursor-pointer hover:text-slate-700 transition-colors">
                <div className="flex items-center gap-1">Name <ArrowUpDown size={12} /></div>
              </th>
              <th className="py-4 px-4">Category</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Department</th>
              <th className="py-4 px-4">Holder / Location</th>
              <th className="py-4 px-4">Condition</th>
              <th className="py-4 px-4 text-center">QR</th>
              <th className="py-4 pr-6 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((asset) => (
              <tr key={asset.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors group">
                <td className="py-4 pl-6 pr-4">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(asset.id)}
                    onChange={() => toggleItem(asset.id)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </td>
                <td className="py-4 px-4 font-mono font-medium text-slate-700">{asset.tag}</td>
                <td className="py-4 px-4 font-semibold text-slate-900">{asset.name}</td>
                <td className="py-4 px-4 text-slate-600">{asset.category}</td>
                <td className="py-4 px-4"><AssetStatusBadge status={asset.status} /></td>
                <td className="py-4 px-4 text-slate-600">{asset.department}</td>
                <td className="py-4 px-4">
                  <div>
                    <span className="font-medium text-slate-800">{asset.holder}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">{asset.location}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`text-xs font-medium ${asset.condition === 'Good' ? 'text-emerald-600' : asset.condition === 'Fair' ? 'text-amber-600' : 'text-red-600'}`}>
                    {asset.condition}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50 focus:outline-none">
                    <QrCode size={18} />
                  </button>
                </td>
                <td className="py-4 pr-6 pl-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none transition-colors" title="Edit">
                      <FileEdit size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 focus:outline-none transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 focus:outline-none transition-colors" title="More">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white">
        <div className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">{data.length}</span> of <span className="font-medium text-slate-900">248</span> results
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            Previous
          </button>
          <button className="px-3 py-1 bg-blue-50 text-blue-600 font-medium border border-blue-100 rounded text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">
            2
          </button>
          <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">
            3
          </button>
          <span className="px-2 text-slate-400">...</span>
          <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-500 hover:bg-slate-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
