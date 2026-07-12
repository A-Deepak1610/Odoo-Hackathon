import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ASSET_MANAGER_ROUTES } from './constants';
import { AssetManagerLayout } from '../components/layout';

// Lazy loaded pages
// Using a .catch() fallback so it doesn't crash before the files are actually created by a developer
const DashboardPage = React.lazy(() => import('../pages/DashboardPage').catch(() => ({ default: () => <div style={{padding: '24px'}}>Dashboard Page (Placeholder)</div> })));
const AssetsPage = React.lazy(() => import('../pages/AssetsPage').catch(() => ({ default: () => <div style={{padding: '24px'}}>Assets Page (Placeholder)</div> })));
const AssetDetailsPage = React.lazy(() => import('../pages/AssetDetailsPage').catch(() => ({ default: () => <div style={{padding: '24px'}}>Asset Details Page (Placeholder)</div> })));
const AllocationPage = React.lazy(() => import('../pages/AllocationPage').catch(() => ({ default: () => <div style={{padding: '24px'}}>Allocation Page (Placeholder)</div> })));
const BookingPage = React.lazy(() => import('../pages/BookingPage').catch(() => ({ default: () => <div style={{padding: '24px'}}>Booking Page (Placeholder)</div> })));
const MaintenancePage = React.lazy(() => import('../pages/MaintenancePage').catch(() => ({ default: () => <div style={{padding: '24px'}}>Maintenance Page (Placeholder)</div> })));
const AuditPage = React.lazy(() => import('../pages/AuditPage').catch(() => ({ default: () => <div style={{padding: '24px'}}>Audit Page (Placeholder)</div> })));
const ReportsPage = React.lazy(() => import('../pages/ReportsPage').catch(() => ({ default: () => <div style={{padding: '24px'}}>Reports Page (Placeholder)</div> })));
const NotificationsPage = React.lazy(() => import('../pages/NotificationsPage').catch(() => ({ default: () => <div style={{padding: '24px'}}>Notifications Page (Placeholder)</div> })));

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '2rem' }}>
    <div style={{ color: '#64748b' }}>Loading route...</div>
  </div>
);

export const AssetManagerRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Layout Wrapper */}
        <Route element={<AssetManagerLayout />}>
          
          {/* TODO: Implement Route Guards/Permissions Wrapper here */}
          
          <Route path={ASSET_MANAGER_ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ASSET_MANAGER_ROUTES.ASSETS} element={<AssetsPage />} />
          <Route path={ASSET_MANAGER_ROUTES.ASSET_DETAILS} element={<AssetDetailsPage />} />
          <Route path={ASSET_MANAGER_ROUTES.ALLOCATION} element={<AllocationPage />} />
          <Route path={ASSET_MANAGER_ROUTES.BOOKING} element={<BookingPage />} />
          <Route path={ASSET_MANAGER_ROUTES.MAINTENANCE} element={<MaintenancePage />} />
          <Route path={ASSET_MANAGER_ROUTES.AUDIT} element={<AuditPage />} />
          <Route path={ASSET_MANAGER_ROUTES.REPORTS} element={<ReportsPage />} />
          <Route path={ASSET_MANAGER_ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
          
        </Route>
      </Routes>
    </Suspense>
  );
};
