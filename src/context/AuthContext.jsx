import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('campusbite_user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 1,
      name: 'Rahul Sharma',
      email: 'student@campus.edu',
      role: 'STUDENT'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('campusbite_token') || 'demo_token_123');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('campusbite_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campusbite_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('campusbite_token', token);
    } else {
      localStorage.removeItem('campusbite_token');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { id, name, email: userEmail, role, token: userToken } = response.data;
      const userData = { id, name, email: userEmail, role };
      setUser(userData);
      setToken(userToken);
      return { success: true, user: userData };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { id, name: userName, email: userEmail, role, token: userToken } = response.data;
      const userData = { id, name: userName, email: userEmail, role };
      setUser(userData);
      setToken(userToken);
      return { success: true, user: userData };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campusbite_user');
    localStorage.removeItem('campusbite_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
