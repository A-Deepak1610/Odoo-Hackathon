import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../utils/cn';

const colorThemes = {
  indigo: 'bg-primary-100 text-primary-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600',
  violet: 'bg-violet-100 text-violet-600',
  blue: 'bg-blue-100 text-blue-600',
  red: 'bg-red-100 text-red-600'
};

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, // { value: '12%', direction: 'up' | 'down' | 'neutral' }
  color = 'indigo',
  className 
}) => {
  return (
    <div className={cn("bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col", className)}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">{title}</span>
          <span className="text-3xl font-bold text-gray-900 mt-2">{value}</span>
        </div>
        
        {Icon && (
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", colorThemes[color])}>
            <Icon size={24} />
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          {trend.direction === 'up' && <TrendingUp size={16} className="text-emerald-500 mr-1" />}
          {trend.direction === 'down' && <TrendingDown size={16} className="text-red-500 mr-1" />}
          {trend.direction === 'neutral' && <Minus size={16} className="text-gray-400 mr-1" />}
          
          <span className={cn(
            "font-medium",
            trend.direction === 'up' && "text-emerald-600",
            trend.direction === 'down' && "text-red-600",
            trend.direction === 'neutral' && "text-gray-500"
          )}>
            {trend.value}
          </span>
          <span className="text-gray-500 ml-2 whitespace-nowrap">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
