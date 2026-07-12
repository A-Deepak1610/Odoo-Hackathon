import React from 'react';
import { Card, CardContent } from '../ui';

export const QuickActionCard = ({ title, description, icon: Icon, onClick }) => {
  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer group hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white"
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-2.5 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors border border-slate-100 group-hover:border-blue-200 shrink-0">
          <Icon size={20} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors mb-0.5">{title}</h4>
          <p className="text-xs font-medium text-slate-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
