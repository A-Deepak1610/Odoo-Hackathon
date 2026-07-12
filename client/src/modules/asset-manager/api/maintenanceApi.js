import { apiFetch } from '../../../services/api';

export const getAllMaintenanceRequestsApi = async () => {
  const response = await apiFetch('/api/v1/maintenance');
  return response.json();
};

export const approveMaintenanceRequestApi = async (id) => {
  const response = await apiFetch(`/api/v1/maintenance/${id}/approve`, {
    method: 'PUT',
  });
  return response.json();
};

export const resolveMaintenanceRequestApi = async (id) => {
  const response = await apiFetch(`/api/v1/maintenance/${id}/resolve`, {
    method: 'PUT',
  });
  return response.json();
};

// Also export the one to raise for normal employees, if asset manager uses it
export const raiseMaintenanceRequestApi = async (data) => {
  const response = await apiFetch('/api/v1/maintenance', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
};
