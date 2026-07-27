# HomePal Mobile — Implementation Walkthrough

We have successfully built and verified the **UI/Navigation entry flow** (Phase 1), the **backend API & Authentication architecture** (Phase 2), and the **Zod Validation & 4-Step Onboarding Wizard** (Phase 3) for HomePal Mobile.

---

## 🚀 Phase 3: Zod Validation & 4-Step Onboarding Wizard

### 1. Industry-Standard Zod Validation ([src/utils/validation.ts](file:///d:/CrossITI/GradProj/Home-Pal/src/utils/validation.ts))

- Configured Zod schemas across all authentication and onboarding inputs:
  - **`usernameSchema`**: Alphanumeric, underscores, dots, and hyphens (`^[a-zA-Z0-9._-]+$`), min 3, max 30 chars.
  - **`emailSchema`**: RFC email address format verification.
  - **`passwordSchema`**: Min 8 chars requiring at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character.
  - **`registerFormSchema`**: Combines account fields with matching `confirmPassword` validation and literal `terms: true` requirement.
  - **Onboarding Schemas**: Dedicated validation for personal profile (`onboardingStep1Schema`), location (`onboardingStep2Schema`), household size/budget (`onboardingStep3Schema`), and dietary preferences (`onboardingStep4Schema`).

### 2. Deferred Registration & State Management ([src/store/slices/authSlice.ts](file:///d:/CrossITI/GradProj/Home-Pal/src/store/slices/authSlice.ts))

- Added `tempRegistration: Partial<RegisterRequest> | null` and `onboardingData: Record<string, any> | null` to Redux auth state.
- Refactored `RegisterScreen.tsx`: Upon filling account credentials and tapping **"Continue"**, data is validated via Zod and saved to Redux `tempRegistration` without submitting to the API. The user is transitioned cleanly into the onboarding wizard.

### 3. Interactive DatePicker Calendar Widget ([src/components/ui/date-picker.tsx](file:///d:/CrossITI/GradProj/Home-Pal/src/components/ui/date-picker.tsx))

- Built a custom Cairo-font interactive Date Picker component to eliminate text entry for dates.
- Features:
  - Clean input field displaying formatted date `YYYY-MM-DD` or placeholder with a calendar icon.
  - Modal overlay with quick toggle views between **Day Grid (Su–Sa)**, **Month Selector (Jan–Dec)**, and **Year Grid (from 1950 to 2013)**.
  - Guarantees valid date strings matching backend age validation rules without heavy native dependency rebuilds.

### 4. 4-Step Onboarding Wizard UI ([app/(onboarding)](<file:///d:/CrossITI/GradProj/Home-Pal/app/(onboarding)/_layout.tsx>))

- **Step 1 — Personal Profile ([app/(onboarding)/step1.tsx](<file:///d:/CrossITI/GradProj/Home-Pal/app/(onboarding)/step1.tsx>))**: Collects required backend profile fields (`gender` via interactive cards and `birthDate` via the interactive `DatePicker` widget). Progress: 25%.
- **Step 2 — Location & Region ([app/(onboarding)/step2.tsx](<file:///d:/CrossITI/GradProj/Home-Pal/app/(onboarding)/step2.tsx>))**: Collects required backend location fields (`governorate` via popular selectable pills/custom text field and `city`). Progress: 50%.
- **Step 3 — Household Setup ([app/(onboarding)/step3.tsx](<file:///d:/CrossITI/GradProj/Home-Pal/app/(onboarding)/step3.tsx>))**: Matches Figma Node `2017:117`. Collects member count via interactive number tiles (`1`–`5+`) and monthly grocery budget chips or custom exact amount. Progress: 75%.
- **Step 4 — Dietary & AI Profile ([app/(onboarding)/step4.tsx](<file:///d:/CrossITI/GradProj/Home-Pal/app/(onboarding)/step4.tsx>))**: Matches Figma Node `2017:232`. Collects lifestyle tags (e.g., Halal, High-protein, Keto) and allergy avoidance tags (e.g., Peanuts, Gluten) along with an AI personalization textarea. Progress: 100%.
- **Final Dispatch**: Tapping **"Finish & Create Account"** on Step 4 combines all 9 required backend fields (`fullName`, `username`, `email`, `password`, `confirmPassword`, `gender`, `birthDate`, `governorate`, `city`), dispatches `registerUser`, and displays an activation alert instructing the user to confirm their email before redirecting to `/login`.

### 5. NativeWind v4 Remount & Navigation Stability Fixes

- **Eliminated `Couldn't find a navigation context` Crash**: In NativeWind v4 (`react-native-css-interop`), dynamically switching between non-CSS variable states and CSS variable states (like `shadow-sm` or `/10` opacity modifiers) triggers a component upgrade warning in DEV mode that stringifies React props, causing an illegal read on Expo Router's `NavigationStateContext`. We replaced all dynamic opacity modifiers and shadows on selectable pills/tiles with solid semantic design tokens (`bg-brand-primary-container`, `bg-brand-error-container`, `bg-brand-primary`), completely preventing upgrade remounts and crashes.
- **Smooth Back-Navigation Transitions**: Fixed the 1-2 second black screen flash when navigating backward by updating Stack `screenOptions` in root, auth, and onboarding layouts with `contentStyle: { backgroundColor: '#FAF8F3' }` and changing `animation: 'slide_from_right'` to `animation: 'default'`.

---

## ⚡ Phase 2: API Integration & Authentication Architecture

### 1. Universal API Schema ([src/types/api.ts](file:///d:/CrossITI/GradProj/Home-Pal/src/types/api.ts))

- Implemented the universal backend response envelope `ApiResponse<T>` (`success`, `status`, `message`, `data`, `errors`).
- Fully typed `UserProfile`, `Gender` enum, `ProblemDetails`, and request/response payloads for all 12 OpenAPI endpoints.

### 2. Encrypted Token Storage ([src/services/storage/auth.storage.ts](file:///d:/CrossITI/GradProj/Home-Pal/src/services/storage/auth.storage.ts))

- Created an encrypted token storage service using `expo-secure-store` to persist JWT access tokens, refresh tokens, and serialized user profile data across app relaunches.

### 3. Axios HTTP Client & Interceptors ([src/services/api/client.ts](file:///d:/CrossITI/GradProj/Home-Pal/src/services/api/client.ts))

- Created an Axios instance configured for `https://homepal.runasp.net/` with automatic `Authorization: Bearer <token>` injection.
- **Envelope Unwrapping**: Automatically catches responses where `success === false` and formats them into clean `ApiError` objects.
- **Automatic 401 Refresh Engine**: Intercepts `401 Unauthorized` responses, pauses queued requests, silently refreshes tokens via `/api/Auth/refresh`, updates secure storage, and retries the original request without user interruption. If refresh fails, it dispatches an automatic global logout.

### 4. Auth API Service ([src/services/api/auth.service.ts](file:///d:/CrossITI/GradProj/Home-Pal/src/services/api/auth.service.ts))

- Mapped all 12 authentication endpoints (`register`, `login`, `loginWithGoogle`, `refreshToken`, `logout`, `forgotPassword`, `resetPassword`, `changePassword`, `confirmEmail`, `resendConfirmationEmail`, `getMe`, `updateProfile`) to clean, typed asynchronous functions.

### 5. Redux Toolkit Global State ([src/store/slices/authSlice.ts](file:///d:/CrossITI/GradProj/Home-Pal/src/store/slices/authSlice.ts) & [src/store/index.ts](file:///d:/CrossITI/GradProj/Home-Pal/src/store/index.ts))

- Built `authSlice` managing `{ user, token, isAuthenticated, isLoading, error, isBootstrapped }`.
- Configured async thunks for session bootstrapping, login, registration, and logout.

---

## 🎨 Phase 1: UI Components & Navigation

### 1. Typography & Layout ([app/_layout.tsx](file:///d:/CrossITI/GradProj/Home-Pal/app/_layout.tsx))

- Configured **Cairo Google Fonts** (`400Regular`, `500Medium`, `600SemiBold`, `700Bold`) and integrated `expo-splash-screen` to hold the splash until typography and Redux session bootstrap complete.

### 2. Reusable UI Components

- **TextField ([src/components/ui/text-field.tsx](file:///d:/CrossITI/GradProj/Home-Pal/src/components/ui/text-field.tsx))**: Themed input with Cairo typography, custom label, error state styling, and interactive password visibility toggle.
- **Checkbox ([src/components/ui/checkbox.tsx](file:///d:/CrossITI/GradProj/Home-Pal/src/components/ui/checkbox.tsx))**: Custom themed checkbox with rich label slot support.

### 3. Screen Routes

- **Splash ([app/index.tsx](file:///d:/CrossITI/GradProj/Home-Pal/app/index.tsx))**: Renders stylized HomePal logo mark and auto-redirects to `/welcome`.
- **Welcome ([src/features/onboarding/WelcomeScreen.tsx](file:///d:/CrossITI/GradProj/Home-Pal/src/features/onboarding/WelcomeScreen.tsx))**: Brand showcase with primary navigation CTAs.

---

## 🧪 Verification Results

### Automated Tests

- Ran `npx tsc --noEmit` across the workspace; compilation succeeded with **0 errors**.
