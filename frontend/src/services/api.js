import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bloodconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login attempt failure
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('bloodconnect_token');
        localStorage.removeItem('bloodconnect_user');
      }
    }
    return Promise.reject(error);
  }
);

// 1. Auth Services
export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/auth/profile', data);
    return res.data;
  },
};

// 2. Donor Services
export const donorService = {
  searchDonors: async (params) => {
    const res = await api.get('/donors/search', { params });
    return res.data;
  },
  getAllDonors: async (params) => {
    const res = await api.get('/donors', { params });
    return res.data;
  },
  getDonorById: async (id) => {
    const res = await api.get(`/donors/${id}`);
    return res.data;
  },
  updateProfile: async (id, data) => {
    const res = await api.put(`/donors/${id}`, data);
    return res.data;
  },
  toggleAvailability: async (isAvailable) => {
    const res = await api.patch('/donors/availability', { isAvailable });
    return res.data;
  },
  getDonorRelevantRequests: async () => {
    const res = await api.get('/donors/me/requests');
    return res.data;
  },
};

// 3. Blood Request Services
export const requestService = {
  getPublicStats: async () => {
    const res = await api.get('/requests/stats/public');
    return res.data;
  },
  createRequest: async (data) => {
    const res = await api.post('/requests', data);
    return res.data;
  },
  getAllRequests: async (params) => {
    const res = await api.get('/requests', { params });
    return res.data;
  },
  getRequestById: async (id) => {
    const res = await api.get(`/requests/${id}`);
    return res.data;
  },
  updateRequest: async (id, data) => {
    const res = await api.put(`/requests/${id}`, data);
    return res.data;
  },
  cancelRequest: async (id) => {
    const res = await api.delete(`/requests/${id}`);
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/requests/${id}/status`, { status });
    return res.data;
  },
  respondToRequest: async (id, responseData) => {
    const res = await api.post(`/requests/${id}/respond`, responseData);
    return res.data;
  },
  getRequestResponses: async (id) => {
    const res = await api.get(`/requests/${id}/responses`);
    return res.data;
  },
};

// 4. Admin Services
export const adminService = {
  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },
  getUsers: async (params) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },
  toggleUserStatus: async (id, isActive) => {
    const res = await api.patch(`/admin/users/${id}/status`, { isActive });
    return res.data;
  },
  getDonors: async (params) => {
    const res = await api.get('/admin/donors', { params });
    return res.data;
  },
  getRequests: async (params) => {
    const res = await api.get('/admin/requests', { params });
    return res.data;
  },
};

export default api;
