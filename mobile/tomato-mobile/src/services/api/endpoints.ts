// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
};

// User endpoints
export const USER_ENDPOINTS = {
  UPDATE_USERNAME: '/users/me/username',
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
  GET_TOMATOES_COUNT: '/tomatoes/count',
  GET_PUNISHMENTS_ACTIVE: '/punishments/active',
};

// Tomato endpoints
export const TOMATO_ENDPOINTS = {
  GET_COUNT: '/tomatoes/count',
};

// Punishment endpoints
export const PUNISHMENT_ENDPOINTS = {
  GET_ALL: '/punishments',
};
