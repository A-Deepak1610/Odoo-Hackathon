import React from 'react';

export const Content = ({ children }) => {
  return (
    <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f8fafc' }}>
      {children}
    </main>
  );
};
