const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

export const buildApiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

export default API_BASE_URL
