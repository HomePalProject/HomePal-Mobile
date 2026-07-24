# HomePal Theme Context Documentation

This document explains the Theme Context architecture in the HomePal Mobile application, how to use it, and best practices for styling components.

## Why the Theme Context Exists

While NativeWind utility classes (e.g., `bg-surface-surface`, `p-spacing-16`) are excellent for standard declarative styling directly in TSX, there are scenarios where components require access to design system tokens at runtime via JavaScript.

The Theme Context exists to:

1. **Bridge the Design System**: Provide a single, React-idiomatic source of truth for design tokens (colors, typography, spacing, radius, shadows) in JavaScript.
2. **Support Dynamic & Custom Styling**: Allow dynamic styling for properties that Tailwind cannot easily compute (e.g., React Native canvas drawing, custom charts, SVGs, third-party component props like `StatusBar` colors or ActivityIndicator color props).
3. **Enable Future Theme Modes**: Prepare the application for Light/Dark mode switching by encapsulating theme state within a single React Context. When Dark Mode is introduced, the provider will dynamically switch the underlying values without requiring changes in consumer code.

---

## Folder Responsibilities

The theme system is organized within the `src/` directory to enforce clear separation of concerns:

- `src/theme/`: Contains the static source-of-truth configuration files:
  - [colors.ts](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/src/theme/colors.ts): Primary, Accent, Success, Warning, Error, Surface, and Text colors.
  - [typography.ts](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/src/theme/typography.ts): Typography weights, font-families, and text styles.
  - [spacing.ts](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/src/theme/spacing.ts): Margin and padding spacing scales.
  - [radius.ts](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/src/theme/radius.ts): Border radius definitions.
  - [shadows.ts](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/src/theme/shadows.ts): Multi-platform shadow structures.
  - [index.ts](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/src/theme/index.ts): Unifies individual tokens and exports types (`AppTheme`, etc.) as well as navigation theme overrides.
- `src/providers/`: Contains stateful application providers:
  - [ThemeProvider.tsx](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/src/providers/ThemeProvider.tsx): Manages theme mode (`light` or `dark`) and provides the active theme values through standard React Context.
- `src/hooks/`: Contains custom application hooks:
  - [useTheme.ts](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/src/hooks/useTheme.ts): Exposes the current theme context to components via a simple hook.

---

## How to Use `useTheme()`

To consume design tokens in a component, call `useTheme()` at the root of your component:

```tsx
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

export function LoadingCard() {
  const theme = useTheme();

  return (
    <View
      style={{
        padding: theme.spacing['spacing/16'],
        borderRadius: theme.radius.medium,
        backgroundColor: theme.colors.surface.surface,
        ...theme.shadows.medium,
      }}>
      <ActivityIndicator color={theme.colors.brand.primary} />
    </View>
  );
}
```

### Exposed Properties

The returned object contains the following structures matching the design tokens:

- **`theme.colors`**: Access color hierarchies like `brand.primary`, `surface.background`, `text.primary`.
- **`theme.typography`**: Access font weights and full typography text styles.
- **`theme.spacing`**: Access layout spacing values (e.g., `theme.spacing['spacing/16']` yields `16`).
- **`theme.radius`**: Access corner radius values (e.g., `theme.radius.medium` yields `16`).
- **`theme.shadows`**: Access cross-platform shadow presets (`low`, `medium`, `high`).

---

## When to Use NativeWind vs. `useTheme()`

Understanding when to use NativeWind classes versus the custom hook prevents code duplication and keeps the layout performant and maintainable.

| Use Case                        | Recommended Approach           | Example                                                                               |
| :------------------------------ | :----------------------------- | :------------------------------------------------------------------------------------ |
| **Standard UI Layouts**         | **NativeWind Utility Classes** | `className="bg-surface-surface p-spacing-16 rounded-radius-medium"`                   |
| **Custom Canvas / SVGs**        | **`useTheme()`**               | Passing `theme.colors.brand.primary` to SVG `<Path fill={...}/>`                      |
| **Third-Party Component Props** | **`useTheme()`**               | `<ActivityIndicator color={theme.colors.brand.primary} />`                            |
| **Dynamic Inline Calculations** | **`useTheme()`**               | Dynamic item widths in custom carousel list components.                               |
| **Multi-Platform Shadows**      | **`useTheme()`**               | Applying complex shadow offsets, opacity, and elevation presets from `theme.shadows`. |

### Principle: NativeWind-First

Always default to **NativeWind utility classes** for styling your layouts, colors, and margins. Switch to **`useTheme()`** only when the element is styled imperatively, requires shadow objects, or is rendered via third-party React Native component properties.
