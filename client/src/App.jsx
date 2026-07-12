import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './app/layouts/AppLayout';
import Dashboard from './modules/dashboard/pages/Dashboard';
import Organization from './modules/admin-modules/organization/pages/Organization';
import Assets from './modules/admin-modules/assets/pages/Assets';
import Allocations from './modules/allocations/pages/Allocations';
import Booking from './modules/booking/pages/Booking';
import Maintenance from './modules/maintenance/pages/Maintenance';
import Audit from './modules/admin-modules/audit/pages/Audit';
import Reports from './modules/admin-modules/reports/pages/Reports';
import Notifications from './modules/notifications/pages/Notifications';
import DbAssistant from './modules/admin-modules/db-assistant/pages/DbAssistant';
import DeptDashboard from './modules/department-head/pages/DeptDashboard';
import Approvals from './modules/department-head/pages/Approvals';
import ResourceBooking from './modules/department-head/pages/ResourceBooking';
import { DeptHeadProvider } from './modules/department-head/store/DeptHeadContext';
import SuperAdminDashboard from './modules/super-admin/pages/SuperAdminDashboard';
import TenantManagement from './modules/super-admin/pages/TenantManagement';
import { SuperAdminProvider } from './modules/super-admin/store/SuperAdminContext';

// Auth Module exports
import { AuthProvider, ProtectedRoute, LoginPage, SignupPage, useAuth } from './modules/auth';
import ProfilePage from './modules/auth/pages/ProfilePage';

// NEW: Import the isolated Asset Manager routes
import { AssetManagerRoutes } from './modules/asset-manager';

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'ASSET_MANAGER') {
    return <Navigate to="/asset-manager" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Secure Application Routes (Authenticated & Guarded Layout) */}
          <Route path="/" element={<ProtectedRoute><SuperAdminProvider><DeptHeadProvider><AppLayout /></DeptHeadProvider></SuperAdminProvider></ProtectedRoute>}>
            <Route index element={<RoleBasedRedirect />} />

            {/* General Dashboard & Panel Routes */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<ProfilePage />} />

            {/* Administration Routes (Grouped under /admin) */}
            <Route path="admin">
              <Route
                path="organization"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
                    <Organization />
                  </ProtectedRoute>
                }
              />
              <Route
                path="db-assistant"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
                    <DbAssistant />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route
              path="assets"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPERADMIN']}>
                  <Assets />
                </ProtectedRoute>
              }
            />

            {/* Standard Employee accessible panels */}
            <Route path="allocations" element={<Allocations />} />
            <Route path="booking" element={<Booking />} />
            <Route path="maintenance" element={<Maintenance />} />

            {/* RBAC Route: Audit requires ADMIN, ASSET_MANAGER, or DEPARTMENT_HEAD */}
            <Route
              path="audit"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD']}>
                  <Audit />
                </ProtectedRoute>
              }
            />

            {/* RBAC Route: Reports requires ADMIN, ASSET_MANAGER, or DEPARTMENT_HEAD */}
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD']}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Department Head Dedicated Screens (Mocked for Hackathon) */}
            <Route
              path="dept-dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN', 'DEPARTMENT_HEAD']}>
                  <DeptDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="dept-approvals"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN', 'DEPARTMENT_HEAD']}>
                  <Approvals />
                </ProtectedRoute>
              }
            />
            <Route
              path="dept-booking"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN', 'DEPARTMENT_HEAD']}>
                  <ResourceBooking />
                </ProtectedRoute>
              }
            />

            {/* Catch all fallback within panels */}
            <Route path="*" element={<div className="p-8">Work in progress</div>} />
          </Route>

          {/* INJECTED THE NEW ISOLATED ASSET MANAGER OUTSIDE APPLAYOUT TO AVOID DOUBLE LAYOUTS */}
          <Route path="/asset-manager/*" element={<ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPERADMIN']}><AssetManagerRoutes /></ProtectedRoute>} />

          {/* Root fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
