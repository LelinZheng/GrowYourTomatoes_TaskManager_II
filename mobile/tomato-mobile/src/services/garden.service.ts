import api from './api/axiosConfig';
import { GARDEN_ENDPOINTS, PUNISHMENT_ENDPOINTS } from './api/endpoints';
import { Punishment } from '../types/Punishment';

export const gardenService = {
  async getTomatoesCount(): Promise<number> {
    const response = await api.get<number>(GARDEN_ENDPOINTS.GET_TOMATOES_COUNT);
    return response.data;
  },

  async getActivePunishments(): Promise<Punishment[]> {
    const response = await api.get<Punishment[]>(GARDEN_ENDPOINTS.GET_PUNISHMENTS_ACTIVE);
    return response.data;
  },
};
