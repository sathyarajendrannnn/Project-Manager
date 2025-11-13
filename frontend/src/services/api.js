import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to all requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (userData) => API.put('/auth/profile', userData),
};

// Projects API
export const projectAPI = {
  getProjects: () => API.get('/projects'),
  getProject: (id) => API.get(`/projects/${id}`),
  createProject: (projectData) => API.post('/projects', projectData),
  updateProject: (id, projectData) => API.put(`/projects/${id}`, projectData),
  deleteProject: (id) => API.delete(`/projects/${id}`),
};

// Timesheets API
export const timesheetAPI = {
  getTimesheets: () => API.get('/timesheets'),
  getTimesheet: (id) => API.get(`/timesheets/${id}`),
  createTimesheet: (timesheetData) => API.post('/timesheets', timesheetData),
  updateTimesheet: (id, timesheetData) => API.put(`/timesheets/${id}`, timesheetData),
  deleteTimesheet: (id) => API.delete(`/timesheets/${id}`),
};

// Finance API
export const financeAPI = {
  getInvoices: () => API.get('/finance/invoices'),
  getInvoice: (id) => API.get(`/finance/invoices/${id}`),
  createInvoice: (invoiceData) => API.post('/finance/invoices', invoiceData),
  updateInvoice: (id, invoiceData) => API.put(`/finance/invoices/${id}`, invoiceData),
  deleteInvoice: (id) => API.delete(`/finance/invoices/${id}`),
};

// Reports API
export const reportAPI = {
  getProjectReports: () => API.get('/reports/projects'),
  getFinancialReports: () => API.get('/reports/financial'),
  getTimesheetReports: () => API.get('/reports/timesheets'),
};

// Users API
export const userAPI = {
  getUsers: () => API.get('/users'),
  getUser: (id) => API.get(`/users/${id}`),
  createUser: (userData) => API.post('/users', userData),
  updateUser: (id, userData) => API.put(`/users/${id}`, userData),
  deleteUser: (id) => API.delete(`/users/${id}`),
};

export default API;