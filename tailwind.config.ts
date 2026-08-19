import type { Config } from 'tailwindcss';
import { hairlineWidth } from 'nativewind/theme';
import { colors } from './src/theme/colors';
import { typography } from './src/theme/typography';
import { spacing } from './src/theme/spacing';
import { radius } from './src/theme/radius';

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'hsl(var(--brand-primary) / <alpha-value>)',
          'primary-pressed': 'hsl(var(--brand-primary-pressed) / <alpha-value>)',
          'primary-container': 'hsl(var(--brand-primary-container) / <alpha-value>)',
          accent: 'hsl(var(--brand-accent) / <alpha-value>)',
          'accent-container': 'hsl(var(--brand-accent-container) / <alpha-value>)',
          success: 'hsl(var(--status-success) / <alpha-value>)',
          warning: 'hsl(var(--status-warning) / <alpha-value>)',
          error: 'hsl(var(--status-error) / <alpha-value>)',
          'error-container': 'hsl(var(--status-error-container) / <alpha-value>)',
          info: 'hsl(var(--status-info) / <alpha-value>)',
          'amber-300': 'hsl(var(--brand-amber-300) / <alpha-value>)',
        },
        status: {
          error: 'hsl(var(--status-error) / <alpha-value>)',
          'error-container': 'hsl(var(--status-error-container) / <alpha-value>)',
          success: 'hsl(var(--status-success) / <alpha-value>)',
          warning: 'hsl(var(--status-warning) / <alpha-value>)',
          info: 'hsl(var(--status-info) / <alpha-value>)',
        },
        surface: {
          background: 'hsl(var(--surface-bg) / <alpha-value>)',
          surface: 'hsl(var(--surface-card) / <alpha-value>)',
          'surface-variant': 'hsl(var(--surface-variant) / <alpha-value>)',
          border: 'hsl(var(--surface-border) / <alpha-value>)',
          divider: 'hsl(var(--surface-divider) / <alpha-value>)',
        },
        text: {
          primary: 'hsl(var(--text-primary) / <alpha-value>)',
          secondary: 'hsl(var(--text-secondary) / <alpha-value>)',
          disabled: 'hsl(var(--text-disabled) / <alpha-value>)',
          inverse: 'hsl(var(--text-inverse) / <alpha-value>)',
          'on-accent': '#2D2A26',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        cairo: [typography.fontFamily],
      },
      spacing: {
        ...Object.keys(spacing).reduce((acc: Record<string, string>, key) => {
          const hyphenKey = key.replace('/', '-');
          acc[hyphenKey] = (spacing as any)[key];
          acc[key] = (spacing as any)[key];
          return acc;
        }, {}),
      },
      borderRadius: {
        'radius-small': `${radius.small}px`,
        'radius-medium': `${radius.medium}px`,
        'radius-large': `${radius.large}px`,
        'radius-full': `${radius.full}px`,
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
