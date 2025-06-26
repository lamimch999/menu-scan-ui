
import { API_BASE_URL } from '../config/env';

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setToken = (token: string): void => {
  localStorage.setItem('authToken', token);
  // Set expiration time (1 hour from now)
  const expirationTime = new Date().getTime() + (60 * 60 * 1000);
  localStorage.setItem('tokenExpiration', expirationTime.toString());
};

export const removeToken = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenExpiration');
};

export const isTokenValid = (): boolean => {
  const token = getToken();
  const expirationTime = localStorage.getItem('tokenExpiration');
  
  if (!token || !expirationTime) {
    return false;
  }
  
  const now = new Date().getTime();
  const expiration = parseInt(expirationTime);
  
  if (now > expiration) {
    removeToken();
    return false;
  }
  
  return true;
};

// API request wrapper
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token && isTokenValid()) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
};

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },
};

// Restaurant API
export const restaurantAPI = {
  getAll: () => apiRequest('/api/restaurants'),
  getById: (id: string) => apiRequest(`/api/restaurants/${id}`),
  create: (restaurantData: any) => apiRequest('/api/restaurants', {
    method: 'POST',
    body: JSON.stringify(restaurantData),
  }),
  update: (id: string, restaurantData: any) => apiRequest(`/api/restaurants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(restaurantData),
  }),
  delete: (id: string) => apiRequest(`/api/restaurants/${id}`, {
    method: 'DELETE',
  }),
};

// Helper function to get image URL
export const getImageUrl = (filename: string): string => {
  return `${API_BASE_URL}/uploads/restaurant/${filename}`;
};
