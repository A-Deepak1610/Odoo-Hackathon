import React from 'react';
import { Card, CardContent } from '../ui';

export const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  const iconClass = colorMap[color] || colorMap.blue;

  return (
    <Card className="flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-md duration-200">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          </div>
          <div className={`p-2.5 rounded-lg border ${iconClass}`}>
            <Icon size={20} />
          </div>
        </div>
        
        {trend && (
          <div className="flex items-center text-xs">
            <span className={`font-semibold px-1.5 py-0.5 rounded-md ${trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
            <span className="text-slate-500 font-medium ml-2">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
