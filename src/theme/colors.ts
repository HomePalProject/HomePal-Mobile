export const colors = {
  brand: {
    primary: '#356859',
    primaryPressed: '#2A5347',
    primaryContainer: '#DCEEE8',
    accent: '#D99A3D',
    accentContainer: '#F7E7CA',
    success: '#43A66F',
    warning: '#E6A33A',
    error: '#D9534F',
    info: '#4F8EF7',
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
} as const;

export type Colors = typeof colors;
