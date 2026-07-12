import React from 'react';
import { Search, Bell, Moon, ChevronDown } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';

export const Header = () => {
  return (
    <header
      style={{
        height: "64px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "24px",
        paddingRight: "24px",
        flexShrink: 0,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Breadcrumb />

      {/* Right Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Global Search */}
        <div style={{ position: "relative" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search assets..."
            style={{
              paddingLeft: "36px",
              paddingRight: "16px",
              paddingTop: "6px",
              paddingBottom: "6px",
              width: "256px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "13px",
              color: "#0f172a",
              outline: "none",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = "0 0 0 2px #1e3a8a33";
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.borderColor = "#1e3a8a";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.backgroundColor = "#f8fafc";
              e.target.style.borderColor = "#e2e8f0";
            }}
          />
        </div>

        {/* Action Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            style={{
              padding: "8px",
              color: "#94a3b8",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "50%",
              position: "relative",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#0f172a";
              e.currentTarget.style.backgroundColor = "#f1f5f9";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#94a3b8";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Bell size={20} />
            <span
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                width: "8px",
                height: "8px",
                backgroundColor: "#dc2626",
                borderRadius: "50%",
                border: "2px solid #ffffff",
              }}
            />
          </button>
          <button
            style={{
              padding: "8px",
              color: "#94a3b8",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "50%",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#0f172a";
              e.currentTarget.style.backgroundColor = "#f1f5f9";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#94a3b8";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Moon size={20} />
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "32px",
            width: "1px",
            backgroundColor: "#e2e8f0",
          }}
        />

        {/* Context Switcher */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid transparent",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#f8fafc";
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "4px",
              backgroundColor: "#1e3a8a",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: "700",
            }}
          >
            AC
          </div>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#0f172a",
            }}
          >
            Acme Corp
          </span>
          <ChevronDown size={16} style={{ color: "#94a3b8" }} />
        </div>
      </div>
    </header>
  );
};
