import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const BACKEND = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
    ? 'https://luxewatches-theta.vercel.app/api'
    : '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lw_token');
    if (!token) { setLoading(false); return; }
    axios.get(`${BACKEND}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem('lw_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${BACKEND}/auth/login`, { email, password });
    localStorage.setItem('lw_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${BACKEND}/auth/register`, { name, email, password });
    localStorage.setItem('lw_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('lw_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
