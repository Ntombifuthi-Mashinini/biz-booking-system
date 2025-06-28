import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://biz-booking-system-3.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        
        case 403:
          // Forbidden - show access denied message
          console.error('Access denied. You do not have permission to perform this action.');
          break;
        
        case 404:
          // Not found
          console.error('Resource not found.');
          break;
        
        case 422:
          // Validation error
          if (data.details) {
            data.details.forEach(detail => {
              console.error(detail.msg);
            });
          } else {
            console.error(data.error || 'Validation failed');
          }
          break;
        
        case 429:
          // Rate limit exceeded
          console.error('Too many requests. Please try again later.');
          break;
        
        case 500:
          // Server error
          console.error('Server error. Please try again later.');
          break;
        
        default:
          // Other errors
          console.error(data.error || 'An error occurred');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error. Please check your connection.');
    } else {
      // Other error
      console.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

// API functions for different endpoints

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verify: () => api.get('/auth/verify'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  logout: () => api.delete('/auth/account'),
};

// Services API
export const servicesAPI = {
  getAll: (businessId) => api.get(`/services?businessId=${businessId}`),
  getById: (id) => api.get(`/services/${id}`),
  create: (serviceData) => api.post('/services', serviceData),
  update: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  delete: (id) => api.delete(`/services/${id}`),
  getByCategory: (businessId, category) => api.get(`/services/category/${category}?businessId=${businessId}`),
  getCategories: (businessId) => api.get(`/services/categories/all?businessId=${businessId}`),
  search: (businessId, query) => api.get(`/services/search/query?businessId=${businessId}&q=${query}`),
  getStats: () => api.get('/services/stats/overview'),
  getPopular: (limit = 5) => api.get(`/services/popular/list?limit=${limit}`),
  bulkUpdate: (updates) => api.put('/services/bulk/update', { updates }),
  getAvailability: (id, date) => api.get(`/services/${id}/availability?date=${date}`),
};

// Bookings API
export const bookingsAPI = {
  getAll: (filters = {}) => api.get('/bookings', { params: filters }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (bookingData) => api.post('/bookings', bookingData),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  uploadPaymentProof: (id, proofFile) => api.post(`/bookings/${id}/payment-proof`, { proofFile }),
  verifyPayment: (id, isVerified) => api.put(`/bookings/${id}/verify-payment`, { isVerified }),
  cancel: (id, reason) => api.delete(`/bookings/${id}`, { data: { reason } }),
  reschedule: (id, newDate, newTime) => api.put(`/bookings/${id}/reschedule`, { newDate, newTime }),
  getStats: (dateRange) => api.get('/bookings/stats/overview', { params: dateRange }),
  getAvailability: (serviceId, date) => api.get(`/bookings/availability/${serviceId}?date=${date}`),
  getReminders: () => api.get('/bookings/reminders/pending'),
  markReminderSent: (id) => api.put(`/bookings/${id}/mark-reminder-sent`),
  export: (format = 'json', dateRange) => api.get('/bookings/export/bookings', { 
    params: { format, ...dateRange },
    responseType: format === 'csv' ? 'blob' : 'json'
  }),
};

// Uploads API
export const uploadsAPI = {
  uploadPaymentProof: (file) => {
    const formData = new FormData();
    formData.append('proofFile', file);
    return api.post('/uploads/payment-proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadLogo: (file) => {
    const formData = new FormData();
    formData.append('logoFile', file);
    return api.post('/uploads/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getFile: (filename) => api.get(`/uploads/${filename}`),
  deleteFile: (filename) => api.delete(`/uploads/${filename}`),
  getFileInfo: (filename) => api.get(`/uploads/info/${filename}`),
};

// Dashboard API
export const dashboardAPI = {
  getOverview: (dateRange) => api.get('/dashboard/overview', { params: dateRange }),
  getBookingAnalytics: (period = 30) => api.get(`/dashboard/analytics/bookings?period=${period}`),
  getRevenueAnalytics: (period = 30) => api.get(`/dashboard/analytics/revenue?period=${period}`),
  getNotifications: () => api.get('/dashboard/notifications'),
  markNotificationRead: (id) => api.put(`/dashboard/notifications/${id}/read`),
  getSettings: () => api.get('/dashboard/settings'),
  updateSettings: (settings) => api.put('/dashboard/settings', settings),
  getProfile: () => api.get('/dashboard/profile'),
  exportBookings: (format, dateRange) => api.get('/dashboard/export/bookings', {
    params: { format, ...dateRange },
    responseType: format === 'csv' ? 'blob' : 'json'
  }),
  getStats: () => api.get('/dashboard/stats'),
  getRecentBookings: () => api.get('/dashboard/recent-bookings'),
};

// Utility functions
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDateTime = (date, time) => {
  const dateTime = new Date(`${date}T${time}`);
  return dateTime.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default api; 