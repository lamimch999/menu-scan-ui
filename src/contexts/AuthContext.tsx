
import React, { createContext, useContext, useState, useEffect } from 'react';
import { isTokenValid, removeToken } from '@/utils/api';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const valid = isTokenValid();
    setIsAuthenticated(valid);
    if (!valid) {
      removeToken();
    }
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
    // Check token validity every minute
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, checkAuth }}>
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
