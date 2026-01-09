import React, { createContext, useState, useCallback } from 'react';
import { Punishment } from '../types/Punishment';
import { gardenService } from '../services/garden.service';

export interface GardenContextType {
  tomatoCount: number;
  punishments: Punishment[];
  isLoading: boolean;
  error: string | null;
  fetchGarden: () => Promise<void>;
  refreshGarden: () => Promise<void>;
  clearError: () => void;
}

export const GardenContext = createContext<GardenContextType | undefined>(undefined);

export interface GardenContextProviderProps {
  children: React.ReactNode;
}

export const GardenContextProvider: React.FC<GardenContextProviderProps> = ({ children }) => {
  const [tomatoCount, setTomatoCount] = useState<number>(0);
  const [punishments, setPunishments] = useState<Punishment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGarden = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [tomatoCount, activePunishments] = await Promise.all([
        gardenService.getTomatoesCount(),
        gardenService.getActivePunishments(),
      ]);
      setTomatoCount(tomatoCount);
      setPunishments(activePunishments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch garden data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshGarden = useCallback(async () => {
    try {
      setError(null);
      const [tomatoCount, activePunishments] = await Promise.all([
        gardenService.getTomatoesCount(),
        gardenService.getActivePunishments(),
      ]);
      setTomatoCount(tomatoCount);
      setPunishments(activePunishments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh garden');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: GardenContextType = {
    tomatoCount,
    punishments,
    isLoading,
    error,
    fetchGarden,
    refreshGarden,
    clearError,
  };

  return <GardenContext.Provider value={value}>{children}</GardenContext.Provider>;
};
