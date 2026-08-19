# HomePal Theme Setup Report

This report outlines the technical implementation of the **HomePal Design Foundation** inside the application. Every value corresponds exactly to the specifications documented in [DESIGN_SYSTEM_REPORT.md](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/DESIGN_SYSTEM_REPORT.md).

---

## 1. Directory Structure

All design tokens have been created in the `src/theme/` directory:

- [colors.ts](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/src/theme/colors.ts) — Brand, surface, and text color palettes.
- [typography.ts](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/src/theme/typography.ts) — Font families, weights, and text style scales (Cairo font).
- [spacing.ts](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/src/theme/spacing.ts) — Spacing scales based on the 8px unit.
- [radius.ts](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/src/theme/radius.ts) — Border radius values (Small, Medium, Large, Full).
- [shadows.ts](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/src/theme/shadows.ts) — Elevation drop shadow mappings for React Native.
- [index.ts](file:///d:/ITI%209%20Months/Graduation/HomePal/HomePal-Mobile/src/theme/index.ts) — Re-exports every theme module and establishes layout theme structures.

---

## 2. File Contents & Visual Tokens

### Colors (`colors.ts`)

Houses strongly-typed color definitions grouped by usage context:

- **`brand`**: Main brand identity: `primary` (`#356859`), `primaryPressed` (`#2A5347`), `primaryContainer` (`#DCEEE8`), `accent` (`#D99A3D`), `accentContainer` (`#F7E7CA`), along with functional success, warning, error, and info colors.
- **`surface`**: Structural background and containers: `background` (`#FAF8F3`), `surface` (`#FFFFFF`), `surfaceVariant` (`#F4F2EE`), `border` and `divider` (`#E4E0DA`).
- **`text`**: Text contrast roles: `primary` (`#2D2A26`), `secondary` (`#6D6862`), `disabled` (`#A8A29B`), `inverse` (`#FFFFFF`), and `onAccent` (`#2D2A26`).

### Typography (`typography.ts`)

Contains rules for typography scales using the **Cairo** font family:

- **`weights`**: `regular` (400), `medium` (500), `semiBold` (600), `bold` (700).
- **`styles`**: Structured configurations for `display`, `h1`, `h2`, `h3`, `bodyLarge`, `body`, `bodySmall`, `caption`, and `label`.

### Spacing (`spacing.ts`)

Maps spacing scale tokens exactly to their pixel sizes:

- `spacing/4`: 4px
- `spacing/8`: 8px
- `spacing/16`: 16px
- `spacing/24`: 24px
- `spacing/32`: 32px
- `spacing/48`: 48px
- `spacing/64`: 64px

### Radius (`radius.ts`)

Defines corner rounding constants:

- `small`: 8px
- `medium`: 16px
- `large`: 24px
- `full`: 9999px

### Shadows (`shadows.ts`)

Exports drop-shadow properties optimized for React Native iOS/Android styling:

- `low`: standard card drop shadows (elevation 4).
- `medium`: raised buttons/chips (elevation 8).
- `high`: sheet overlay menus and modal layers (elevation 12).

---

## 3. How to Import and Use the Theme

Developers should import tokens directly from the `@/src/theme` entrypoint.

### Code Examples

#### 1. Importing Single Modules

```typescript
import { colors, spacing, radius } from '@/src/theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.surface,
    padding: spacing['spacing/16'],
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
});
```

#### 2. Importing the Unified Theme Object

```typescript
import { theme } from '@/src/theme';

console.log(theme.colors.brand.primary); // '#356859'
console.log(theme.typography.styles.h1.fontSize); // 32
```

#### 3. Styling Typography with Styles

```typescript
import { Text, StyleSheet } from 'react-native';
import { typography } from '@/src/theme';

export function HeaderText({ children }) {
  return <Text style={styles.header}>{children}</Text>;
}

const styles = StyleSheet.create({
  header: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
});
```
