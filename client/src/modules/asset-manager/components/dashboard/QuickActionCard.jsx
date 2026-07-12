import React from 'react';

export const QuickActionCard = ({ title, icon: Icon, description, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="p-3 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{description}</p>
      </div>
    </button>
  );
};
