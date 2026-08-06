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
          primary: 'var(--brand-primary, #356859)',
          'primary-pressed': 'var(--brand-primary-pressed, #2A5347)',
          'primary-container': 'var(--brand-primary-container, #DCEEE8)',
          accent: 'var(--brand-accent, #D99A3D)',
          'accent-container': 'var(--brand-accent-container, #F7E7CA)',
          success: colors.brand.success,
          warning: colors.brand.warning,
          error: colors.brand.error,
          'error-container': colors.brand.errorContainer || '#FCE8E6',
          info: colors.brand.info,
          'amber-300': 'var(--brand-amber-300, #F3C35B)',
        },
        status: {
          error: 'var(--status-error, #D9534F)',
          'error-container': 'var(--status-error-container, #FCE8E6)',
          success: 'var(--status-success, #43A66F)',
          warning: 'var(--status-warning, #E6A33A)',
          info: 'var(--status-info, #4F8EF7)',
        },
        surface: {
          background: 'var(--surface-bg, #FAF8F3)',
          surface: 'var(--surface-card, #FFFFFF)',
          'surface-variant': 'var(--surface-variant, #F4F2EE)',
          border: 'var(--surface-border, #E4E0DA)',
          divider: 'var(--surface-divider, #E4E0DA)',
        },
        text: {
          primary: 'var(--text-primary, #2D2A26)',
          secondary: 'var(--text-secondary, #6D6862)',
          disabled: 'var(--text-disabled, #A8A29B)',
          inverse: 'var(--text-inverse, #FFFFFF)',
          'on-accent': colors.text.onAccent,
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
