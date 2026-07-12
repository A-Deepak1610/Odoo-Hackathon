import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './app/layouts/AppLayout';
import Dashboard from './modules/dashboard/pages/Dashboard';
import Organization from './modules/organization/pages/Organization';
// import Assets from './modules/assets/pages/Assets';
import Organization from './modules/admin-modules/organization/pages/Organization';
import Assets from './modules/admin-modules/assets/pages/Assets';
import Allocations from './modules/allocations/pages/Allocations';
import Booking from './modules/booking/pages/Booking';
import Maintenance from './modules/maintenance/pages/Maintenance';
import Audit from './modules/admin-modules/audit/pages/Audit';
import Reports from './modules/admin-modules/reports/pages/Reports';
import Notifications from './modules/notifications/pages/Notifications';
import DbAssistant from './modules/admin-modules/db-assistant/pages/DbAssistant';

// Auth Module exports
import { AuthProvider, ProtectedRoute, LoginPage, SignupPage } from './modules/auth';
import ProfilePage from './modules/auth/pages/ProfilePage';

// NEW: Import the isolated Asset Manager routes
import { AssetManagerRoutes } from './modules/asset-manager';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Secure Application Routes (Authenticated & Guarded Layout) */}
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notifications" element={<Notifications />} />
            {/* Administration Routes (Grouped under /admin) */}
            <Route path="admin">
              <Route 
                path="organization" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Organization />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="db-assistant" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <DbAssistant />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="assets" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD']}>
                    <Assets />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="audit" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD']}>
                    <Audit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="reports" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD']}>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
            </Route>

            <Route path="db-assistant" element={<DbAssistant />} />
            <Route path="profile" element={<ProfilePage />} />
            
            <Route path="organization" element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}><Organization /></ProtectedRoute>} />
            
            <Route path="allocations" element={<Allocations />} />
            <Route path="booking" element={<Booking />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="audit" element={<ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPERADMIN']}><Audit /></ProtectedRoute>} />
            <Route path="reports" element={<ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPERADMIN']}><Reports /></ProtectedRoute>} />

            {/* Catch all fallback within panels */}
            <Route path="*" element={<div className="p-8">Work in progress</div>} />
          </Route>
          
          {/* INJECTED THE NEW ISOLATED ASSET MANAGER OUTSIDE APPLAYOUT TO AVOID DOUBLE LAYOUTS */}
          <Route path="/asset-manager/*" element={<ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPERADMIN']}><AssetManagerRoutes /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
