import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
  useMemo,
} from 'react';
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

  // Let NativeWind handle the actual color scheme string ('system' | 'light' | 'dark')
  useEffect(() => {
    setColorScheme(mode);
  }, [mode, setColorScheme]);

  // No load-on-mount here by design. The root layout reads the persisted mode before
  // this provider is mounted and passes it as `initialMode`, so reading it again here
  // would be a duplicate SecureStore hit — and would resolve *after* first paint, which
  // is what caused the theme to flash from system to the saved value on cold start.
  // Writing stays here (handleSetMode) so the provider remains the only writer.

  const handleSetMode = useCallback(async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }, []);

  const contextValue: ThemeContextType = useMemo(
    () => ({
      theme: currentTheme,
      mode,
      resolvedMode,
      setMode: handleSetMode,
    }),
    [currentTheme, mode, resolvedMode, handleSetMode]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
