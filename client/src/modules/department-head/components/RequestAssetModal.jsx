import React from 'react';
import { X } from 'lucide-react';
import Button from '../../../shared/components/Button';

const RequestAssetModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  assetName, 
  setAssetName, 
  reason, 
  setReason 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Request New Asset</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Asset Needed</label>
            <input 
              type="text" 
              required
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="e.g. MacBook Pro M3, Ergonomic Chair" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason / Justification</label>
            <textarea 
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this asset required?"
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            ></textarea>
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="button" onClick={onClose} variant="outline" className="w-full">
              Cancel
            </Button>
            <Button type="submit" className="w-full">
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestAssetModal;
