import { ASSET_MANAGER_ROUTES } from './constants';

export const routeConfig = [
  {
    path: ASSET_MANAGER_ROUTES.DASHBOARD,
    title: "Dashboard",
    icon: "LayoutDashboard",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD", "EMPLOYEE"],
    breadcrumb: "Dashboard",
  },
  {
    path: ASSET_MANAGER_ROUTES.ASSETS,
    title: "Asset Registration & Directory",
    icon: "Box",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"],
    breadcrumb: "Asset Registration & Directory",
  },
  {
    path: ASSET_MANAGER_ROUTES.ASSET_DETAILS,
    title: "Asset Details",
    icon: "Box",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD", "EMPLOYEE"],
    breadcrumb: "Asset Details",
  },
  {
    path: ASSET_MANAGER_ROUTES.ALLOCATION,
    title: "Asset Allocation & Transfer",
    icon: "ArrowRightLeft",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD", "EMPLOYEE"],
    breadcrumb: "Asset Allocation & Transfer",
  },
  {
    path: ASSET_MANAGER_ROUTES.BOOKING,
    title: "Resource Booking",
    icon: "CalendarClock",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD", "EMPLOYEE"],
    breadcrumb: "Resource Booking",
  },
  {
    path: ASSET_MANAGER_ROUTES.MAINTENANCE,
    title: "Maintenance Management",
    icon: "Wrench",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD", "EMPLOYEE"],
    breadcrumb: "Maintenance Management",
  },
  {
    path: ASSET_MANAGER_ROUTES.AUDIT,
    title: "Asset Audit",
    icon: "ClipboardCheck",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"],
    breadcrumb: "Asset Audit",
  },
  {
    path: ASSET_MANAGER_ROUTES.REPORTS,
    title: "Reports & Analytics",
    icon: "BarChart3",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"],
    breadcrumb: "Reports & Analytics",
  },
  {
    path: ASSET_MANAGER_ROUTES.NOTIFICATIONS,
    title: "Activity Logs & Notifications",
    icon: "Bell",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD", "EMPLOYEE"],
    breadcrumb: "Activity Logs & Notifications",
  },
];
