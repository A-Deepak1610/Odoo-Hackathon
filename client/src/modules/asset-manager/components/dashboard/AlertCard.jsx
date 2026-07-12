import React from 'react';
import { AlertCircle } from 'lucide-react';

export const AlertCard = ({ title, message, actionText, onAction }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-100 rounded-full shrink-0">
          <AlertCircle size={20} className="text-red-600" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-red-900">{title}</h4>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
      </div>
      {actionText && (
        <button 
          onClick={onAction}
          className="shrink-0 px-4 py-2 bg-white border border-red-200 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
