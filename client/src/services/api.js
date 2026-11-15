import axios from 'axios';

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const DEFAULT_SERVER_URL = isLocalhost
  ? 'http://localhost:5000'
  : 'https://hiresphere-job-portal-j8df.onrender.com';

export const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL || DEFAULT_SERVER_URL;
export const API_BASE_URL = import.meta.env.VITE_API_URL || `${SERVER_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hiresphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const reqUrl = error.config?.url || '';
    const hadAuthHeader = Boolean(
      error.config?.headers?.Authorization || error.config?.headers?.authorization
    );
    const isAuthAttempt =
      reqUrl.includes('/auth/login') || reqUrl.includes('/auth/register');

    if (status === 401 && hadAuthHeader && !isAuthAttempt) {
      localStorage.removeItem('hiresphere_token');
      localStorage.removeItem('hiresphere_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getFileUrl = (relativePath) => {
  if (!relativePath) return '';
  if (relativePath.startsWith('http')) return relativePath;
  return `${SERVER_BASE_URL}${relativePath}`;
};

export default api;
