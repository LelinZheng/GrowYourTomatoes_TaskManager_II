import { useContext } from 'react';
import { GardenContext, GardenContextType } from '../context/GardenContext';

export const useGarden = (): GardenContextType => {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error('useGarden must be used within a GardenContextProvider');
  }
  return context;
};
