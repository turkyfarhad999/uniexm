import axios from 'axios';

const API_BASE = 'https://uniexam.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// Subjects
export const subjectsAPI = {
  getAll: (params) => api.get('/subjects', { params }),
  getByCode: (code) => api.get(`/subjects/${code}`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

// Questions
export const questionsAPI = {
  getAll: (params) => api.get('/questions', { params }),
  getBySubject: (code) => api.get(`/questions/by-subject/${code}`),
  getById: (id) => api.get(`/questions/${id}`),
  create: (formData) => api.post('/questions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/questions/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/questions/${id}`),
  downloadPDF: (id) => `${API_BASE}/questions/download/${id}/pdf`,
};

// Practice Questions
export const practiceAPI = {
  getAll: (params) => api.get('/practice', { params }),
  getQuiz: (subjectCode, params) => api.get(`/practice/quiz/${subjectCode}`, { params }),
  getAnswer: (id) => api.get(`/practice/${id}/answer`),
  create: (data) => api.post('/practice', data),
  update: (id, data) => api.put(`/practice/${id}`, data),
  delete: (id) => api.delete(`/practice/${id}`),
};

// Stats
export const statsAPI = {
  getDashboard: () => api.get('/stats'),
};
