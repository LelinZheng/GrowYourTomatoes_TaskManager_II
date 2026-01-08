import { storageService } from './storage.service';
import api from './api/axiosConfig';
import { AUTH_ENDPOINTS } from './api/endpoints';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../types/User';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );
    
    if (response.data.token) {
      // Token is stored securely via storageService
      await storageService.setItem('token', response.data.token);
      // User info stored in AsyncStorage (non-sensitive) if present; otherwise remove
      if (response.data.user) {
        await storageService.setItem('user', response.data.user);
      } else {
        await storageService.removeItem('user');
      }
    }
    
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      AUTH_ENDPOINTS.REGISTER,
      data
    );
    
    if (response.data.token) {
      // Token is stored securely via storageService
      await storageService.setItem('token', response.data.token);
      // User info stored in AsyncStorage (non-sensitive) if present; otherwise remove
      if (response.data.user) {
        await storageService.setItem('user', response.data.user);
      } else {
        await storageService.removeItem('user');
      }
    }
    
    return response.data;
  },

  async logout(): Promise<void> {
    await storageService.removeItem('token');
    await storageService.removeItem('user');
  },

  async getCurrentUser(): Promise<User | null> {
    return await storageService.getItem<User>('user');
  },

  async getToken(): Promise<string | null> {
    return await storageService.getItem<string>('token');
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await authService.getToken();
    return !!token;
  },
};
