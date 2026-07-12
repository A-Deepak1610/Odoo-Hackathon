import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { ShieldAlert, LogOut } from 'lucide-react';
import Button from '../../../shared/components/Button';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50 flex-col gap-4">
        <div className="relative w-12 h-12">
          <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-gray-500 animate-pulse">Verifying credentials...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if role is allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-600 animate-bounce">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 max-w-md mb-6 text-sm">
          You do not have the required permissions to access this page. Please contact your system administrator if you believe this is an error.
        </p>
        <div className="flex items-center gap-3">
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
          <Button onClick={logout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white">
            <LogOut size={16} />
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
