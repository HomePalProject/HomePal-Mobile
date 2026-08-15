# HomePal Agent Guidelines

These are the strict rules and guidelines that must be followed when contributing to the HomePal-Mobile repository. They are derived from the project's architecture, decisions, coding standards, and UX requirements.

## 1. Architectural Decisions & Stack

- **Frameworks**: Expo SDK 57, React 19, React Native.
- **Routing**: Expo Router (`app/` directory). Keep route files thin and focused solely on navigation. Do NOT put business logic directly in route files.
- **Styling**: NativeWind for utility-first styling.
- **UI Components**: React Native Reusables for reusable UI primitives.
- **Language**: TypeScript for all application code.

## 2. Feature-First Architecture & Folder Structure

This repository uses a Feature First Architecture.

- **`app/`**: Expo Router entry points, route groups, and minimal route placeholders.
- **`src/features/`**: Domain-owned feature modules. Feature-owned logic stays inside the relevant feature module.
- **`src/components/ui/`**: Reusable design-system primitives and UI components.
- **`src/components/common/`**: Shared app components used across multiple features.
- **`src/services/api/`**: API access and request helpers.
- **`src/services/storage/`**: Local storage logic.
- **`src/store/`**: Global state management. (Keep local state inside the feature).
- **`src/theme/`**: Theme tokens and navigation theme configuration.
- **`src/assets/`**, `src/constants/`, `src/types/`, `src/hooks/`, `src/utils/`, `src/providers/`, `src/localization/`.

## 3. Coding Standards

### Naming

- **Components**: `PascalCase.tsx` (e.g. `UserCard.tsx`).
- **Hooks**: camelCase starting with `use` (e.g. `useAuth.ts`).
- **Services/Utils/Stores/Types**: `camelCase.ts`.
- **Providers**: `PascalCase` with `Provider` suffix.
- **Folders**: lowercase domain names (e.g. `auth`, `profile`).
- **Exports**: Use `index.ts` only for intentional barrel exports.

### Formatting & Best Practices

- Prefer functional components.
- Use single quotes consistently.
- Prefer platform-safe APIs; avoid web-only assumptions.
- Keep component props explicit and typed.
- Prefer composition over inheritance.

### Imports Ordering

1. React and React Native imports.
2. Expo and framework imports.
3. Third-party libraries.
4. Internal absolute imports from `@/`.
5. Relative imports.
6. Type-only imports grouped with the module they belong to.

## 4. UI/UX & Premium Feel (Crucial)

The app must have a premium feel. When building or modifying UI, you MUST follow these 5 dimensions:

1. **Press States**: Buttons and touchables must feel like physical objects. Use `pressto`, custom Reanimated press animations, or `Pressable` with scale/opacity feedback. NEVER use flat `TouchableOpacity` or `Pressable` with no animated response.
2. **Subtle Animations**: Animations must be purposeful and fast (150-300ms). Use `react-native-reanimated`, `react-native-ease`, or `LayoutAnimation`. Avoid bouncy entrances on every element.
3. **Haptics**: Use `expo-haptics` or `react-native-pulsar` for state changes and decisions. Do not overuse on every tap/scroll, but do not omit them entirely.
4. **Keyboard Behavior**: Ensure inputs stay visible. Use `react-native-keyboard-controller` or `KeyboardAvoidingView`. Allow drag-to-dismiss and ensure keyboards don't hide submit buttons.
5. **Loading and Empty States**: Avoid default spinners. Use skeleton screens. Empty lists must have clear, explanatory empty-state components with next actions.

### Component-Specific Rules

- **Modals vs Bottom Sheets**:
  - All non-destructive interactive menus, options, pickers, and forms MUST use Bottom Sheets (`AppBottomSheet` powered by `@gorhom/bottom-sheet`) instead of standard center-screen Modals.
  - Destructive actions (e.g., Delete, Logout) MUST remain as standard center-screen dialog alerts.
- **Form/Text Inputs**: All `TextField` and `SearchBar` components must use the app's **primary color (`#356859`)** for cursor and text selection highlights. Do not use bright accent colors for text selection.
- **RTL & Navigation**: All back-navigation arrows and directional icons must flip automatically based on `I18nManager.isRTL` to support seamless RTL localization.

## 5. Git Workflow

- Small, focused, short-lived branches.
- Concise, imperative commit messages describing the outcome (e.g., `docs: add architecture standards`).
- Don't mix unrelated changes.
