import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hiresphere_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [profileOrCompany, setProfileOrCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('hiresphere_token');
    if (!token) {
      setUser(null);
      setProfileOrCompany(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      if (data.success) {
        setUser(data.data.user);
        setProfileOrCompany(data.data.profileOrCompany);
        localStorage.setItem('hiresphere_user', JSON.stringify(data.data.user));
      }
    } catch (error) {
      localStorage.removeItem('hiresphere_token');
      localStorage.removeItem('hiresphere_user');
      setUser(null);
      setProfileOrCompany(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('hiresphere_token', data.data.token);
      localStorage.setItem('hiresphere_user', JSON.stringify(data.data.user));
      setUser(data.data.user);
      await fetchCurrentUser();
      toast.success(`Welcome back, ${data.data.user.name}!`);
      return data.data.user;
    }
    throw new Error(data.message || 'Login failed');
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    if (data.success) {
      localStorage.setItem('hiresphere_token', data.data.token);
      localStorage.setItem('hiresphere_user', JSON.stringify(data.data.user));
      setUser(data.data.user);
      await fetchCurrentUser();
      toast.success('Account created successfully!');
      return data.data.user;
    }
    throw new Error(data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('hiresphere_token');
    localStorage.removeItem('hiresphere_user');
    setUser(null);
    setProfileOrCompany(null);
    toast.success('Signed out of HireSphere.');
  };

  const getDashboardPath = (role = user?.role) => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'EMPLOYER') return '/employer/dashboard';
    return '/seeker/dashboard';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profileOrCompany,
        loading,
        login,
        register,
        logout,
        refreshUser: fetchCurrentUser,
        getDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
};
