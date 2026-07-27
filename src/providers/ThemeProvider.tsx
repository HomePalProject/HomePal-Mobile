import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { theme as defaultTheme, darkTheme, AppTheme } from '../theme';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme as useRNColorScheme } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeContextType {
  theme: AppTheme;
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_STORAGE_KEY = 'HOMEPAL_THEME_MODE';

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({ children, initialMode = 'system' }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(initialMode);
  const { setColorScheme } = useNativeWindColorScheme();
  const rawSystemScheme = useRNColorScheme();
  const systemColorScheme: 'light' | 'dark' = rawSystemScheme === 'dark' ? 'dark' : 'light';

  // Resolved mode is either explicitly light/dark or whatever the OS system currently is
  const resolvedMode: 'light' | 'dark' =
    mode === 'system' ? systemColorScheme : (mode as 'light' | 'dark');

  const currentTheme = resolvedMode === 'dark' ? darkTheme : defaultTheme;

  // Sync NativeWind with resolved mode reliably
  useEffect(() => {
    setColorScheme(resolvedMode);
  }, [resolvedMode, setColorScheme]);

  useEffect(() => {
    // Load saved theme preference on mount
    const loadSavedTheme = async () => {
      try {
        const saved = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setModeState(saved);
        } else {
          setModeState('system');
        }
      } catch (error) {
        console.error('Failed to load theme preference from storage:', error);
      }
    };
    loadSavedTheme();
  }, []);

  const handleSetMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const contextValue: ThemeContextType = {
    theme: currentTheme,
    mode,
    resolvedMode,
    setMode: handleSetMode,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
