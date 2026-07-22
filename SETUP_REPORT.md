# SETUP REPORT

## Packages Installed

- `husky`
- `lint-staged`
- `@commitlint/cli`
- `@commitlint/config-conventional`

## Files Created

- `commitlint.config.cjs`
- `.husky/pre-commit`
- `.husky/commit-msg`
- `scripts/validate-branch-name.js`
- `SETUP_REPORT.md`

## Files Modified

- `package.json`

## Git Hooks Configured

- `pre-commit`: validates the branch name, then runs `lint-staged`.
- `commit-msg`: runs Commitlint against the commit message.

## Branch Naming Rules

- Allowed prefixes: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/`.
- Rejected examples: `test`, `newbranch`, `feature`, `mywork`.
- Validation is enforced before staged-file formatting runs.

## Conventional Commit Rules

- Commit messages must follow Conventional Commits.
- Examples supported by the configured rule set:
  - `feat(auth): add login screen`
  - `fix(home): resolve navigation bug`
  - `docs(readme): update setup`
  - `refactor(profile): split hooks`
  - `chore(deps): update expo sdk`

## Exact package.json Changes

- Added `prepare`, `lint`, `format`, and `commitlint` scripts.
- Added a `lint-staged` configuration for `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.json`, and `*.md` files using `prettier --write`.
- Added Husky, lint-staged, and Commitlint packages to `devDependencies`.

## Assumptions Made

- Existing Prettier settings in `.prettierrc` are authoritative and were reused unchanged.
- No ESLint setup was added because it was out of scope.
- The branch validation hook is intentionally strict and only accepts the listed prefixes.
