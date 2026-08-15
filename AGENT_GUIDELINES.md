# React Native & Project Strict Guidelines

## 1. State Management

- **ONLY** use Redux Toolkit for global state management.
- **DO NOT** introduce Zustand, Recoil, Context API (for global state), or any other state management libraries.

## 2. Styling & Theming (CRITICAL)

- **NO Hardcoded Colors:** Never use raw hex codes (e.g., `#000000`) or static color names.
- **Theme Context:** ALWAYS use the project's custom Theme Context (e.g., `useTheme()`) or global color variables for all styling. The app must support dynamic theming seamlessly.
- **Responsiveness:** Never use static pixel values for `width` or `height` (e.g., `width: 300`). Use flexbox (`flex: 1`), percentages (`100%`), or responsive layout utilities to ensure the UI scales perfectly across all modern screen sizes.

## 3. Execution Workflow

- **Plan First:** Before writing or refactoring any code, provide a step-by-step PLAN. Wait for the user's approval before executing the code.
- **Explain Changes:** Briefly explain _why_ you are making a specific architectural decision, avoiding redundant code.

## 4. Code Quality & Architecture

- **Modular UI Composition (CRITICAL):** Keep Screen files (e.g., `*Screen.tsx`) strictly as clean orchestrators. They should only handle state hooks and layout assembly (ideally under 100 lines). Extract all distinct UI sections (Headers, Lists, Skeletons, Empty/Error Views, Cards) into separate, dumb components inside the feature's `components/` folder, and re-export them via an `index.ts` file.
- Strictly adhere to the existing folder structure (`src/features/<feature_name>/{components, hooks, screens, services}`).
- **NO DYNAMIC TAILWIND CLASSES:** Never use dynamic template literals inside `className` (e.g., `className={\`bg-${color}\`}`). This causes fatal context errors in Expo Router. For conditional or dynamic styling, you MUST use standard static Tailwind classes, or apply dynamic colors strictly through inline `style={{ backgroundColor: dynamicColor }}`.

## 5. Network, State & Type Safety (CRITICAL)

- **API Calls & Axios:** ALWAYS use the project's centralized Axios instance (e.g., `import api from '@/src/services/api/axiosInstance'`) for all network requests. NEVER use raw `fetch` or create new local Axios clients.
- **RTK Async Thunks:** When building Redux Slices, ALWAYS use `createAsyncThunk` for asynchronous API calls. You MUST handle all three promise lifecycles (`pending`, `fulfilled`, `rejected`) in the `extraReducers`.
- **Strict Type Safety:** Refer strictly to the provided OpenAPI spec (`v1.json`) for data models. Create precise TypeScript Interfaces/Types for all Requests and Responses. ABSOLUTELY NO use of `any`.
