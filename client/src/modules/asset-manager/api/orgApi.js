import { apiFetch } from '../../../services/api';

export const getEmployeesApi = async () => {
  const response = await apiFetch('/api/v1/employees');
  return response.json();
};

export const getDepartmentsApi = async () => {
  const response = await apiFetch('/api/v1/departments');
  return response.json();
};
