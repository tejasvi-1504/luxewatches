import axios from 'axios';

const raw = import.meta.env.VITE_API_URL || 'https://luxewatches-theta.vercel.app';
const BASE = raw.replace(/\/$/, '') + '/api';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('lw_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => Promise.reject(new Error(err.response?.data?.message || 'Something went wrong'))
);

export default api;
