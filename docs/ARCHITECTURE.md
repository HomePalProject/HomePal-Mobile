# Architecture

HomePal uses a Feature First Architecture on top of Expo Router. The router owns navigation and screen entry points, while `src/` owns reusable app code, domain modules, and shared infrastructure.

## High-Level Principles

- Keep route files thin and focused on navigation.
- Place feature-owned logic inside feature modules, not in shared folders.
- Keep reusable UI separate from feature-specific UI.
- Keep platform configuration, constants, types, and theme tokens centralized.
- Avoid cross-feature coupling; share only through stable, reusable abstractions.

## Layering

- `app/`: Expo Router entry points, route groups, and minimal route placeholders.
- `src/features/`: domain-owned feature modules.
- `src/components/ui/`: reusable design-system primitives.
- `src/components/common/`: shared app components that are not design-system primitives.
- `src/services/`: API and storage integration.
- `src/providers/`: app-wide context composition.
- `src/store/`: global state containers when needed.
- `src/hooks/`: reusable hooks.
- `src/utils/`: generic helpers.
- `src/constants/`, `src/types/`, `src/theme/`: shared configuration, types, and visual tokens.

## Ownership

Feature code is owned by the feature that uses it. Shared code is owned by the platform layer and must stay generic. If a component, hook, or service is used by only one feature, keep it inside that feature until it becomes broadly reusable.

## Placement Rules

- API logic belongs in `src/services/api/`.
- Local storage logic belongs in `src/services/storage/`.
- Reusable UI belongs in `src/components/ui/`.
- Shared feature helpers belong in `src/components/common/` or the relevant feature module.
- State management belongs in `src/store/` when global, otherwise keep state local to the feature.
- Assets belong in `src/assets/`.
- Theme tokens and navigation theme configuration belong in `src/theme/`.
- Shared constants belong in `src/constants/`.
- Shared TypeScript contracts belong in `src/types/`.
- Localization resources belong in `src/localization/`.

## Expo Router Notes

- Keep `app/_layout.tsx` as the root navigation shell.
- Use route groups such as `app/(auth)/` and `app/(tabs)/` for navigation structure.
- Keep route screens minimal and delegate behavior to feature modules.
- Do not put business logic directly in route files.
