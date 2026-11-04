import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, donorService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('bloodconnect_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('bloodconnect_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('bloodconnect_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('bloodconnect_user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.error('Session verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('bloodconnect_token', res.token);
      localStorage.setItem('bloodconnect_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('bloodconnect_token', res.token);
      localStorage.setItem('bloodconnect_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bloodconnect_token');
    localStorage.removeItem('bloodconnect_user');
  };

  const updateCurrentUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('bloodconnect_user', JSON.stringify(updatedUser));
  };

  const updateUserProfile = async (profileData) => {
    try {
      const res = await authService.updateProfile(profileData);
      if (res.success && res.user) {
        updateCurrentUser(res.user);
      }
      return res;
    } catch (error) {
      throw error;
    }
  };

  const toggleDonorAvailability = async (newAvailability) => {
    try {
      const res = await donorService.toggleAvailability(newAvailability);
      if (res.success && user && user.donorProfile) {
        const updated = {
          ...user,
          donorProfile: {
            ...user.donorProfile,
            isAvailable: res.isAvailable,
          },
        };
        updateCurrentUser(updated);
      }
      return res;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateCurrentUser,
        updateUserProfile,
        toggleDonorAvailability,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
