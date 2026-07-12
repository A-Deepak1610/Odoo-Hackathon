import React from 'react';
import { Badge } from '../ui';

export const AssetStatusBadge = ({ status }) => {
  const variantMap = {
    'Available': 'success',
    'Allocated': 'info',
    'In Maintenance': 'warning',
    'Retired': 'neutral',
    'Missing': 'danger',
  };

  const variant = variantMap[status] || 'neutral';

  return <Badge variant={variant}>{status}</Badge>;
};
