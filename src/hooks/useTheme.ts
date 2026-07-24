import { useContext } from 'react';
import { ThemeContext } from '../providers/ThemeProvider';
import { theme as defaultTheme, AppTheme } from '../theme';

/**
 * Custom hook to access the current application theme.
 * Exposes colors, typography, spacing, radius, and shadows.
 * Falls back to the default light theme if used outside the ThemeProvider.
 */
export function useTheme(): AppTheme {
  const context = useContext(ThemeContext);
  if (!context) {
    return defaultTheme;
  }
  return context.theme;
}
