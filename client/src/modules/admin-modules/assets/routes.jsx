import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AssetsList } from './pages/AssetsList';
import { AssetCreate } from './pages/AssetCreate';
import { AssetDetails } from './pages/AssetDetails';

export const AssetRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AssetsList />} />
      <Route path="/create" element={<AssetCreate />} />
      <Route path="/:id" element={<AssetDetails />} />
    </Routes>
  );
};
