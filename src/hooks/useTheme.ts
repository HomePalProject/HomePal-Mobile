import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '../providers/ThemeProvider';
import { theme as defaultTheme } from '../theme';

/**
 * Custom hook to access the current application theme context.
 * Exposes { theme, mode, resolvedMode, setMode }.
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: defaultTheme,

      mode: 'system',
      resolvedMode: 'light',
      setMode: () => {},
    };
  }
  return context;
}
