# Architectural Decisions

This repository has already standardized on the following choices:

- Expo Router for navigation and route organization.
- React Native Reusables for reusable UI primitives.
- NativeWind for utility-first styling.
- Feature First Architecture for application organization.
- TypeScript for application code.
- React 19 as the UI runtime.
- Expo SDK 57 as the application platform.

## Implications

- Route files stay thin and focus on navigation.
- Shared UI lives in `src/components/ui/`.
- Feature-owned code stays inside the relevant feature module.
- Cross-cutting concerns live in shared `src/` folders.
- The app should remain compatible with Expo Router conventions and NativeWind styling patterns.
