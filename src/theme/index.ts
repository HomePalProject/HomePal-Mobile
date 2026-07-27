import { DarkTheme, DefaultTheme, type Theme } from 'expo-router/react-navigation';
import { colors, darkColors } from './colors';
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

export const darkTheme = {
  colors: darkColors,
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
    background: darkColors.surface.background,
    foreground: darkColors.text.primary,
    card: darkColors.surface.surface,
    cardForeground: darkColors.text.primary,
    popover: darkColors.surface.surface,
    popoverForeground: darkColors.text.primary,
    primary: darkColors.brand.primary,
    primaryForeground: darkColors.text.inverse,
    secondary: darkColors.surface.surfaceVariant,
    secondaryForeground: darkColors.text.primary,
    muted: darkColors.surface.surfaceVariant,
    mutedForeground: darkColors.text.secondary,
    accent: darkColors.brand.accent,
    accentForeground: darkColors.text.onAccent,
    destructive: darkColors.brand.error,
    border: darkColors.surface.border,
    input: darkColors.surface.border,
    ring: darkColors.brand.primary,
    radius: `${radius.small}px`,
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
