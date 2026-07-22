# Coding Standards

## Naming Conventions

- Components: `PascalCase`, file name matches the component name, for example `UserCard.tsx`.
- Hooks: start with `use`, for example `useAuth.ts` or `useDebouncedValue.ts`.
- Services: descriptive domain names, for example `authService.ts` or `profileApi.ts`.
- Providers: `PascalCase` with `Provider` suffix, for example `ThemeProvider.tsx`.
- Stores: descriptive feature or domain names, for example `authStore.ts` or `cartStore.ts`.
- Feature folders: lowercase domain names, for example `auth`, `profile`, `checkout`.

## File Naming Conventions

- Use `PascalCase.tsx` for React components.
- Use `camelCase.ts` for hooks, utilities, services, and types where the file is not a component.
- Use `index.ts` only for intentional barrel exports.
- Keep route files aligned with Expo Router conventions such as `_layout.tsx`, `index.tsx`, and `+not-found.tsx`.

## Import Ordering

1. React and React Native imports.
2. Expo and framework imports.
3. Third-party libraries.
4. Internal absolute imports from `@/`.
5. Relative imports.
6. Type-only imports grouped with the module they belong to.

## Formatting Rules

- Use TypeScript for all new code.
- Prefer functional components.
- Keep route files thin and behavior-light.
- Keep modules focused and avoid large catch-all files.
- Use single quotes consistently.
- Keep semicolons as configured by the repository formatter.
- Do not add unused exports or placeholder abstractions.
- Preserve NativeWind class usage and React Native Reusables patterns.

## State, API, UI, and Assets

- State management belongs in `src/store/` for shared state, or inside a feature for local state.
- API access belongs in `src/services/api/`.
- Reusable UI belongs in `src/components/ui/`.
- Feature-specific UI belongs inside the owning feature folder.
- Assets belong in `src/assets/`.
- Constants belong in `src/constants/`.
- Types belong in `src/types/`.
- Theme tokens belong in `src/theme/`.

## React Native Practices

- Prefer platform-safe APIs and avoid web-only assumptions in shared code.
- Keep component props explicit and typed.
- Avoid duplicating styles and logic across features.
- Prefer composition over inheritance.
- Use route groups and nested layouts to separate app flows.
