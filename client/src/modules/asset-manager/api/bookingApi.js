import { apiFetch } from '../../../services/api';

export const getBookableResourcesApi = async () => {
  const response = await apiFetch('/api/v1/bookings/resources');
  return response.json();
};

export const getMyBookingsApi = async () => {
  const response = await apiFetch('/api/v1/bookings');
  return response.json();
};

export const getAllBookingsApi = async () => {
  const response = await apiFetch('/api/v1/bookings/all');
  return response.json();
};

export const createBookingApi = async (data) => {
  const response = await apiFetch('/api/v1/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const cancelBookingApi = async (id) => {
  const response = await apiFetch(`/api/v1/bookings/${id}/cancel`, {
    method: 'PUT',
  });
  return response.json();
};

export const rescheduleBookingApi = async (id, data) => {
  const response = await apiFetch(`/api/v1/bookings/${id}/reschedule`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
};
