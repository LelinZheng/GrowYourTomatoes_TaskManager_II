// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
};

// Task endpoints
export const TASK_ENDPOINTS = {
  GET_ALL: '/tasks',
  GET_ONE: (id: number) => `/tasks/${id}`,
  CREATE: '/tasks',
  UPDATE: (id: number) => `/tasks/${id}`,
  DELETE: (id: number) => `/tasks/${id}`,
  COMPLETE: (id: number) => `/tasks/${id}/complete`,
};

// Garden endpoints
export const GARDEN_ENDPOINTS = {
  GET_STATS: '/garden/stats',
  GET_PUNISHMENTS: '/garden/punishments',
};

// Tomato endpoints
export const TOMATO_ENDPOINTS = {
  GET_CURRENT: '/tomatoes/current',
  GET_HISTORY: '/tomatoes/history',
};

// Punishment endpoints
export const PUNISHMENT_ENDPOINTS = {
  GET_ALL: '/punishments',
};
