const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

let _accessToken = '';
let _onTokenExpired = null;

export const setAccessToken = (token) => {
  _accessToken = token;
};

export const getAccessToken = () => {
  return _accessToken;
};

export const registerAuthErrorHandler = (callback) => {
  _onTokenExpired = callback;
};

export const buildApiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

/**
 * Custom fetch wrapper with JWT injection and token refresh logic
 */
export const apiFetch = async (path, options = {}) => {
  const url = buildApiUrl(path);
  
  // Clone and normalize headers
  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  // Inject token if available
  if (_accessToken) {
    headers['Authorization'] = `Bearer ${_accessToken}`;
  }

  try {
    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Check for 401 Unauthorized (token expired or invalid)
    if (response.status === 401 && !path.includes('/auth/login') && !path.includes('/auth/refresh') && !path.includes('/auth/signup')) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        // Attempt to call the refresh endpoint
        try {
          const refreshUrl = buildApiUrl('/api/v1/auth/refresh');
          const refreshResponse = await fetch(refreshUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.success && refreshData.data.accessToken) {
              // Store new tokens
              setAccessToken(refreshData.data.accessToken);
              localStorage.setItem('refreshToken', refreshData.data.refreshToken);

              // Retry original request with the new access token
              headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
              response = await fetch(url, {
                ...options,
                headers,
              });
              return response;
            }
          }
        } catch (refreshErr) {
          console.error('Error refreshing token:', refreshErr);
        }
      }

      // If refresh failed or no refresh token, notify app to logout
      if (_onTokenExpired) {
        _onTokenExpired();
      }
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export default API_BASE_URL;
