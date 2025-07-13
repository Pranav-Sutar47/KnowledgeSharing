import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser.token) {
        setUser(currentUser);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      // Store additional user data from API response
      if (result.data.name) localStorage.setItem('name', result.data.name);
      if (result.data.email) localStorage.setItem('email', result.data.email);
      if (result.data.branch) localStorage.setItem('branch', result.data.branch);
      if (result.data.year) localStorage.setItem('year', result.data.year);
      
      // Update user object with stored data
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    }
    return result;
  };

  const signup = async (userData) => {
    const result = await authService.signup(userData);
    if (result.success) {
      // Update user state with the new user data
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    // Clear all stored user data
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('branch');
    localStorage.removeItem('year');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
    isTeacher: user?.role === 'faculty',
    isStudent: user?.role === 'student'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};