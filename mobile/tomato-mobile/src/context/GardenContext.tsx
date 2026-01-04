import React, { createContext, useState, useCallback } from 'react';
import { GardenStats, Punishment } from '../types/Punishment';
import { gardenService } from '../services/garden.service';

export interface GardenContextType {
  stats: GardenStats | null;
  punishments: Punishment[];
  isLoading: boolean;
  error: string | null;
  fetchGardenStats: () => Promise<void>;
  fetchPunishments: () => Promise<void>;
  refreshGarden: () => Promise<void>;
  clearError: () => void;
}

export const GardenContext = createContext<GardenContextType | undefined>(undefined);

export interface GardenContextProviderProps {
  children: React.ReactNode;
}

export const GardenContextProvider: React.FC<GardenContextProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<GardenStats | null>(null);
  const [punishments, setPunishments] = useState<Punishment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGardenStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const gardenStats = await gardenService.getGardenStats();
      setStats(gardenStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch garden stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPunishments = useCallback(async () => {
    try {
      setError(null);
      const fetchedPunishments = await gardenService.getPunishments();
      setPunishments(fetchedPunishments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch punishments');
    }
  }, []);

  const refreshGarden = useCallback(async () => {
    try {
      setError(null);
      await Promise.all([fetchGardenStats(), fetchPunishments()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh garden');
    }
  }, [fetchGardenStats, fetchPunishments]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: GardenContextType = {
    stats,
    punishments,
    isLoading,
    error,
    fetchGardenStats,
    fetchPunishments,
    refreshGarden,
    clearError,
  };

  return <GardenContext.Provider value={value}>{children}</GardenContext.Provider>;
};
