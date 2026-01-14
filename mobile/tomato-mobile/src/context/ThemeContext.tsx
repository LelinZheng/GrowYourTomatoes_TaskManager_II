import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    // Primary
    primary: string;
    primaryLight: string;
    primaryDark: string;
    
    // Secondary
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    
    // Actions
    actionBlue: string;
    actionBlueDark: string;
    actionGreen: string;
    actionGreenDark: string;
    actionYellow: string;
    actionYellowDark: string;
    actionRed: string;
    actionRedDark: string;
    
    // Neutrals
    white: string;
    black: string;
    gray50: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray800: string;
    gray900: string;
    
    // Status
    success: string;
    warning: string;
    danger: string;
    info: string;
    
    // Priority
    priorityHigh: string;
    priorityMedium: string;
    priorityLow: string;
    
    // Garden
    fog: string;
    weed: string;
    wiltedLeaf: string;
    tomatoRed: string;
    tomatoGreen: string;
    
    // Semantic colors (adapt to theme)
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    surface: string;
    surfaceSecondary: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderDark: string;
  };
}

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const THEME_STORAGE_KEY = '@tomato_theme_mode';

// Light theme colors
const lightTheme: Theme = {
  mode: 'light',
  colors: {
    // Primary
    primary: '#DC2626',
    primaryLight: '#FEE2E2',
    primaryDark: '#991B1B',
    
    // Secondary
    secondary: '#10B981',
    secondaryLight: '#D1FAE5',
    secondaryDark: '#047857',
    
    // Actions
    actionBlue: '#3B82F6',
    actionBlueDark: '#2563EB',
    actionGreen: '#10B981',
    actionGreenDark: '#059669',
    actionYellow: '#F59E0B',
    actionYellowDark: '#D97706',
    actionRed: '#EF4444',
    actionRedDark: '#DC2626',
    
    // Neutrals
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    
    // Status
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    
    // Priority
    priorityHigh: '#EF4444',
    priorityMedium: '#F59E0B',
    priorityLow: '#10B981',
    
    // Garden
    fog: 'rgba(156, 163, 175, 0.7)',
    weed: '#7C3AED',
    wiltedLeaf: '#D97706',
    tomatoRed: '#DC2626',
    tomatoGreen: '#16A34A',
    
    // Semantic (light)
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    backgroundTertiary: '#F3F4F6',
    surface: '#FFFFFF',
    surfaceSecondary: '#F9FAFB',
    text: '#111827',
    textSecondary: '#4B5563',
    textTertiary: '#6B7280',
    border: '#E5E7EB',
    borderDark: '#D1D5DB',
  },
};

// Dark theme colors
const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    // Primary
    primary: '#EF4444',
    primaryLight: '#7F1D1D',
    primaryDark: '#FCA5A5',
    
    // Secondary
    secondary: '#10B981',
    secondaryLight: '#064E3B',
    secondaryDark: '#6EE7B7',
    
    // Actions
    actionBlue: '#60A5FA',
    actionBlueDark: '#3B82F6',
    actionGreen: '#34D399',
    actionGreenDark: '#10B981',
    actionYellow: '#FBBF24',
    actionYellowDark: '#F59E0B',
    actionRed: '#F87171',
    actionRedDark: '#EF4444',
    
    // Neutrals
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    
    // Status
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    info: '#60A5FA',
    
    // Priority
    priorityHigh: '#F87171',
    priorityMedium: '#FBBF24',
    priorityLow: '#34D399',
    
    // Garden
    fog: 'rgba(156, 163, 175, 0.5)',
    weed: '#A78BFA',
    wiltedLeaf: '#FBBF24',
    tomatoRed: '#EF4444',
    tomatoGreen: '#22C55E',
    
    // Semantic (dark)
    background: '#111827',
    backgroundSecondary: '#1F2937',
    backgroundTertiary: '#374151',
    surface: '#1F2937',
    surfaceSecondary: '#374151',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    border: '#374151',
    borderDark: '#4B5563',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved && (saved === 'light' || saved === 'dark' || saved === 'auto')) {
          setThemeModeState(saved as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Determine actual theme based on mode
  const actualMode = themeMode === 'auto' 
    ? (systemColorScheme === 'dark' ? 'dark' : 'light')
    : themeMode;

  const theme = actualMode === 'dark' ? darkTheme : lightTheme;
  const isDark = actualMode === 'dark';

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
