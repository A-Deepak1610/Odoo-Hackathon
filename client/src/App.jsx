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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="organization" element={<Organization />} />
          <Route path="assets" element={<Assets />} />
          <Route path="allocations" element={<Allocations />} />
          <Route path="booking" element={<Booking />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="audit" element={<Audit />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="*" element={<div className="p-8">Work in progress</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
