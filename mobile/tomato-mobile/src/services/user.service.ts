import api from './api/axiosConfig';
import { USER_ENDPOINTS } from './api/endpoints';
import { storageService } from './storage.service';
import { User } from '../types/User';

interface UpdateUsernameResponse {
  message: string;
  user: User;
}

export const userService = {
  async updateUsername(username: string): Promise<User> {
    const response = await api.patch<UpdateUsernameResponse>(USER_ENDPOINTS.UPDATE_USERNAME, {
      username,
    });

    const updatedUser = response.data.user;
    await storageService.setItem('user', updatedUser);
    return updatedUser;
  },
};
