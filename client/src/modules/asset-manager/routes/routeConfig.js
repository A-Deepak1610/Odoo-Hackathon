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
    title: "Assets",
    icon: "Box",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"],
    breadcrumb: "Assets",
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
    title: "Allocation & Transfer",
    icon: "ArrowRightLeft",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD", "EMPLOYEE"],
    breadcrumb: "Allocation",
  },
  {
    path: ASSET_MANAGER_ROUTES.BOOKING,
    title: "Resource Booking",
    icon: "CalendarClock",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD", "EMPLOYEE"],
    breadcrumb: "Booking",
  },
  {
    path: ASSET_MANAGER_ROUTES.MAINTENANCE,
    title: "Maintenance",
    icon: "Wrench",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD", "EMPLOYEE"],
    breadcrumb: "Maintenance",
  },
  {
    path: ASSET_MANAGER_ROUTES.AUDIT,
    title: "Audit",
    icon: "ClipboardCheck",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"],
    breadcrumb: "Audit",
  },
  {
    path: ASSET_MANAGER_ROUTES.REPORTS,
    title: "Reports",
    icon: "BarChart3",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"],
    breadcrumb: "Reports",
  },
  {
    path: ASSET_MANAGER_ROUTES.NOTIFICATIONS,
    title: "Notifications",
    icon: "Bell",
    permission: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD", "EMPLOYEE"],
    breadcrumb: "Notifications",
  },
];
