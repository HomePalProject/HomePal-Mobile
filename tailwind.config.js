const { hairlineWidth } = require('nativewind/theme');
const fs = require('fs');
const path = require('path');

function readThemeFile(fileName) {
  const filePath = path.join(__dirname, 'src', 'theme', fileName);
  let content = fs.readFileSync(filePath, 'utf-8');

  content = content.replace(/export\s+type\s+[\s\S]*$/g, '');
  content = content.replace(/as\s+const;?/g, '');
  content = content.replace(/export\s+const\s+(\w+)\s*=/g, 'global.$1 =');

  const sandbox = {};
  const fn = new Function('global', content);
  fn(sandbox);
  return sandbox;
}

// Load design tokens from src/theme
const { colors } = readThemeFile('colors.ts');
const { typography } = readThemeFile('typography.ts');
const { spacing } = readThemeFile('spacing.ts');
const { radius } = readThemeFile('radius.ts');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Expose brand semantic design system tokens
        brand: {
          primary: colors.brand.primary,
          'primary-pressed': colors.brand.primaryPressed,
          'primary-container': colors.brand.primaryContainer,
          accent: colors.brand.accent,
          'accent-container': colors.brand.accentContainer,
          success: colors.brand.success,
          warning: colors.brand.warning,
          error: colors.brand.error,
          info: colors.brand.info,
          'amber-300': colors.brand.amber300,
        },
        surface: {
          background: colors.surface.background,
          surface: colors.surface.surface,
          'surface-variant': colors.surface.surfaceVariant,
          border: colors.surface.border,
          divider: colors.surface.divider,
        },
        text: {
          primary: colors.text.primary,
          secondary: colors.text.secondary,
          disabled: colors.text.disabled,
          inverse: colors.text.inverse,
          'on-accent': colors.text.onAccent,
        },
        // Keep existing CSS-variable backed colors for NativeWind consumer components
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
        // Expose spacing scale tokens under both slash and hyphen syntaxes
        ...Object.keys(spacing).reduce((acc, key) => {
          const hyphenKey = key.replace('/', '-');
          acc[hyphenKey] = spacing[key];
          acc[key] = spacing[key];
          return acc;
        }, {}),
      },
      borderRadius: {
        // Expose border radius tokens
        'radius-small': `${radius.small}px`,
        'radius-medium': `${radius.medium}px`,
        'radius-large': `${radius.large}px`,
        'radius-full': `${radius.full}px`,
        // Keep existing variables
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
};
