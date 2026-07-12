import React from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  "": "Dashboard",
  "dashboard": "Dashboard",
  "notifications": "Activity Logs & Notifications",
  "organization": "Organization Setup",
  "assets": "Asset Registration & Directory",
  "allocations": "Asset Allocation & Transfer",
  "booking": "Resource Booking",
  "maintenance": "Maintenance Management",
  "audit": "Asset Audit",
  "reports": "Reports & Analytics",
};

export const Breadcrumb = () => {
  const location = useLocation();
  
  // Extract the current feature path
  const pathParts = location.pathname.split("/").filter(Boolean);
  const currentPath = pathParts[pathParts.length - 1] || "";
  
  // Map it to the new titles
  const pageTitle = PAGE_TITLES[currentPath] || (currentPath.charAt(0).toUpperCase() + currentPath.slice(1).replace("-", " "));

  return (
    <div className="flex flex-col">
      {/* Added breadcrumb hierarchy prefix as requested */}
      <div className="text-xs text-slate-500 mb-1">
        Home &gt; <span className="text-blue-900 font-semibold">{pageTitle}</span>
      </div>
      <h1 className="text-lg font-bold text-slate-900 leading-tight m-0">
        {pageTitle}
      </h1>
      <p className="text-xs text-slate-500 hidden sm:block mt-1 m-0 font-medium">
        AssetFlow Organization Admin
      </p>
    </div>
  );
};
