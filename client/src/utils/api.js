import axios from 'axios';

const BACKEND = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
    ? 'https://luxewatches-theta.vercel.app/api'
    : '/api';

const api = axios.create({
  baseURL: BACKEND,
  withCredentials: false,
});

// Attach stored JWT to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('lw_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(msg));
  }
);

export default api;
