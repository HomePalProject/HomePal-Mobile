export const radius = {
  small: 8,
  medium: 16,
  large: 24,
  full: 9999,
} as const;

export type Radius = typeof radius;
