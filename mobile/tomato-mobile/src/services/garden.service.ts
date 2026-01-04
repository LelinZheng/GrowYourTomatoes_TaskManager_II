import api from './api/axiosConfig';
import { GARDEN_ENDPOINTS, TOMATO_ENDPOINTS, PUNISHMENT_ENDPOINTS } from './api/endpoints';
import { GardenStats, Punishment } from '../types/Punishment';

export const gardenService = {
  async getGardenStats(): Promise<GardenStats> {
    const response = await api.get<GardenStats>(GARDEN_ENDPOINTS.GET_STATS);
    return response.data;
  },

  async getPunishments(): Promise<Punishment[]> {
    const response = await api.get<Punishment[]>(
      GARDEN_ENDPOINTS.GET_PUNISHMENTS
    );
    return response.data;
  },

  async getCurrentTomatoes(): Promise<number> {
    const response = await api.get<{ count: number }>(TOMATO_ENDPOINTS.GET_CURRENT);
    return response.data.count;
  },

  async getTomatoHistory(): Promise<any[]> {
    const response = await api.get(TOMATO_ENDPOINTS.GET_HISTORY);
    return response.data;
  },

  async getAllPunishments(): Promise<Punishment[]> {
    const response = await api.get<Punishment[]>(PUNISHMENT_ENDPOINTS.GET_ALL);
    return response.data;
  },
};
