export interface Colors {
  readonly brand: {
    readonly primary: string;
    readonly primaryPressed: string;
    readonly primaryContainer: string;
    readonly accent: string;
    readonly accentContainer: string;
    readonly success: string;
    readonly warning: string;
    readonly error: string;
    readonly errorContainer: string;
    readonly info: string;
  };
  readonly surface: {
    readonly background: string;
    readonly surface: string;
    readonly surfaceVariant: string;
    readonly border: string;
    readonly divider: string;
  };
  readonly text: {
    readonly primary: string;
    readonly secondary: string;
    readonly disabled: string;
    readonly inverse: string;
    readonly onAccent: string;
  };
}

export const lightColors: Colors = {
  brand: {
    primary: '#356859',
    primaryPressed: '#2A5347',
    primaryContainer: '#DCEEE8',
    accent: '#D99A3D',
    accentContainer: '#F7E7CA',
    success: '#43A66F',
    warning: '#E6A33A',
    error: '#D9534F',
    errorContainer: '#FCE8E6',
    info: '#4F8EF7',
    amber300: '#F3C35B',
  },
  surface: {
    background: '#FAF8F3',
    surface: '#FFFFFF',
    surfaceVariant: '#F4F2EE',
    border: '#E4E0DA',
    divider: '#E4E0DA',
  },
  text: {
    primary: '#2D2A26',
    secondary: '#6D6862',
    disabled: '#A8A29B',
    inverse: '#FFFFFF',
    onAccent: '#2D2A26',
  },
};

export const darkColors: Colors = {
  brand: {
    ...lightColors.brand,
    primary: '#42826F',
    primaryPressed: '#356859',
    primaryContainer: '#1A332B',
  },
  surface: {
    background: '#121413',
    surface: '#1E2220',
    surfaceVariant: '#282D2B',
    border: '#363D3A',
    divider: '#363D3A',
  },
  text: {
    primary: '#F2EFE9',
    secondary: '#B0A9A0',
    disabled: '#6D6862',
    inverse: '#121413',
    onAccent: '#121413',
  },
};

export const colors: Colors = lightColors;
