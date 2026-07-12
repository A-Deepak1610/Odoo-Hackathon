import React from 'react';
import { Search, Bell, Moon, ChevronDown } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { Input, Button } from '../ui';

export const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 font-sans">
      <Breadcrumb />

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-slate-400 bg-transparent border-none cursor-pointer rounded-full relative transition-all hover:text-slate-900 hover:bg-slate-100">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white" />
        </button>
        <button className="p-2 text-slate-400 bg-transparent border-none cursor-pointer rounded-full transition-all hover:text-slate-900 hover:bg-slate-100">
          <Moon size={20} />
        </button>
      </div>
    </header>
  );
};
