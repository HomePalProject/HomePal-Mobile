# Contributing

Thank you for helping maintain HomePal.

## Before You Start

- Read the architecture and coding standards documents in `docs/`.
- Keep changes focused and consistent with the Feature First Architecture.
- Do not add business logic to route files.
- Do not install packages unless explicitly requested.

## Working Rules

- Place shared code in `src/`.
- Keep reusable UI in `src/components/ui/`.
- Keep API code in `src/services/api/`.
- Keep state management in `src/store/` or inside the owning feature.
- Keep assets in `src/assets/`.
- Follow the naming and import rules in `docs/CODING_STANDARDS.md`.

## Pull Request Checklist

- Documentation updates are included when the architecture or workflow changes.
- Route files remain minimal.
- Feature ownership is clear.
- No unrelated files were modified.
- Formatting is consistent with the repository.
