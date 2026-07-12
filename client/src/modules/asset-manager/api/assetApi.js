import { apiFetch } from '../../../services/api';

export const getAssetsApi = async () => {
  const response = await apiFetch('/api/v1/assets');
  return response.json();
};

export const getMyAssetsApi = async () => {
  const response = await apiFetch('/api/v1/assets/my');
  return response.json();
};

export const getAssetByIdApi = async (id) => {
  const response = await apiFetch(`/api/v1/assets/${id}`);
  return response.json();
};

export const createAssetApi = async (data) => {
  const response = await apiFetch('/api/v1/assets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateAssetApi = async (id, data) => {
  const response = await apiFetch(`/api/v1/assets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getAssetCategoriesApi = async () => {
  const response = await apiFetch('/api/v1/asset-categories');
  return response.json();
};
