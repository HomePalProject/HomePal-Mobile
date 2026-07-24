export const typography = {
  fontFamily: 'Cairo',
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
  styles: {
    display: {
      fontFamily: 'Cairo',
      fontSize: 40,
      fontWeight: '700',
      lineHeight: 48,
      letterSpacing: 0,
    },
    h1: {
      fontFamily: 'Cairo',
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
      letterSpacing: 0,
    },
    h2: {
      fontFamily: 'Cairo',
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 36,
      letterSpacing: 0,
    },
    h3: {
      fontFamily: 'Cairo',
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 30,
      letterSpacing: 0,
    },
    bodyLarge: {
      fontFamily: 'Cairo',
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 28,
      letterSpacing: 0,
    },
    body: {
      fontFamily: 'Cairo',
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      letterSpacing: 0,
    },
    bodySmall: {
      fontFamily: 'Cairo',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      letterSpacing: 0,
    },
    caption: {
      fontFamily: 'Cairo',
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18,
      letterSpacing: 0,
    },
    label: {
      fontFamily: 'Cairo',
      fontSize: 13,
      fontWeight: '600',
      lineHeight: 18,
      letterSpacing: 0,
    },
  },
} as const;

export type Typography = typeof typography;
