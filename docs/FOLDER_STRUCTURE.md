# Folder Structure

This repository follows a Feature First layout. New work should go into `src/`, while `app/` remains the Expo Router entry layer.

## Major Folders

- `app/`: Expo Router routes, route groups, and minimal screen placeholders.
- `src/assets/`: bundled fonts, icons, and images.
- `src/components/common/`: shared app components used across multiple features.
- `src/components/ui/`: reusable UI primitives and design-system components.
- `src/features/`: feature modules organized by domain.
- `src/navigation/`: navigation helpers, route utilities, and navigation-related abstractions.
- `src/services/api/`: API clients, request helpers, and remote-data access.
- `src/services/storage/`: persistence helpers for local storage and device data.
- `src/hooks/`: shared hooks.
- `src/utils/`: generic utilities.
- `src/constants/`: shared constants and app-wide values.
- `src/theme/`: theme tokens, theme mapping, and navigation theme values.
- `src/types/`: shared TypeScript types and interfaces.
- `src/store/`: global state management modules.
- `src/providers/`: app-level providers and context composition.
- `src/config/`: environment and app configuration.
- `src/localization/`: locale strings and translation resources.

## Current Root-Level Directories

- `assets/`: legacy template assets currently retained for compatibility.
- `components/`: legacy template UI location currently retained for compatibility.
- `lib/`: legacy template utilities currently retained for compatibility.

## Folder Naming Conventions

- Use lowercase folder names.
- Prefer feature or domain names over technical names.
- Use route groups in `app/` when a navigation boundary is needed.
- Keep shared code in stable top-level `src/` folders instead of scattering it across routes.

## Feature Folder Conventions

- Each feature folder should represent one business domain.
- Keep feature-specific components, hooks, services, and state close to that feature.
- Export only what other layers need; avoid creating a public surface for internal implementation details unless required.
