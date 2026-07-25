# HomePal Mobile — Full Project Overview

## 🏠 What is HomePal?

**HomePal** is a React Native mobile application (graduation project) for **household and kitchen management**. It's designed to help users manage their pantry, get meal recommendations, track budgets, and organize their home — with native support for **Arabic (RTL)** and English.

---

## 📦 Tech Stack

| Layer                  | Technology                    | Version              |
| :--------------------- | :---------------------------- | :------------------- |
| **Framework**          | React Native                  | 0.86.0               |
| **Platform**           | Expo SDK                      | 57                   |
| **UI Runtime**         | React                         | 19.2.3               |
| **Navigation**         | Expo Router                   | ~57.0.7              |
| **Styling**            | NativeWind (Tailwind CSS)     | ^4.2.6 / ^3.4.14     |
| **UI Primitives**      | React Native Reusables        | via `@rn-primitives` |
| **Icons**              | Lucide React Native           | ^1.21.0              |
| **Animations**         | React Native Reanimated       | 4.5.0                |
| **Language**           | TypeScript                    | ~6.0.3               |
| **Font**               | Cairo (Arabic + English)      | —                    |
| **Linting/Formatting** | Prettier + Husky + Commitlint | Latest               |

---

## 🏗️ Architecture: Feature-First

The project follows a **Feature-First Architecture** where:

- **`app/`** — Expo Router entry points and route groups (kept thin, no business logic)
- **`src/`** — All application code organized by concern

### Folder Map

```
app/
├── _layout.tsx          # Root navigation shell (ThemeProvider + NavigationThemeProvider + Stack)
├── index.tsx            # Entry screen (currently renders TestTheme)
├── +html.tsx            # Web HTML wrapper
├── +not-found.tsx       # 404 handler
src/
├── assets/              # fonts/, icons/, images/
├── components/
│   ├── ui/              # Design-system primitives (Button, Text, Icon)
│   └── common/          # Shared app components (empty)
├── features/            # Feature modules by business domain
│   └── test/TestTheme.tsx  # Theme verification component
├── theme/               # 🎨 Design system tokens (single source of truth)
│   ├── index.ts         # Re-exports all tokens + NAV_THEME + AppTheme type
│   ├── colors.ts        # Brand, Surface, Text color palettes
│   ├── typography.ts    # Cairo font family with full type scale
│   ├── spacing.ts       # 8px base spacing system (4–64px)
│   ├── radius.ts        # Border radius tokens (8/16/24/9999px)
│   └── shadows.ts       # iOS/Android shadow presets (low/medium/high)
├── providers/           # ThemeProvider.tsx (React Context for runtime token access)
├── hooks/               # useTheme.ts (custom hook for theme tokens)
├── services/
│   ├── api/             # Backend integration (empty)
│   └── storage/         # Local persistence (empty)
├── store/               # Global state management (empty)
├── navigation/          # Navigation helpers (empty)
├── constants/           # Shared constants (empty)
├── types/               # Shared TypeScript types (empty)
├── config/              # App configuration (empty)
├── localization/        # i18n / RTL translation resources (empty)
└── utils/               # Generic helpers (cn utility for className merging)
```

---

## 🎨 Design System (from Figma)

The design tokens were extracted from a Figma file and codified in `src/theme/`. Both **NativeWind utility classes** and **TypeScript StyleSheets** consume the same tokens.

### Brand Colors

| Token             | HEX       | Usage                                       |
| :---------------- | :-------- | :------------------------------------------ |
| Primary           | `#356859` | Main actions, active nav, key highlights    |
| Primary Pressed   | `#2A5347` | Active/pressed states                       |
| Primary Container | `#DCEEE8` | Highlighted cards, positive badges          |
| Accent            | `#D99A3D` | Ratings, status icons, secondary highlights |
| Accent Container  | `#F7E7CA` | Warning containers                          |
| Success           | `#43A66F` | Valid inputs, positive progress             |
| Warning           | `#E6A33A` | Pending statuses, alerts                    |
| Error             | `#D9534F` | Destructive actions, errors                 |
| Info              | `#4F8EF7` | Tips, guides, info blocks                   |

### Surface Colors

| Token            | HEX       | Usage                           |
| :--------------- | :-------- | :------------------------------ |
| Background       | `#FAF8F3` | App background (warm off-white) |
| Surface          | `#FFFFFF` | Cards, modals, inputs           |
| Surface Variant  | `#F4F2EE` | Nested containers               |
| Border / Divider | `#E4E0DA` | Outlines, separators            |

### Text Colors

| Token     | HEX       | Usage                       |
| :-------- | :-------- | :-------------------------- |
| Primary   | `#2D2A26` | Headings, main body         |
| Secondary | `#6D6862` | Labels, helper text         |
| Disabled  | `#A8A29B` | Inactive states             |
| Inverse   | `#FFFFFF` | On dark/primary backgrounds |
| On Accent | `#2D2A26` | On accent containers        |

### Typography (Cairo Font)

| Style      | Size | Weight         | Line Height |
| :--------- | :--- | :------------- | :---------- |
| Display    | 40px | Bold (700)     | 48px        |
| H1         | 32px | Bold (700)     | 40px        |
| H2         | 28px | Bold (700)     | 36px        |
| H3         | 22px | SemiBold (600) | 30px        |
| Body Large | 18px | Medium (500)   | 28px        |
| Body       | 16px | Regular (400)  | 24px        |
| Body Small | 14px | Regular (400)  | 20px        |
| Caption    | 12px | Regular (400)  | 18px        |
| Label      | 13px | SemiBold (600) | 18px        |

### Spacing (8px base)

`4 · 8 · 16 · 24 · 32 · 48 · 64`

### Border Radius

Small: 8px · Medium: 16px · Large: 24px · Full: 9999px

### Shadows

Low (elevation 4) · Medium (elevation 8) · High (elevation 12)

---

## 🧩 Designed Components (from Figma, not yet all coded)

The Figma file defines these components:

| Component                    | Status        | Notes                                                                        |
| :--------------------------- | :------------ | :--------------------------------------------------------------------------- |
| **Button**                   | ✅ Base coded | Variants: Primary, Secondary, Tertiary, Text, Destructive. Sizes: 44/48/56px |
| **Text**                     | ✅ Coded      | CVA-based with variant support (h1-h4, p, code, etc.)                        |
| **Icon**                     | ✅ Coded      | Lucide wrapper with NativeWind `cssInterop`                                  |
| **Text Field / Input**       | ❌ Not coded  | Default/Focus/Error/Disabled. 56px height, 8px radius                        |
| **Checkbox & Radio**         | ❌ Not coded  | 20×20px, Brand Primary fills                                                 |
| **Switch**                   | ❌ Not coded  | 44×24px, pill shape                                                          |
| **Chip**                     | ❌ Not coded  | Selected/Unselected, pill shape                                              |
| **Bottom Navigation**        | ❌ Not coded  | 74px height, RTL support, pill active indicator                              |
| **App Bar**                  | ❌ Not coded  | 64px height, back + title + actions                                          |
| **Pantry Item Card**         | ❌ Not coded  | 158×144px grid card                                                          |
| **Meal Recommendation Card** | ❌ Not coded  | AI Pick badge, thumbnail, recipe action                                      |
| **Bottom Sheet / Modal**     | ❌ Not coded  | 24px radius, slide-up                                                        |
| **Snackbar**                 | ❌ Not coded  | 56px confirmation banner                                                     |

---

## 🔄 Git Workflow & Tooling

- **Branch naming**: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/` prefixes (enforced by Husky pre-commit)
- **Commit style**: Conventional Commits (enforced by commitlint)
- **Formatting**: Prettier via lint-staged on commit
- **Branch strategy**: Short-lived feature branches → `development` → `main`

---

## 📜 Commit History (all 3 PRs merged)

| #   | PR Title                                                    | Date         | Changes                                                                                                                    |
| :-- | :---------------------------------------------------------- | :----------- | :------------------------------------------------------------------------------------------------------------------------- |
| 3   | `chore(theme): integrate design system tokens`              | Jul 24, 2026 | +967/-52 — Full design system: colors, typography, spacing, radius, shadows, ThemeProvider, useTheme, Tailwind integration |
| 2   | `chore(tooling): setup husky and commitlint`                | Jul 22, 2026 | Git hooks, branch validation, lint-staged                                                                                  |
| 1   | `chore(structure): preserve empty directories with gitkeep` | Jul 22, 2026 | Feature-first directory scaffold                                                                                           |

**Latest commit**: [`c7b9d2a`](https://github.com/HomePalProject/HomePal-Mobile/commit/c7b9d2afc9d5183c52a86852eb6f6bb6edf25e54) — _Merge PR #3: integrate design system tokens_ — by **MariamEssam5** on Jul 24, 2026

> [!IMPORTANT]
> Local repo has been synced to the latest commit via `git pull origin main`.

---

## 🎯 Styling Rules (How to Write Code)

### NativeWind-First Approach

```tsx
// ✅ Preferred — NativeWind utility classes
<View className="rounded-radius-medium border-surface-border bg-surface-surface p-spacing-16 border">
  <Text className="font-cairo text-text-primary text-lg font-bold">Title</Text>
</View>
```

### useTheme() for Runtime / Dynamic Needs

```tsx
// ✅ When you need JS-level access (3rd party props, SVGs, dynamic values)
const theme = useTheme();
<ActivityIndicator color={theme.colors.brand.primary} />;
```

### ❌ Never Do

- Hardcode hex colors (`#356859`) in components
- Duplicate values in `tailwind.config.js` or `global.css`
- Modify token files without design system alignment

---

## 📋 Current State Summary

The project is in **early scaffold phase**:

- ✅ Project initialized with Expo SDK 57 + React 19
- ✅ Feature-first architecture established
- ✅ Git workflow with Husky + Commitlint enforced
- ✅ Complete design system tokens integrated (from Figma)
- ✅ ThemeProvider + useTheme hook ready
- ✅ Tailwind config dynamically reads from `src/theme/`
- ❌ No feature screens built yet
- ❌ No navigation (tabs/auth) implemented
- ❌ No API services connected
- ❌ No state management wired
- ❌ Most Figma components not yet coded
- ❌ Cairo font not yet loaded/bundled (referenced but not installed)

> [!NOTE]
> The Figma file exists but no direct URL was found in the repo. The design tokens were manually extracted and documented in [DESIGN_SYSTEM_REPORT.md](file:///d:/CrossITI/GradProj/Home-Pal/DESIGN_SYSTEM_REPORT.md). If you have the Figma link, I can pull screenshots and component details from it.
