import React from 'react';

export const ActivityCard = ({ title, timestamp, description, icon: Icon, iconColor = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    slate: 'bg-slate-100 text-slate-600',
  };

  const badgeClass = colorMap[iconColor] || colorMap.blue;

  return (
    <div className="flex gap-4 relative">
      <div className="relative flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${badgeClass}`}>
          <Icon size={14} />
        </div>
        <div className="w-px h-full bg-slate-200 absolute top-8 bottom-0 -z-0"></div>
      </div>
      
      <div className="pb-6 flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-medium text-slate-800">{title}</h4>
          <span className="text-xs text-slate-400">{timestamp}</span>
        </div>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
};
