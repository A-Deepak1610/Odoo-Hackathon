import React from 'react';
import { Search, Bell, Moon, ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname) => {
  const path = pathname.split('/')[1];
  if (!path) return 'Dashboard';
  return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
};

const TopNavbar = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      {/* Breadcrumb / Title */}
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-gray-900 leading-tight">
          {pageTitle}
        </h1>
        <p className="text-xs text-gray-500 hidden sm:block">AssetFlow Organization Admin</p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search assets, employees..." 
            className="pl-9 pr-4 py-1.5 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <Moon size={20} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        {/* Context Switcher */}
        <div className="hidden sm:flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg border border-transparent hover:border-gray-200 transition-colors">
          <div className="w-6 h-6 rounded bg-primary-600 text-white flex items-center justify-center text-xs font-bold">
            AC
          </div>
          <span className="text-sm font-medium text-gray-700">Acme Corp</span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
