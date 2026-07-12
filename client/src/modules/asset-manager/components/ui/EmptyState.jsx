import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50", className)}>
      {Icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
          <Icon className="h-6 w-6 text-slate-400" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">{description}</p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};
