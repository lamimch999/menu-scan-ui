
import React, { createContext, useContext, useState, useEffect } from 'react';
import { isTokenValid, removeToken } from '@/utils/api';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  checkAuth: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = () => {
    const valid = isTokenValid();
    setIsAuthenticated(valid);
    if (!valid) {
      removeToken();
    }
    setIsLoading(false);
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  useEffect(() => {
    checkAuth();
    // Check token validity every 30 seconds for better real-time detection
    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, checkAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
