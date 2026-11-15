import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

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
