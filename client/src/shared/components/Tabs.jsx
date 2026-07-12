import React from 'react';
import { cn } from '../utils/cn';

const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                isActive
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-2">
                {tab.icon && <tab.icon size={16} />}
                {tab.label}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
