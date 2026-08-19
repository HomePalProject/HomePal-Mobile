import { DarkTheme, DefaultTheme, type Theme } from 'expo-router/react-navigation';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radius';
export * from './shadows';

// Export unified theme object
export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
} as const;

export type AppTheme = typeof theme;

// Maintain backward compatibility with THEME and NAV_THEME for layout and navigation
export const THEME = {
  light: {
    background: colors.surface.background,
    foreground: colors.text.primary,
    card: colors.surface.surface,
    cardForeground: colors.text.primary,
    popover: colors.surface.surface,
    popoverForeground: colors.text.primary,
    primary: colors.brand.primary,
    primaryForeground: colors.text.inverse,
    secondary: colors.surface.surfaceVariant,
    secondaryForeground: colors.text.primary,
    muted: colors.surface.surfaceVariant,
    mutedForeground: colors.text.secondary,
    accent: colors.brand.accent,
    accentForeground: colors.text.onAccent,
    destructive: colors.brand.error,
    border: colors.surface.border,
    input: colors.surface.border,
    ring: colors.brand.primary,
    radius: `${radius.small}px`,
  },
  dark: {
    // Retain dark mode defaults from the original index.ts
    background: 'hsl(0 0% 3.9%)',
    foreground: 'hsl(0 0% 98%)',
    card: 'hsl(0 0% 3.9%)',
    cardForeground: 'hsl(0 0% 98%)',
    popover: 'hsl(0 0% 3.9%)',
    popoverForeground: 'hsl(0 0% 98%)',
    primary: 'hsl(0 0% 98%)',
    primaryForeground: 'hsl(0 0% 9%)',
    secondary: 'hsl(0 0% 14.9%)',
    secondaryForeground: 'hsl(0 0% 98%)',
    muted: 'hsl(0 0% 14.9%)',
    mutedForeground: 'hsl(0 0% 63.9%)',
    accent: 'hsl(0 0% 14.9%)',
    accentForeground: 'hsl(0 0% 98%)',
    destructive: 'hsl(0 70.9% 59.4%)',
    border: 'hsl(0 0% 14.9%)',
    input: 'hsl(0 0% 14.9%)',
    ring: 'hsl(300 0% 45%)',
    radius: '0.625rem',
  },
} as const;

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
