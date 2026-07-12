import React, { useState } from 'react';
<<<<<<< HEAD
=======
import { useNavigate } from 'react-router-dom';
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
import { MoreVertical, ArrowUpDown, QrCode, FileEdit, Trash2, ShieldAlert } from 'lucide-react';
import { AssetStatusBadge } from './AssetStatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState, Button } from '../ui';

export const AssetTable = ({ data, isLoading }) => {
<<<<<<< HEAD
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

=======
  const navigate = useNavigate();
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
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
      <EmptyState
        icon={ShieldAlert}
        title="No assets found"
        description="We couldn't find any assets matching your current filters. Try adjusting your search or register a new asset."
        action={<Button>Clear Filters</Button>}
        className="bg-white"
      />
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input 
                type="checkbox" 
                checked={selectedAll} 
                onChange={toggleAll}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </TableHead>
            <TableHead className="cursor-pointer hover:text-slate-700 transition-colors">
              <div className="flex items-center gap-1">Asset Tag <ArrowUpDown size={12} /></div>
            </TableHead>
            <TableHead className="cursor-pointer hover:text-slate-700 transition-colors">
              <div className="flex items-center gap-1">Name <ArrowUpDown size={12} /></div>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Holder / Location</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead className="text-center">QR</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((asset) => (
            <TableRow key={asset.id} className="group">
              <TableCell>
                <input 
                  type="checkbox" 
                  checked={selectedItems.includes(asset.id)}
                  onChange={() => toggleItem(asset.id)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </TableCell>
              <TableCell className="font-mono font-medium text-slate-700">{asset.tag}</TableCell>
              <TableCell 
                className="font-medium text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
<<<<<<< HEAD
                onClick={() => window.location.href = `/asset-manager/directory/${asset.id}`}
=======
                onClick={() => navigate(`/asset-manager/directory/${asset.id}`)}
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
              >
                {asset.name}
              </TableCell>
              <TableCell className="text-slate-600">{asset.category}</TableCell>
              <TableCell><AssetStatusBadge status={asset.status} /></TableCell>
              <TableCell className="text-slate-600">{asset.department}</TableCell>
              <TableCell>
                <div>
                  <span className="font-medium text-slate-900">{asset.holder}</span>
                  <span className="block text-xs text-slate-500 mt-0.5">{asset.location}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`text-xs font-semibold ${asset.condition === 'Good' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded' : asset.condition === 'Fair' ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded' : 'text-red-700 bg-red-50 px-2 py-0.5 rounded'}`}>
                  {asset.condition}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                  <QrCode size={18} />
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                    <FileEdit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">{data.length}</span> of <span className="font-medium text-slate-900">248</span> results
        </div>
        <div className="flex items-center gap-1">
          <Button variant="secondary" size="sm" disabled>Previous</Button>
          <Button variant="primary" size="sm" className="w-8 px-0">1</Button>
          <Button variant="ghost" size="sm" className="w-8 px-0 border border-slate-200 bg-white">2</Button>
          <Button variant="ghost" size="sm" className="w-8 px-0 border border-slate-200 bg-white">3</Button>
          <span className="px-2 text-slate-400">...</span>
          <Button variant="secondary" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};
