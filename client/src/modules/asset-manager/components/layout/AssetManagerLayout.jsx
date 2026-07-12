import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Exported as default from our generator script earlier
import { Header } from './Header';
import { Content } from './Content';

export const AssetManagerLayout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8fafc', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Header />
        <Content>
          <Outlet />
        </Content>
      </div>
    </div>
  );
};

export default AssetManagerLayout;
