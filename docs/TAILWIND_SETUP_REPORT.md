# Tailwind Theme Integration Report

This report outlines the technical changes made to [tailwind.config.js](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/tailwind.config.js) to integrate the HomePal Design System tokens dynamically.

---

## 1. Summary of Changes

We have refactored [tailwind.config.js](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/tailwind.config.js) to consume the TypeScript design tokens directly from `src/theme/` rather than hardcoding values.

The configuration now:

1. **Loads TS Files in Node**: Implements a lightweight in-memory CommonJS parser/loader that strips TypeScript types and transpiles the configuration objects on-the-fly, avoiding any Node-level runtime errors or dependencies like `ts-node`.
2. **Exposes Semantic Colors**: Merges all `brand`, `surface`, and `text` palettes into the extended theme under standard, clear scopes.
3. **Exposes Font Families**: Exposes the `Cairo` font family under the `font-cairo` utility.
4. **Exposes Spacing Scales**: Imports spacing scales under both original `spacing/X` and standard hyphen-separated `spacing-X` keys (e.g., `spacing-16` / `spacing/16`).
5. **Exposes Border Radius**: Maps `radius-small`, `radius-medium`, `radius-large`, and `radius-full` directly.
6. **Retains NativeWind Support**: Retains the CSS variable bindings for standard components, allowing shadcn-style component presets to function exactly as before.

---

## 2. Developer Utility Class Guide

Developers can now style components using standard Tailwind utility classes mapped directly to the design system:

### Colors

- **Brand Colors**:
  - `bg-brand-primary` / `text-brand-primary`
  - `bg-brand-primary-pressed`
  - `bg-brand-primary-container`
  - `bg-brand-accent` / `text-brand-accent`
  - `bg-brand-success` / `bg-brand-warning` / `bg-brand-error` / `bg-brand-info`
- **Surface Colors**:
  - `bg-surface-background`
  - `bg-surface-surface`
  - `bg-surface-surface-variant`
  - `border-surface-border`
- **Text Colors**:
  - `text-text-primary`
  - `text-text-secondary`
  - `text-text-disabled`
  - `text-text-inverse`

### Typography

- **Cairo Font Family**: Apply the Cairo font style to any text component using:
  - `font-cairo`

### Spacing Scale

Spacing tokens can be applied using standard layout and sizing utilities (e.g., padding, margin, width, gap):

- **Hyphen-separated format (Recommended)**:
  - `p-spacing-16`
  - `m-spacing-24`
  - `gap-spacing-8`
- **Slash-separated format**:
  - `p-[spacing/16]`
  - `gap-[spacing/8]`

### Border Radius

Apply corner rounding directly:

- `rounded-radius-small` (8px)
- `rounded-radius-medium` (16px)
- `rounded-radius-large` (24px)
- `rounded-radius-full` (9999px)

---

### Usage Example

```tsx
import { View, Text } from 'react-native';

export function PantryCard() {
  return (
    <View className="rounded-radius-medium border border-surface-border bg-surface-surface p-spacing-16 shadow-sm">
      <Text className="font-cairo text-lg font-bold text-text-primary">Baladi Bread</Text>
      <Text className="mt-spacing-4 font-cairo text-text-secondary">20 loaves left</Text>
    </View>
  );
}
```
