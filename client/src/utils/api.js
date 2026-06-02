import axios from 'axios';

const getBase = () => {
  if (import.meta.env.VITE_API_URL) return `${import.meta.env.VITE_API_URL}/api`;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://luxewatches-theta.vercel.app/api';
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBase(),
  withCredentials: true,
});

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(msg));
  }
);

export default api;
