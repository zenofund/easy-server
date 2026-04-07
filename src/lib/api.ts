import axios from 'axios';

const rawBaseUrl = ((import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
export const API_BASE_URL = `${rawBaseUrl}/api`;

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to handle potential double slashes or path replacement issues
api.interceptors.request.use(
  (config) => {
    // If url starts with / and baseURL ends with /api, axios might replace the path.
    // We want to ensure it appends to /api.
    if (config.url?.startsWith('/') && config.baseURL?.endsWith('/api')) {
      config.url = config.url.substring(1);
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if we're on the sign-in page or trying to log in
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const isAuthPage = window.location.hash === '#sign-in' || window.location.hash === '#sign-up';

      if (!isLoginRequest && !isAuthPage) {
        // Clear local storage and redirect to landing page on token expiry
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.hash !== '#home' && window.location.hash !== '') {
          window.location.hash = '#home';
          window.location.reload();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
