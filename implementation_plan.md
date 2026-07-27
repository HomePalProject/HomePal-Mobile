# Zod Validation & 4-Step Onboarding Wizard — Implementation Plan

## Goal

Replace raw manual validation in `RegisterScreen.tsx` with **Zod**, standardizing rules across all fields (strong passwords, alphanumeric usernames, RFC email formatting). Furthermore, instead of submitting registration immediately upon filling the initial account screen, we will transition the user through a **4-Step Onboarding Wizard** (matching Figma designs for personal details, regional location, household size/budget, and dietary/AI preferences). Once Step 4 is completed, the app will dispatch the full registration payload to `/api/Auth/register`.

---

## User Review Required

> [!IMPORTANT]
> **New Dependency**: We will install `zod` for robust schema validation:
>
> ```bash
> npx expo install zod
> ```

> [!NOTE]
> **Deferred Registration Dispatch**:
> Previously, `RegisterScreen` called `dispatch(registerUser(...))` directly.
> In this new architecture:
>
> 1. `RegisterScreen` validates account credentials (`fullName`, `username`, `email`, `password`, `confirmPassword`, `terms`) via Zod.
> 2. Validated credentials are stored in Redux (or temporary session state) and the user is routed to `/onboarding/step1`.
> 3. The 4 onboarding screens collect the remaining required backend fields (`gender`, `birthDate`, `governorate`, `city`) along with HomePal household data (member count, monthly budget, lifestyle dietary preferences, allergies, AI notes).
> 4. Upon completing **Step 4**, clicking **"Finish & Create Account"** triggers `registerUser(...)` with all 9 backend required fields, saves household configuration, displays the email confirmation instructions alert, and routes to `/login`.

---

## Proposed Changes

### 1. Zod Validation Schemas

#### [NEW] [validation.ts](file:///d:/CrossITI/GradProj/Home-Pal/src/utils/validation.ts)

Create reusable, industry-standard Zod validation schemas:

- **`usernameSchema`**: Alphanumeric, underscores, dots, and hyphens (`^[a-zA-Z0-9._-]+$`), min 3, max 30 chars.
- **`emailSchema`**: Standard RFC email validation (`z.string().email()`).
- **`passwordSchema`**: Min 8 chars, requiring at least 1 lowercase, 1 uppercase, 1 digit, and 1 special character.
- **`registerFormSchema`**: Combines the above plus `confirmPassword` matching and `terms: z.literal(true)`.
- **`onboardingStep1Schema`**: Gender (`Gender.Male` | `Gender.Female`) and `birthDate` (valid date string in YYYY-MM-DD format, age >= 13).
- **`onboardingStep2Schema`**: `governorate` (min 2 chars) and `city` (min 2 chars).
- **`onboardingStep3Schema`**: Household member count (1 to 10+) and monthly grocery budget (selected chip or numeric custom amount).
- **`onboardingStep4Schema`**: Selected lifestyle tags, allergy tags, and optional AI notes.

---

### 2. State Management for Onboarding

#### [MODIFY] [authSlice.ts](file:///d:/CrossITI/GradProj/Home-Pal/src/store/slices/authSlice.ts)

- Add `tempRegistration: Partial<RegisterRequest> | null` to state.
- Add reducer `saveTempRegistration(state, action: PayloadAction<Partial<RegisterRequest>>)` to accumulate data across screens.
- Add reducer `clearTempRegistration(state)` to clean up after successful registration or abort.

---

### 3. Auth Screens Refactoring

#### [MODIFY] [RegisterScreen.tsx](file:///d:/CrossITI/GradProj/Home-Pal/src/features/auth/RegisterScreen.tsx)

- Replace raw manual `if (!email.includes('@'))` checks with `registerFormSchema.safeParse(...)`.
- Map Zod validation errors to input error props cleanly.
- On valid submit: call `dispatch(saveTempRegistration({ fullName, username, email, password, confirmPassword }))` and navigate to `/onboarding/step1`.
- Preserve the user's updated `import { SafeAreaView } from "react-native-safe-area-context"`.

#### [MODIFY] [SignInScreen.tsx](file:///d:/CrossITI/GradProj/Home-Pal/src/features/auth/SignInScreen.tsx)

- Upgrade email/username and password validation using Zod for consistency.

---

### 4. 4-Step Onboarding Wizard UI

#### [NEW] [app/(onboarding)/_layout.tsx](<file:///d:/CrossITI/GradProj/Home-Pal/app/(onboarding)/_layout.tsx>)

- Stack navigator for onboarding screens without default headers (`headerShown: false`).

#### [NEW] [app/(onboarding)/step1.tsx](<file:///d:/CrossITI/GradProj/Home-Pal/app/(onboarding)/step1.tsx>) — Personal Profile

- **Figma Alignment**: Collects user's personal identity required by backend (`gender` and `birthDate`).
- **UI**: Header with back arrow, step indicator ("Step 1 of 4"), progress bar (25% fill).
- **Fields**: Interactive Gender selection cards (Male / Female) + Birth Date picker/formatted input.
- **Action**: Validates with Zod, merges into `tempRegistration`, navigates to `/onboarding/step2`.

#### [NEW] [app/(onboarding)/step2.tsx](<file:///d:/CrossITI/GradProj/Home-Pal/app/(onboarding)/step2.tsx>) — Location & Region

- **Figma Alignment**: Collects user's location required by backend (`governorate` and `city`).
- **UI**: Step indicator ("Step 2 of 4"), progress bar (50% fill).
- **Fields**: Governorate dropdown/chip selector (e.g. Cairo, Giza, Alexandria, Dakahlia) + City text field or selector.
- **Action**: Validates with Zod, merges into `tempRegistration`, navigates to `/onboarding/step3`.

#### [NEW] [app/(onboarding)/step3.tsx](<file:///d:/CrossITI/GradProj/Home-Pal/app/(onboarding)/step3.tsx>) — Household Setup (Figma Node `2017:117`)

- **Figma Alignment**: Matches Figma Household setup screen.
- **UI**: Step indicator ("Step 3 of 4"), progress bar (75% fill).
- **Fields**:
  - "How many people are we planning for?" -> Interactive 60×56px counter tiles (`1`, `2`, `3`, `4`, `5+`).
  - "Monthly grocery budget" -> Interactive budget chips ("Under 3,000 EGP", "3,000–6,000", "6,000–10,000", "10,000+ EGP") + Custom exact amount input.
- **Action**: Saves household budget/size to local preferences, navigates to `/onboarding/step4`.

#### [NEW] [app/(onboarding)/step4.tsx](<file:///d:/CrossITI/GradProj/Home-Pal/app/(onboarding)/step4.tsx>) — Dietary & AI Profile (Figma Node `2017:232`)

- **Figma Alignment**: Matches Figma Member details & AI customization screen.
- **UI**: Step indicator ("Step 4 of 4"), progress bar (100% fill).
- **Fields**:
  - Lifestyle tag chips (Vegetarian, Vegan, Keto, Halal, Low-carb, High-protein, Gluten-free, etc.).
  - Allergy tag chips (Peanuts, Tree nuts, Gluten, Dairy, Shellfish, Eggs, Soy, etc.).
  - AI text area ("✨ Anything else? - AI personalized") with custom placeholder.
- **Action**:
  - Combines all accumulated registration data (`fullName`, `username`, `email`, `password`, `confirmPassword`, `gender`, `birthDate`, `governorate`, `city`).
  - Dispatches `dispatch(registerUser(fullPayload))`.
  - On API success, displays email confirmation alert and redirects to `/login`.

---

## Verification Plan

### Automated Tests

1. Verify TypeScript type checking across all Zod schemas, Redux slices, and onboarding screens:
   ```bash
   npx tsc --noEmit
   ```

### Manual Verification

1. Start development server: `npm run dev` or `npx expo start`.
2. **Zod Validation on Register**:
   - Enter invalid email (`test`) or weak password (`12345`); verify standard Zod error messages appear in red below inputs.
   - Enter matching valid credentials and check Terms; confirm tapping "Create account" transitions smoothly to Step 1 without making an API call yet.
3. **4-Step Onboarding Walkthrough**:
   - **Step 1**: Select Gender and enter Birth Date; verify progress bar shows 25%.
   - **Step 2**: Select Governorate and City; verify progress bar shows 50%.
   - **Step 3**: Select Household size tile (`3`) and budget chip (`3,000–6,000 EGP`); verify progress bar shows 75%.
   - **Step 4**: Toggle dietary tags (e.g. Halal, High-protein) and allergy tags (e.g. Peanuts); enter AI note; verify progress bar shows 100%.
4. **Final API Dispatch**:
   - Tap **"Finish & Create Account"** on Step 4; confirm button shows loading state while calling `/api/Auth/register`.
   - Verify success alert appears ("User registered successfully. Please check your email for confirmation instructions.") and routes back to Sign In.
