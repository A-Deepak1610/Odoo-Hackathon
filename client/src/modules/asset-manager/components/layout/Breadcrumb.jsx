import React from 'react';
import { useLocation } from 'react-router-dom';

export const Breadcrumb = () => {
  const location = useLocation();
  const getPageTitle = (pathname) => {
    const path = pathname.split("/")[1];
    if (!path) return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ");
  };
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
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
          marginTop: "4px",
          margin: "4px 0 0 0",
        }}
      >
        AssetFlow Organization Admin
      </p>
    </div>
  );
};
