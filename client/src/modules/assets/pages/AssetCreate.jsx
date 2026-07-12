import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AssetForm } from '../components/AssetForm';
import { createAsset } from '../api/assetsApi';

export const AssetCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    console.log('Form data to submit:', data);
    // Placeholder implementation
    try {
      await createAsset(data);
      // alert('Asset created successfully');
      navigate('/assets');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/assets')}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Asset</h1>
          <p className="text-sm text-gray-500 mt-1">Register a new asset into the system</p>
        </div>
      </div>

      <AssetForm onSubmit={handleSubmit} />
    </div>
  );
};
