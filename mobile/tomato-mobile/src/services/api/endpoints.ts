// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
};

// Task endpoints
export const TASK_ENDPOINTS = {
  GET_ALL: '/api/tasks',
  GET_ONE: (id: number) => `/api/tasks/${id}`,
  CREATE: '/api/tasks',
  UPDATE: (id: number) => `/api/tasks/${id}`,
  DELETE: (id: number) => `/api/tasks/${id}`,
  COMPLETE: (id: number) => `/api/tasks/${id}/complete`,
};

// Garden endpoints
export const GARDEN_ENDPOINTS = {
  GET_STATS: '/api/garden/stats',
  GET_PUNISHMENTS: '/api/garden/punishments',
};

// Tomato endpoints
export const TOMATO_ENDPOINTS = {
  GET_CURRENT: '/api/tomatoes/current',
  GET_HISTORY: '/api/tomatoes/history',
};

// Punishment endpoints
export const PUNISHMENT_ENDPOINTS = {
  GET_ALL: '/api/punishments',
};
