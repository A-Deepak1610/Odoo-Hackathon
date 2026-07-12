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
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Added breadcrumb hierarchy prefix as requested */}
      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>
        Home &gt; <span style={{ color: "#1e3a8a", fontWeight: "500" }}>{pageTitle}</span>
      </div>
      <h1
        style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#0f172a",
          lineHeight: "1.3",
          margin: "0",
        }}
      >
        {pageTitle}
      </h1>
      <p
        style={{
          fontSize: "12px",
          color: "#64748b",
          display: "none",
          marginTop: "4px",
          margin: "4px 0 0 0",
        }}
        className="sm:block"
      >
        AssetFlow Organization Admin
      </p>
    </div>
  );
};
