import React from 'react';

export const DashboardCard = ({ title, children, action, className = '' }) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          {title && <h2 className="text-base font-semibold text-slate-800">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5 flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};
