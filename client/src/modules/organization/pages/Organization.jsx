import React, { useState } from "react";
import {
  Building2,
  Tags,
  Users,
  ShieldAlert,
  Plus,
  MoreHorizontal,
} from "lucide-react";

const Organization = () => {
  const [activeTab, setActiveTab] = useState("departments");

  const mockDepartments = [
    {
      id: 1,
      name: "Engineering",
      head: "Sarah Jenkins",
      parent: "None",
      status: "Active",
    },
    {
      id: 2,
      name: "Marketing",
      head: "Mike Ross",
      parent: "None",
      status: "Active",
    },
    {
      id: 3,
      name: "QA",
      head: "Elena Gilbert",
      parent: "Engineering",
      status: "Inactive",
    },
  ];

  const mockCategories = [
    {
      id: 1,
      name: "Laptops",
      prefix: "LPT",
      count: 145,
      fields: "RAM, Storage, CPU",
    },
    {
      id: 2,
      name: "Vehicles",
      prefix: "VEH",
      count: 12,
      fields: "License Plate, Mileage",
    },
    {
      id: 3,
      name: "Furniture",
      prefix: "FURN",
      count: 340,
      fields: "Color, Material",
    },
  ];

  const mockRoles = [
    {
      role: "Admin",
      desc: "Full access to all settings, billing, and org structure.",
      users: 2,
    },
    {
      role: "Asset Manager",
      desc: "Can add, edit, and transfer any assets across the org.",
      users: 4,
    },
    {
      role: "Department Head",
      desc: "Can manage allocations and approvals for their department.",
      users: 8,
    },
    {
      role: "Employee",
      desc: "Can request assets, book resources, and view their allocations.",
      users: 145,
    },
  ];

  const tabs = [
    { id: "departments", label: "Departments", icon: Building2 },
    { id: "categories", label: "Asset Categories", icon: Tags },
    { id: "roles", label: "Roles & Access", icon: ShieldAlert },
  ];

  const getStatusColor = (status) => {
    if (status === "Active") return { bg: "#dcfce7", text: "#15803d" };
    return { bg: "#f1f5f9", text: "#475569" };
  };

  const renderDepartmentsTab = () => (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "#1e293b",
            margin: 0,
          }}
        >
          Departments
        </h3>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            background: "#1e3a8a",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={14} />
          Add Department
        </button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 0",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Name
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Head
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Parent
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Status
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "10px 12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {mockDepartments.map((dept, idx) => {
              const statusColor = getStatusColor(dept.status);
              return (
                <tr
                  key={dept.id}
                  style={{
                    borderBottom:
                      idx < mockDepartments.length - 1
                        ? "1px solid #e2e8f0"
                        : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 0",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#1e293b",
                    }}
                  >
                    {dept.name}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: "13px",
                      color: "#64748b",
                    }}
                  >
                    {dept.head}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: "13px",
                      color: "#64748b",
                    }}
                  >
                    {dept.parent}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        background: statusColor.bg,
                        color: statusColor.text,
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {dept.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "center", padding: "12px" }}>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#94a3b8",
                      }}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategoriesTab = () => (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "#1e293b",
            margin: 0,
          }}
        >
          Asset Categories
        </h3>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            background: "#1e3a8a",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={14} />
          Add Category
        </button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 0",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Name
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Prefix
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Count
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Fields
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "10px 12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {mockCategories.map((cat, idx) => (
              <tr
                key={cat.id}
                style={{
                  borderBottom:
                    idx < mockCategories.length - 1
                      ? "1px solid #e2e8f0"
                      : "none",
                }}
              >
                <td
                  style={{
                    padding: "12px 0",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#1e293b",
                  }}
                >
                  {cat.name}
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    color: "#1e3a8a",
                    fontWeight: 600,
                  }}
                >
                  {cat.prefix}
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontSize: "13px",
                    color: "#1e293b",
                    fontWeight: 600,
                  }}
                >
                  {cat.count}
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  {cat.fields}
                </td>
                <td style={{ textAlign: "center", padding: "12px" }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                    }}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRolesTab = () => (
    <div>
      <div
        style={{
          background: "#dbeafe",
          border: "1px solid #7dd3fc",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "20px",
          fontSize: "13px",
          color: "#1d4ed8",
          fontWeight: 500,
        }}
      >
        Admin Control: This matrix shows capabilities assigned to each role.
        Only Admins can modify these settings.
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        }}
      >
        {mockRoles.map((role, idx) => (
          <div
            key={idx}
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <h4
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1e293b",
                    margin: 0,
                  }}
                >
                  {role.role}
                </h4>
                <span
                  style={{
                    background: "#f1f5f9",
                    color: "#64748b",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {role.users} Users
                </span>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0 0 12px 0",
                  lineHeight: "1.5",
                }}
              >
                {role.desc}
              </p>
            </div>
            <div
              style={{
                paddingTop: "12px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <a
                href="#"
                style={{
                  fontSize: "11px",
                  color: "#1e3a8a",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                View Permissions Matrix
              </a>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      style={{
        padding: "24px 32px",
        maxWidth: "1400px",
        margin: "0 auto",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ── PAGE HEADER ─── */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 700,
            margin: "0 0 8px 0",
            color: "#1e293b",
          }}
        >
          Organization Setup
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          Manage your organization structure, asset categories, and user access
          levels.
        </p>
      </div>

      {/* ── TABS ─── */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "20px",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "12px",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: activeTab === tab.id ? "#1e3a8a" : "transparent",
              color: activeTab === tab.id ? "white" : "#64748b",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = "#f1f5f9";
                e.currentTarget.style.color = "#1e293b";
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#64748b";
              }
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ─── */}
      <div>
        {activeTab === "departments" && renderDepartmentsTab()}
        {activeTab === "categories" && renderCategoriesTab()}
        {activeTab === "roles" && renderRolesTab()}
      </div>
    </div>
  );
};

export default Organization;
