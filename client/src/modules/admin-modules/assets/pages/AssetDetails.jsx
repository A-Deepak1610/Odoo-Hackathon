import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { fetchAssetById } from '../api/assetsApi';
import { ASSET_QUERY_KEYS } from '../constants/assetConstants';

export const AssetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: asset, isLoading } = useQuery({
    queryKey: [ASSET_QUERY_KEYS.DETAIL, id],
    queryFn: () => fetchAssetById(id),
    initialData: {
      id,
      name: 'MacBook Pro M3',
      category: 'Laptops',
      status: 'active',
      assignedTo: 'John Doe',
      purchaseDate: '2024-01-15',
      serialNumber: 'C02XXXXXXX',
    }
  });

  if (isLoading) return <div className="p-8 text-center">Loading asset details...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/admin/assets')}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{asset?.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{asset?.category}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md bg-red-600 text-sm font-medium text-white hover:bg-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Asset Information</h3>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900 capitalize">{asset?.status}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
            <dd className="mt-1 text-sm text-gray-900">{asset?.assignedTo}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Serial Number</dt>
            <dd className="mt-1 text-sm text-gray-900">{asset?.serialNumber}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Purchase Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{asset?.purchaseDate}</dd>
          </div>
        </div>
      </div>
    </div>
  );
};
