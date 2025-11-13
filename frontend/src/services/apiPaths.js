export const API_PATHS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
  
  // Projects
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id) => `/projects/${id}`,
  
  // Timesheets
  TIMESHEETS: '/timesheets',
  TIMESHEET_BY_ID: (id) => `/timesheets/${id}`,
  
  // Finance
  INVOICES: '/finance/invoices',
  INVOICE_BY_ID: (id) => `/finance/invoices/${id}`,
  
  // Reports
  PROJECT_REPORTS: '/reports/projects',
  FINANCIAL_REPORTS: '/reports/financial',
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
};

export const getApiUrl = (path) => {
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  return `${baseURL}${path}`;
};