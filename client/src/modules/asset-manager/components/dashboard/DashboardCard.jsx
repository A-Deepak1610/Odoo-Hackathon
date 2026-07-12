import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui';

export const DashboardCard = ({ title, children, action, className = '' }) => {
  return (
    <Card className={`flex flex-col h-full ${className}`}>
      {(title || action) && (
        <CardHeader className="flex flex-row items-center justify-between shrink-0 py-4">
          {title && <CardTitle>{title}</CardTitle>}
          {action && <div className="ml-4">{action}</div>}
        </CardHeader>
      )}
      <CardContent className="flex-1 overflow-auto">
        {children}
      </CardContent>
    </Card>
  );
};
