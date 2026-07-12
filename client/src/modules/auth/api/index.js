import { apiFetch } from '../../../services/api';

/**
 * Call backend login endpoint
 */
export const loginApi = async (email, password, rememberMe) => {
  const res = await apiFetch('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe }),
  });
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};

/**
 * Call backend employee signup endpoint
 */
export const signupApi = async (email, password) => {
  const res = await apiFetch('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Signup failed');
  }
  return data;
};

/**
 * Call backend logout endpoint
 */
export const logoutApi = async (refreshToken) => {
  const res = await apiFetch('/api/v1/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Logout failed');
  }
  return data;
};

/**
 * Call backend me endpoint to get profile
 */
export const getMeApi = async () => {
  const res = await apiFetch('/api/v1/auth/me');
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to retrieve profile');
  }
  return data;
};
