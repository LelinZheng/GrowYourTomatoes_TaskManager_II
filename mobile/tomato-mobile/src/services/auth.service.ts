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
      // Fetch current user profile with token
      try {
        const me = await api.get<User>(AUTH_ENDPOINTS.ME, {
          headers: { Authorization: `Bearer ${response.data.token}` },
        });
        await storageService.setItem('user', me.data);
        response.data.user = me.data;
      } catch (e) {
        // If /auth/me not available, ensure user is cleared
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
      // Fetch current user profile with token
      try {
        const me = await api.get<User>(AUTH_ENDPOINTS.ME, {
          headers: { Authorization: `Bearer ${response.data.token}` },
        });
        await storageService.setItem('user', me.data);
        response.data.user = me.data;
      } catch (e) {
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

  async fetchMe(): Promise<User | null> {
    try {
      const token = await this.getToken();
      if (!token) return null;
      const me = await api.get<User>(AUTH_ENDPOINTS.ME);
      await storageService.setItem('user', me.data);
      return me.data;
    } catch (e) {
      return null;
    }
  },
};
