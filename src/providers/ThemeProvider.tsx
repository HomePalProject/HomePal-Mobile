import React, { createContext, useState, ReactNode } from 'react';
import { theme as defaultTheme, AppTheme } from '../theme';

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({ children, initialMode = 'light' }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const currentTheme = defaultTheme;

  const contextValue: ThemeContextType = {
    theme: currentTheme,
    mode,
    setMode: (newMode: ThemeMode) => {
    
      setMode(newMode);
    },
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}
