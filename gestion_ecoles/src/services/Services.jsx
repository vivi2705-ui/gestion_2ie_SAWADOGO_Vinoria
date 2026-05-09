// src/services/Services.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cycles API with pagination
export const cyclesApi = {
  getAll: (page = 1, limit = 10) => api.get('/cycles', { params: { page, limit } }),
  getById: (id) => api.get(`/cycles/${id}`),
  create: (data) => api.post('/cycles', data),
  update: (id, data) => api.put(`/cycles/${id}`, data),
  delete: (id) => api.delete(`/cycles/${id}`),
};

// Filieres API with pagination
export const filieresApi = {
  getAll: (page = 1, limit = 10) => api.get('/filieres', { params: { page, limit } }),
  getById: (id) => api.get(`/filieres/${id}`),
  create: (data) => api.post('/filieres', data),
  update: (id, data) => api.put(`/filieres/${id}`, data),
  delete: (id) => api.delete(`/filieres/${id}`),
};

export default api;