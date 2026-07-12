import { apiFetch } from '../../../services/api';

export const getAllocationsApi = async () => {
  const response = await apiFetch('/api/v1/allocation');
  return response.json();
};

export const getMyTransfersApi = async () => {
  const response = await apiFetch('/api/v1/allocation/my-transfers');
  return response.json();
};

export const allocateAssetApi = async (data) => {
  const response = await apiFetch('/api/v1/allocation', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const requestTransferApi = async (data) => {
  const response = await apiFetch('/api/v1/allocation/transfer', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const returnAssetApi = async (id, data) => {
  const response = await apiFetch(`/api/v1/allocation/${id}/return`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const approveTransferApi = async (id) => {
  const response = await apiFetch(`/api/v1/allocation/transfer/${id}/approve`, {
    method: 'PUT',
  });
  return response.json();
};

export const rejectTransferApi = async (id) => {
  const response = await apiFetch(`/api/v1/allocation/transfer/${id}/reject`, {
    method: 'PUT',
  });
  return response.json();
};
