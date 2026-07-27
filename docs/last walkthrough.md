# 🚀 HomePal Enterprise Architecture & Master Developer Handoff Report

Welcome to the **HomePal** mobile application codebase! This document is the definitive, exhaustive engineering report detailing **every feature, architecture pattern, bug fix, validation rule, and UI/UX enhancement** implemented in this project to date. It is designed to allow any incoming developer to understand the exact state of the codebase and immediately begin building out remaining features.

---

## 🏗️ 1. Complete Project Architecture & Stack

HomePal is an enterprise-grade, AI-powered household grocery and meal planning application built with modern mobile engineering standards:

- **Core Framework**: React Native (Expo SDK 52, Android Bridgeless Mode Enabled)
- **Language**: TypeScript (100% strict type checking with `npx tsc --noEmit`)
- **Styling**: NativeWind (Tailwind CSS for React Native) with custom HSL color variables and dark mode support
- **State Management**: Redux Toolkit (`@reduxjs/toolkit` and `react-redux`)
- **Navigation**: Expo Router (File-based routing with layout wrappers and protected route guards)
- **Validation**: Zod (`yod`) schema validation with custom Unicode regexes and refinement rules
- **Animations & UX**: React Native Reanimated 3 (`react-native-reanimated`) and Expo Haptics (`expo-haptics`)

### Complete Directory & File Structure

```bash
d:/CrossITI/GradProj/Home-Pal/
├── app/                        # Expo Router File-Based Routing Root
│   ├── _layout.tsx             # Root Layout: Redux Provider, ToastProvider, and SessionBootstrapper
│   ├── (auth)/                 # Authentication Flow Group
│   │   ├── _layout.tsx         # Transparent slide layout for auth screens
│   │   ├── welcome.tsx         # Branded welcome screen with OAuth & Email options
│   │   ├── login.tsx           # Email/Username & Password sign-in screen
│   │   ├── register.tsx        # Multi-field user account registration screen
│   │   └── forgot-password.tsx # Password recovery flow
│   ├── (onboarding)/           # 4-Step Personalization Wizard Group
│   │   ├── _layout.tsx         # Wizard progress layout
│   │   ├── step1.tsx           # Step 1: Personal Profile (Gender & Birth Date)
│   │   ├── step2.tsx           # Step 2: Location & Region (Governorate & City)
│   │   ├── step3.tsx           # Step 3: Household Setup (Members & Grocery Budget)
│   │   └── step4.tsx           # Step 4: Dietary Preferences & AI Profile
│   └── (tabs)/                 # Main Application Bottom Navigation Group
│       ├── _layout.tsx         # Bottom tab bar configuration
│       ├── index.tsx           # Dashboard / Home summary screen
│       ├── pantry.tsx          # Smart Pantry inventory tracker (Figma Placeholder)
│       ├── meals.tsx           # AI Meal Planner & Recipe suggestions (Figma Placeholder)
│       ├── shop.tsx            # Smart Grocery Shopping List (Figma Placeholder)
│       └── profile.tsx         # User Profile data display and account logout
├── src/
│   ├── components/
│   │   ├── common/             # Reusable Global UI Components
│   │   │   ├── ErrorBanner.tsx # Animated Reanimated error alert box
│   │   │   ├── LoadingScreen.tsx # Branded activity spinner screen
│   │   │   └── index.ts        # Barrel export for common components
│   │   └── ui/                 # Atomic Design System UI Elements
│   │       ├── animated-pressable.tsx # Reanimated spring touch wrapper
│   │       ├── button.tsx      # Branded button with loading state & haptics
│   │       ├── text-field.tsx  # Accessible input field with error label
│   │       ├── text.tsx        # Cairo-themed typography wrapper
│   │       ├── icon.tsx        # Lucide icon wrapper
│   │       └── index.ts        # Barrel export for atomic UI components
│   ├── config/
│   │   └── env.ts              # Centralized environment variables & OAuth Client IDs
│   ├── features/               # Feature-sliced UI view modules
│   │   └── auth/               # Auth feature screens and sub-components
│   ├── hooks/
│   │   ├── useGoogleAuth.ts    # Shared Google OAuth authentication hook
│   │   ├── useProtectedRoute.ts# Redux-driven automatic route guard
│   │   └── index.ts            # Barrel export for hooks
│   ├── services/
│   │   ├── api/                # Axios instance with auth interceptors
│   │   └── storage/
│   │       ├── auth.storage.ts # Safe stringified Expo SecureStore wrapper
│   │       └── index.ts        # Barrel export for storage services
│   ├── store/
│   │   ├── slices/
│   │   │   └── authSlice.ts    # Redux slice for authentication and onboarding state
│   │   └── index.ts            # Redux store configuration & typed hooks
│   ├── types/
│   │   └── api.ts              # Global TypeScript interfaces & enums (Gender, User, etc.)
│   └── utils/
│       └── validation.ts       # Master Zod validation schemas for all forms
└── docs/                       # Architectural analysis and Figma design notes
```

---

## 🔐 2. Authentication, OAuth & Security Infrastructure

### 2.1 Centralized Environment & OAuth Configuration

- **Problem**: Google OAuth credentials and backend API URLs were scattered as hardcoded strings across multiple screens, causing developer maintenance bottlenecks.
- **Implementation**: Created `src/config/env.ts` which reads from Expo's `app.json` (`extra` field). It exposes typed constants (`API_BASE_URL`, `GOOGLE_WEB_CLIENT_ID`, `GOOGLE_IOS_CLIENT_ID`).

### 2.2 Shared Google OAuth Hook (`useGoogleAuth`)

- **Problem**: Google sign-in logic (40+ lines of `@react-native-google-signin/google-signin` initialization, token extraction, backend JWT exchange, and error handling) was duplicated in both `SignInScreen.tsx` and `RegisterScreen.tsx`.
- **Implementation**: Built `src/hooks/useGoogleAuth.ts`. Both login and register screens now simply call `const { handleGoogleSignIn, isGoogleLoading } = useGoogleAuth();`, ensuring consistent OAuth error reporting and type narrowing.

### 2.3 Bulletproof Token Persistence (`auth.storage.ts`)

- **Problem Resolved**: In React Native Android Bridgeless mode, the app crashed with:  
  `Error saving auth tokens: Error: Invalid value provided to SecureStore. Values must be strings; consider JSON-encoding your values`.  
  This occurred when Google OAuth or backend responses returned token payloads as raw JavaScript objects instead of strings.
- **Implementation**: Refactored `src/services/storage/auth.storage.ts` with helper functions `ensureString()` and `extractTokenString()`. Regardless of what data type the backend returns, the wrapper inspects, extracts, and serializes tokens into clean strings before calling `SecureStore.setItemAsync()`.

### 2.4 Automatic Protected Routing (`useProtectedRoute`)

- **Implementation**: In `src/hooks/useProtectedRoute.ts`, a layout hook continuously monitors Redux state (`isAuthenticated`, `isOnboarded`, `isBootstrapped`).
- **SessionBootstrapper**: On app startup in `app/_layout.tsx`, `SessionBootstrapper` verifies stored tokens. As soon as `isBootstrapped` becomes true, automatic routing executes:
  - Unauthenticated user ➔ Redirected to `/(auth)/welcome`
  - Authenticated user without dietary/location profile ➔ Redirected to `/(onboarding)/step1`
  - Fully onboarded user ➔ Redirected to `/(tabs)`

---

## 🛡️ 3. Exhaustive Zod Validation (`yod`) & Onboarding Polish

Every input across Registration and the 4-Step Onboarding Wizard is governed by strict Zod schemas in `src/utils/validation.ts`. We implemented custom Unicode regexes and refinement rules to handle real-world Egyptian user data cleanly.

### 3.1 Registration & Account Creation Guard (`registerFormSchema`)

- **Full Name**: Requires at least 2 characters AND includes `.refine((val) => (val.match(/\p{L}/gu) || []).length >= 2)`. This prevents users from registering with numeric-only or symbol names like `"12345"`.
- **Username**: Alphanumeric validation (`^[a-zA-Z0-9._-]+$`) between 3 and 30 characters.
- **Password**: Strict ASP.NET Core Identity standards (min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character).
- **Terms Agreement**: Enforces boolean `true` check before submission.

### 3.2 Step 1 — Personal Profile (`onboardingStep1Schema`)

- **Gender**: Native Zod enum validation (`Gender.Male`, `Gender.Female`).
- **Birth Date**: Enforces `YYYY-MM-DD` regex format and dynamically calculates age against current date, guaranteeing user age is strictly between **13 and 120 years old**.

### 3.3 Step 2 — Location & Region (`onboardingStep2Schema`)

- **Unicode Support**: Egyptian governorates and cities can be written in English or Arabic. We upgraded regexes to `/^[\p{L}\s.-]+$/u` and `/^[\p{L}0-9\s.,-]+$/u`.
- **Numeric-Only Bug Fix**: Previously, allowing digits in district names (like _"6th of October"_) allowed pure numeric submissions like `21445645`. We added `.refine((val) => (val.match(/\p{L}/gu) || []).length >= 2)`, ensuring every city, district, and governorate name contains **at least 2 alphabetical letters**.

### 3.4 Step 3 — Household Setup (`onboardingStep3Schema`)

- **Household Members**: Integer validation bounded strictly between **1 and 20 members**.
- **Grocery Budget Bug Fix**: Previously, selecting predefined chips like `"6,000–10,000 EGP"` caused numeric regex stripping (`[^0-9]`) to merge digits into `600010000` (600 million EGP), causing validation to fail.
- **Resolution**: Refined `monthlyBudget` so any predefined range chip (strings containing `–`, `-`, `Under`, or `+`) is recognized and approved immediately. Custom manual budgets typed into the text box are strictly validated to fall between **500 and 200,000 EGP**.

### 3.5 Step 4 — Dietary & AI Profile (`onboardingStep4Schema`)

- **Dietary Lifestyles**: Requires `.min(1)` so users select at least one lifestyle (e.g., _Halal_, _High-protein_, _Low-carb_).
- **AI Personalization Notes**: Text area bounded to a maximum of **500 characters** for kitchen AI prompt injection.

---

## ✨ 4. Physical UX ("Feel-in-Hand") & Design System Integrity

We transformed the user interface from standard static layouts into a premium, responsive experience:

### 4.1 Reanimated Spring Touch Physics (`AnimatedPressable`)

- **Implementation**: Created `src/components/ui/animated-pressable.tsx` using `react-native-reanimated`.
- **Behavior**: Instead of harsh opacity flashes on tap, elements use spring physics (`withSpring`) to smoothly scale down (`0.97x` for cards/buttons, `0.94x` for icons) and bounce back on release.
- **Deployment**: Replaced every static `<Pressable>` across all 4 onboarding screens, registration, login, and header back buttons with `<AnimatedPressable>`.

### 4.2 Tactile Haptic Feedback Engine (`expo-haptics`)

Wired physical device vibrations directly into user interaction events:

- **`Haptics.impactAsync(Light)`**: Tapping selectable chips (lifestyles, allergies, governorates, budget tiers) and back navigation arrows.
- **`Haptics.impactAsync(Medium)`**: Tapping primary action buttons ("Continue", "Next Step").
- **`Haptics.notificationAsync(Error)`**: Fired immediately whenever a Zod validation error occurs on form submission.
- **`Haptics.notificationAsync(Success)`**: Fired when account registration and profile generation succeed.

### 4.3 UI Layout & Resilience Polish

- **Dark Mode Layout Fixes**: Replaced hardcoded light background hex codes (`#FAF8F3`) in `app/(auth)/_layout.tsx` and `app/(onboarding)/_layout.tsx` with transparent layouts and slide animations, eliminating black screen flashes during navigation.
- **Keyboard Protection**: Wrapped all onboarding and auth forms in `<KeyboardAvoidingView behavior="padding">` with `keyboardShouldPersistTaps="handled"`, ensuring custom inputs and AI text areas are never covered by the virtual keyboard.
- **Animated Error Presentation**: Created `src/components/common/ErrorBanner.tsx`. Replaces static text messages with a Reanimated fade-in/out alert banner supporting both `message` and `error` props.
- **Loading State Presentation**: Built `src/components/common/LoadingScreen.tsx` with branded spinners, wired directly into submit buttons (`isLoading={isLoading}`) during asynchronous backend calls.

---

## 🗺️ 5. Step-by-Step Roadmap for Next Developer

All core infrastructure, authentication, onboarding, routing, validation, and design tokens are 100% complete and verified. The next developer should focus exclusively on feature implementation inside `app/(tabs)/`:

### Phase 1: Smart Pantry Tracker (`app/(tabs)/pantry.tsx`)

1. **Redux State**: Create `src/store/slices/pantrySlice.ts` with actions for `addItem`, `removeItem`, `updateQuantity`, and `setCategoryFilter`.
2. **UI Implementation**:
   - Use `<AnimatedPressable>` chips at the top for category filtering (_All_, _Produce_, _Dairy_, _Spices_, _Meat_).
   - Build a FlatList of pantry item cards displaying item name, quantity badge, and color-coded expiration countdown (_"Expires in 2 days"_ in red).
3. **Add Item Action**: Implement a bottom sheet modal (using `<TextField>` and `<Button>`) allowing users to add custom pantry items or scan barcodes.

### Phase 2: AI Meal Planner (`app/(tabs)/meals.tsx`)

1. **Backend Integration**: Create API service method in `src/services/api/` to call the recipe recommendation endpoint, passing the user's stored profile from Redux (`lifestyles`, `allergies`, `monthlyBudget`, `memberCount`).
2. **UI Implementation**:
   - Display horizontal scrolling recipe cards categorized by _Breakfast_, _Lunch_, _Dinner_, and _Quick Weekday Meals_.
   - Include badges on recipe cards showing match percentage (_"98% Match"_) and prep time (_"15 mins"_).
3. **Recipe Detail Modal**: When tapped, open a full-screen view showing ingredients, cooking steps, and a primary action button: _"Add Missing Ingredients to Grocery List"_.

### Phase 3: Budget-Aware Shopping List (`app/(tabs)/shop.tsx`)

1. **Redux State**: Create `src/store/slices/shopSlice.ts` to track grocery checklist items and their estimated EGP prices.
2. **UI Implementation**:
   - Display checkable grocery items with animated strikethrough text upon checking.
   - **Live Budget Progress Bar**: At the top of the screen, display a progress bar comparing `totalCartCost` against the user's `monthlyBudget` from onboarding. If total cost exceeds budget, turn the bar warning orange/red.

---

## 🛠️ 6. Verification & Engineering Rules

### Verification Commands

The codebase is clean and compiles without errors. Always run these commands before submitting PRs:

```bash
# 1. TypeScript Strict Verification (MUST return 0 errors)
npx tsc --noEmit

# 2. Start Expo Bundler (Clear cache if modifying env or app.json)
npx expo start -c

# 3. Run Android Build
npx expo run:android
```

### Critical Engineering Standards for Next Developer

1. **Never use raw `<Pressable>` or `<TouchableOpacity>`**: Always import and use `<AnimatedPressable>` from `@/src/components/ui` to maintain physical spring animations and haptic standards.
2. **Use Barrel Imports**: Keep imports clean by utilizing `@/src/components/ui`, `@/src/components/common`, `@/src/services/storage`, and `@/src/hooks`.
3. **Never Hardcode Hex Colors in Components**: Always use NativeWind semantic classes (`bg-surface-background`, `text-text-primary`, `bg-brand-primary`, `border-status-error`) defined in `global.css` so dark mode continues to function flawlessly.
4. **All Inputs Must Use Zod Schemas**: Any new form input (e.g., adding a pantry item) must be validated via a Zod schema in `src/utils/validation.ts` and trigger `Haptics.notificationAsync(Error)` on failure.
