import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './app/layouts/AppLayout';
import Dashboard from './modules/dashboard/pages/Dashboard';
import Organization from './modules/organization/pages/Organization';
import Assets from './modules/assets/pages/Assets';
import Allocations from './modules/allocations/pages/Allocations';
import Booking from './modules/booking/pages/Booking';
import Maintenance from './modules/maintenance/pages/Maintenance';
import Audit from './modules/audit/pages/Audit';
import Reports from './modules/reports/pages/Reports';
import Notifications from './modules/notifications/pages/Notifications';
import DbAssistant from './modules/db-assistant/pages/DbAssistant';

// Auth Module exports
import { AuthProvider, ProtectedRoute, LoginPage, SignupPage } from './modules/auth';
import ProfilePage from './modules/auth/pages/ProfilePage';

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
            
            {/* General Dashboard & Panel Routes */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="db-assistant" element={<DbAssistant />} />
            <Route path="profile" element={<ProfilePage />} />
            
            {/* RBAC Route: Organization Setup requires ADMIN or SUPERADMIN privilege */}
            <Route 
              path="organization" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
                  <Organization />
                </ProtectedRoute>
              } 
            />
            
            {/* RBAC Route: Assets Management requires ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD, SUPERADMIN or EMPLOYEE */}
            <Route 
              path="assets" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPERADMIN', 'EMPLOYEE']}>
                  <Assets />
                </ProtectedRoute>
              } 
            />
            
            {/* Standard Employee accessible panels */}
            <Route path="allocations" element={<Allocations />} />
            <Route path="booking" element={<Booking />} />
            <Route path="maintenance" element={<Maintenance />} />
            
            {/* RBAC Route: Audit requires ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD or SUPERADMIN */}
            <Route 
              path="audit" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPERADMIN']}>
                  <Audit />
                </ProtectedRoute>
              } 
            />
            
            {/* RBAC Route: Reports requires ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD or SUPERADMIN */}
            <Route 
              path="reports" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPERADMIN']}>
                  <Reports />
                </ProtectedRoute>
              } 
            />

            {/* Catch all fallback within panels */}
            <Route path="*" element={<div className="p-8">Work in progress</div>} />
          </Route>

          {/* Root fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
