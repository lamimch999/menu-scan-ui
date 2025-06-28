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

// API request wrapper for JSON data
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

// API request wrapper for form data (file uploads)
export const apiFormRequest = async (
  endpoint: string,
  formData: FormData,
  method: string = 'POST'
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const headers: HeadersInit = {};
  
  if (token && isTokenValid()) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers,
    body: formData,
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
  create: (restaurantData: FormData) => apiFormRequest('/api/restaurants', restaurantData, 'POST'),
  update: (id: string, restaurantData: FormData) => apiFormRequest(`/api/restaurants/${id}`, restaurantData, 'PUT'),
  delete: (id: string) => apiRequest(`/api/restaurants/${id}`, {
    method: 'DELETE',
  }),
};

// Menu API
export const menuAPI = {
  // Get all menus for a restaurant
  getAllMenus: (restaurantId: string) => apiRequest(`/api/menu/${restaurantId}`),
  
  // Get a specific menu item
  getMenuItem: (menuId: string, itemId: string) => apiRequest(`/api/menu/items/${menuId}/${itemId}`),
  
  // Create a new menu category
  createMenuCategory: (categoryData: { restaurantId: string; category: string }) => 
    apiRequest('/api/menu/create', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    }),
  
  // Create menu items with image support
  createMenuItems: (menuId: string, items: Array<{name: string; price: number; available: boolean; image?: File}>) => {
    const formData = new FormData();
    
    // Add items data (without image files)
    const itemsData = items.map(item => ({
      name: item.name,
      price: item.price,
      available: item.available
    }));
    formData.append('items', JSON.stringify(itemsData));
    
    // Add image files if they exist
    items.forEach((item, index) => {
      if (item.image) {
        formData.append(`itemImage_${index}`, item.image);
      }
    });
    
    return apiFormRequest(`/api/menu/items/${menuId}`, formData, 'POST');
  },
  
  // Update menu category
  updateMenuCategory: (menuId: string, categoryData: { category: string }) => 
    apiRequest(`/api/menu/${menuId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    }),
  
  // Update menu item with image support
  updateMenuItem: (menuId: string, itemId: string, itemData: {name: string; price: number; available: boolean; image?: File}) => {
    const formData = new FormData();
    
    // Add item data (without image file)
    const data = {
      name: itemData.name,
      price: itemData.price,
      available: itemData.available
    };
    formData.append('items', JSON.stringify([data]));
    
    // Add image file if it exists
    if (itemData.image) {
      formData.append('itemImage_0', itemData.image);
    }
    
    return apiFormRequest(`/api/menu/items/${menuId}/${itemId}`, formData, 'PUT');
  },
  
  // Delete menu category
  deleteMenuCategory: (menuId: string) => 
    apiRequest(`/api/menu/${menuId}`, {
      method: 'DELETE',
    }),
  
  // Delete menu item
  deleteMenuItem: (itemId: string) => 
    apiRequest(`/api/menu/items/${itemId}`, {
      method: 'DELETE',
    }),
};

// Client API for public restaurant access
export const clientAPI = {
  // Get restaurant and menu data by slug
  getRestaurantBySlug: (slug: string) => apiRequest(`/api/client/${slug}`),
  
  // Create order
  createOrder: (restaurantId: string, orderData: {
    items: Array<{ name: string; quantity: number }>;
    totalAmount: number;
    tableNumber: number;
    status?: string;
  }) => apiRequest(`/api/client/${restaurantId}/orders`, {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
};

// Orders API for admin management
export const ordersAPI = {
  // Get all orders
  getAllOrders: () => apiRequest('/api/client/orders/all'),
  
  // Update order status
  updateOrderStatus: (orderId: string, status: 'pending' | 'completed' | 'cancelled') => 
    apiRequest(`/api/client/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  
  // Delete order
  deleteOrder: (orderId: string) => 
    apiRequest(`/api/client/orders/${orderId}`, {
      method: 'DELETE',
    }),
};

// Helper functions to get image URLs
export const getRestaurantImageUrl = (filename: string): string => {
  return `${API_BASE_URL}/uploads/restaurant/${filename}`;
};

export const getItemImageUrl = (filename: string): string => {
  return `${API_BASE_URL}/uploads/item-images/${filename}`;
};

// Legacy helper function (kept for backward compatibility)
export const getImageUrl = (filename: string): string => {
  return `${API_BASE_URL}/uploads/restaurant/${filename}`;
};
