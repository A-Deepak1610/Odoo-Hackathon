import React from 'react';
import { Search, Bell, Moon, ChevronDown } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { Input, Button } from '../ui';

export const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 font-sans">
      <Breadcrumb />

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search assets..."
            className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:bg-white focus:border-blue-800 focus:ring-2 focus:ring-blue-800/20"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 bg-transparent border-none cursor-pointer rounded-full relative transition-all hover:text-slate-900 hover:bg-slate-100">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white" />
          </button>
          <button className="p-2 text-slate-400 bg-transparent border-none cursor-pointer rounded-full transition-all hover:text-slate-900 hover:bg-slate-100">
            <Moon size={20} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200" />

        {/* Context Switcher */}
        <div className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border border-transparent transition-all hover:bg-slate-50 hover:border-slate-200">
          <div className="w-6 h-6 rounded bg-blue-900 text-white flex items-center justify-center text-xs font-bold">
            AC
          </div>
          <span className="text-sm font-semibold text-slate-900">
            Acme Corp
          </span>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
};
