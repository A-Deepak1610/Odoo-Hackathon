import React from 'react';
import { cn } from '../utils/cn';

const colorMaps = {
  green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  indigo: 'bg-primary-100 text-primary-700 border-primary-200',
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
};

const statusMapping = {
  // Green
  'Active': 'green',
  'Available': 'green',
  'Approved': 'green',
  'Completed': 'green',
  'Resolved': 'green',
  
  // Amber
  'Pending': 'amber',
  'Inactive': 'amber',
  'In Progress': 'amber',
  'Warning': 'amber',
  'Reserved': 'amber',
  
  // Red
  'Overdue': 'red',
  'Lost': 'red',
  'Cancelled': 'red',
  
  // Blue
  'Info': 'blue',
  'Allocated': 'blue',
  'Under Maintenance': 'blue',
  
  // Gray
  'Retired': 'gray',
  'Disposed': 'gray',
  'Technician Assigned': 'indigo'
};

const StatusPill = ({ status, className }) => {
  const colorKey = statusMapping[status] || 'gray';
  const colors = colorMaps[colorKey];

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      colors,
      className
    )}>
      {status}
    </span>
  );
};

export default StatusPill;
