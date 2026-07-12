import React from 'react';

export const AssetStatusBadge = ({ status }) => {
  const statusConfig = {
    'Available': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Allocated': 'bg-blue-100 text-blue-700 border-blue-200',
    'In Maintenance': 'bg-amber-100 text-amber-700 border-amber-200',
    'Retired': 'bg-slate-100 text-slate-700 border-slate-200',
    'Missing': 'bg-red-100 text-red-700 border-red-200',
  };

  const configClass = statusConfig[status] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${configClass}`}>
      {status}
    </span>
  );
};
