import React, { createContext, useContext, useState } from 'react';

const SuperAdminContext = createContext();

export const SuperAdminProvider = ({ children }) => {
  const [tenants, setTenants] = useState([
    {
      id: 'TEN-001',
      name: 'Acme Corporation',
      domain: 'acme.assetflow.com',
      adminEmail: 'admin@acme.com',
      status: 'Active',
      usersCount: 145,
      createdAt: '2025-01-15'
    },
    {
      id: 'TEN-002',
      name: 'Globex Industries',
      domain: 'globex.assetflow.com',
      adminEmail: 'it@globex.com',
      status: 'Active',
      usersCount: 82,
      createdAt: '2025-03-22'
    },
    {
      id: 'TEN-003',
      name: 'Initech',
      domain: 'initech.assetflow.com',
      adminEmail: 'sysadmin@initech.com',
      status: 'Suspended',
      usersCount: 41,
      createdAt: '2025-06-10'
    }
  ]);

  const addTenant = (tenantData) => {
    const newTenant = {
      id: `TEN-${Math.floor(100 + Math.random() * 900)}`,
      name: tenantData.name,
      domain: tenantData.domain,
      adminEmail: tenantData.adminEmail,
      status: 'Active',
      usersCount: 1, // Admin is the first user
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTenants(prev => [newTenant, ...prev]);
  };

  const suspendTenant = (id) => {
    setTenants(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'Active' ? 'Suspended' : 'Active' } : t
    ));
  };

  const removeTenant = (id) => {
    setTenants(prev => prev.filter(t => t.id !== id));
  };

  return (
    <SuperAdminContext.Provider value={{
      tenants,
      addTenant,
      suspendTenant,
      removeTenant
    }}>
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdmin = () => useContext(SuperAdminContext);
