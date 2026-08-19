# Walkthrough — Git Branching & Commit Execution

We have successfully organized and committed all 50+ files of our work into a clean **Stacked Branch Architecture**, adhering strictly to Conventional Commits and passing all Husky pre-commit formatting and linting hooks!

---

## 🌳 Git Commit & Branch Graph

```text
* 9782477 (HEAD -> feat/google-oauth-android) feat(auth): integrate native Google OAuth sign-in and Android native build config
* 2124188 (feat/auth-register-onboarding) feat(auth): implement Registration and 4-step interactive onboarding flow
* d13dc21 (feat/auth-login) feat(auth): implement Welcome, Sign In, and Forgot Password screens
* 91fd44b (feat/redux-auth-core) feat(auth): implement Redux Toolkit global auth state, Axios client, and Zod schemas
* 255e8df (feat/theme-design-system) feat(ui): implement dynamic dark mode theme, design tokens, and core UI components
* 7f8defb (development) Merge branch 'development' of https://github.com/HomePalProject/HomePal-Mobile into development
```

---

## 📦 Summary of Branches & Committed Files

### 1. `feat/theme-design-system`

- **Commit**: `255e8df` — `feat(ui): implement dynamic dark mode theme, design tokens, and core UI components`
- **Files**:
  - `global.css`, `tailwind.config.js`, `package.json`, `package-lock.json`
  - `src/theme/colors.ts`, `src/theme/index.ts`, `src/hooks/useTheme.ts`
  - `src/providers/ThemeProvider.tsx`, `src/providers/ToastProvider.tsx`
  - `src/components/ui/button.tsx`, `src/components/ui/text-field.tsx`, `src/components/ui/checkbox.tsx`, `src/components/ui/date-picker.tsx`
  - `app/_layout.tsx`, `app/index.tsx`

### 2. `feat/redux-auth-core`

- **Commit**: `91fd44b` — `feat(auth): implement Redux Toolkit global auth state, Axios client, and Zod schemas`
- **Files**:
  - `src/types/api.ts`, `v1 (1).json`
  - `src/services/api/client.ts`, `src/services/api/auth.service.ts`, `src/services/storage/auth.storage.ts`
  - `src/store/index.ts`, `src/store/slices/authSlice.ts`, `src/utils/validation.ts`

### 3. `feat/auth-login`

- **Commit**: `d13dc21` — `feat(auth): implement Welcome, Sign In, and Forgot Password screens`
- **Files**:
  - `app/(auth)/_layout.tsx`, `app/(auth)/welcome.tsx`, `src/features/onboarding/WelcomeScreen.tsx`
  - `app/(auth)/login.tsx`, `src/features/auth/SignInScreen.tsx`, `app/(auth)/forgot-password.tsx`

### 4. `feat/auth-register-onboarding`

- **Commit**: `2124188` — `feat(auth): implement Registration and 4-step interactive onboarding flow`
- **Files**:
  - `app/(auth)/register.tsx`, `src/features/auth/RegisterScreen.tsx`
  - `app/(onboarding)/_layout.tsx`, `app/(onboarding)/step1.tsx`, `app/(onboarding)/step2.tsx`, `app/(onboarding)/step3.tsx`, `app/(onboarding)/step4.tsx`

### 5. `feat/google-oauth-android`

- **Commit**: `9782477` — `feat(auth): integrate native Google OAuth sign-in and Android native build config`
- **Files**:
  - `src/utils/googleAuth.ts`, `app.json`
  - `android/` (all native Android project configuration files and build artifacts)

---

## 🚀 How to Open Pull Requests

Since this uses a **Stacked Branch Strategy**, you can open your Pull Requests on GitHub in sequence:

1. Open PR #1: `feat/theme-design-system` → into `development`
2. Open PR #2: `feat/redux-auth-core` → into `feat/theme-design-system`
3. Open PR #3: `feat/auth-login` → into `feat/redux-auth-core`
4. Open PR #4: `feat/auth-register-onboarding` → into `feat/auth-login`
5. Open PR #5: `feat/google-oauth-android` → into `feat/auth-register-onboarding`

Once PR #1 is merged into `development`, GitHub will automatically rebase or let you merge PR #2 into `development`, and so on!
