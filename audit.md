# HomePal Mobile — Code Audit

Scope: bad practices, oversized components, RN/React conventions, theme & language toggle performance, persistence gaps, translation key parity, and RTL handling. Findings are grounded in the current state of `app/**` and `src/**` (branch `feature/localization-rtl`).

Severity legend: **High** = user-visible bug or real perf/data-loss risk · **Medium** = real but limited-blast-radius issue · **Low** = polish/consistency nit.

---

## 1. Theme & Language Toggle Performance

| Sev    | Location                                                       | Issue                                                                                                                                                                                                                                                                                                        | Fix                                                                                                                                     |
| ------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| High   | `src/providers/ThemeProvider.tsx:68-73`                        | `contextValue` object (`{ theme, mode, resolvedMode, setMode }`) and `handleSetMode` are recreated every render, unmemoized. Since `ThemeProvider` wraps the whole app (`app/_layout.tsx:77`), **every** `useTheme()` consumer re-renders whenever the provider re-renders for any reason.                   | Wrap `contextValue` in `useMemo([currentTheme, mode, resolvedMode, handleSetMode])`; wrap `handleSetMode` in `useCallback`.             |
| High   | `src/localization/hooks/useLanguage.ts:44-58`                  | RTL-flipping language change calls `I18nManager.allowRTL/forceRTL` then forces a full JS reload (`DevSettings.reload()` / `Updates.reloadAsync()`) — required by RN, but the hook exposes no in-flight loading state, so callers must build their own spinner or risk a frozen-looking screen during reload. | Expose an `isReloading` flag from the hook so toggle UIs can show a spinner/disable the switch during the ~1-2s reload window.          |
| Medium | `src/store/useDrawerStore.ts` vs `src/store/slices/uiSlice.ts` | Drawer-open state is tracked in **two** independent stores (zustand `useDrawerStore` and Redux `uiSlice.isDrawerOpen`/`activeRoute`). Components subscribed to both double-render on toggle and the two can drift out of sync.                                                                               | Consolidate to one source of truth — keep the zustand store since `AppDrawer.tsx` already uses it; remove the Redux duplicate.          |
| Medium | `src/providers/ThemeProvider.tsx:28-29,38-40`                  | `useRNColorScheme()` is subscribed unconditionally even when `mode` is explicitly `'light'`/`'dark'` (not `'system'`), so every OS-level scheme flip re-renders `ThemeProvider` (and therefore the whole tree, per the High finding above) even though `resolvedMode` doesn't actually change.               | Once `contextValue` is memoized this mostly self-heals; consider also short-circuiting the OS-listener effect when `mode !== 'system'`. |
| Low    | `src/providers/ThemeProvider.tsx:26,42-57`                     | `mode` initializes to `'system'` synchronously, then is overwritten after `SecureStore.getItemAsync` resolves — causes a visible flash from default theme to persisted theme on cold start if the user had picked an explicit light/dark mode.                                                               | Hydrate `mode` before first paint (hold splash screen, same pattern already used for fonts/i18n bootstrap in `app/_layout.tsx`).        |
| Low    | `src/localization/locales/index.ts`                            | Namespace lazy-loading has no preloading for namespaces that are always used together (e.g. `common` + whatever the landing screen needs), so first visit to a new feature area pays a Metro-chunk fetch + parse synchronously, causing a brief untranslated-key flash.                                      | Preload frequently-paired namespaces at `initI18n()` time via `Promise.all`.                                                            |

---

## 2. Persistence Gaps

| Sev    | Location                                                                                | Issue                                                                                                                                                                                                                                                                                                                                 | Fix                                                                                                                                                                                                       |
| ------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High   | `src/store/slices/authSlice.ts:14-15,179-187`                                           | Multi-step onboarding progress (`tempRegistration`, `onboardingData`) lives only in Redux memory. If the app is killed/reclaimed mid-onboarding (OS memory pressure, incoming call, crash — all plausible on mobile), all progress is silently lost with no recovery.                                                                 | Mirror onboarding state to `SecureStore`/AsyncStorage on each `saveTempRegistration`/`saveOnboardingData` dispatch (or a `redux-persist` partial whitelist); clear on completion/`clearTempRegistration`. |
| Medium | `src/store/useProfileStore.ts:82-100` vs `src/services/storage/auth.storage.ts:196-214` | `useProfileStore` has no persistence — profile is refetched from network every cold start with no offline fallback. Meanwhile `authStorage.setUserProfile`/`getUserProfile` already caches a serialized profile in SecureStore on login **but nothing ever reads it back** — dead writes, and a missed offline-hydration opportunity. | Wire `authStorage.getUserProfile()` into store bootstrap/hydration so a cached profile shows instantly and is replaced once the network call resolves.                                                    |
| Low    | `src/store/slices/{pantry,shoppingList,budget,mealPlans}Slice.ts`                       | Pure in-memory Redux with no draft persistence. Any in-progress multi-field form (e.g. add-pantry-item, unsent shopping-list edits) is lost if the app backgrounds/is killed.                                                                                                                                                         | Product call — if these forms ever hold meaningful in-progress state, persist drafts; otherwise no action needed.                                                                                         |
| Low    | `src/providers/ThemeProvider.tsx:46,62`, `src/localization/hooks/useLanguage.ts:32,35`  | Theme mode and language choice — non-sensitive preference flags — are stored in `SecureStore` rather than plain `AsyncStorage`. Not wrong, just slower than necessary for non-confidential data.                                                                                                                                      | Cosmetic; move to `AsyncStorage` if startup latency ever matters.                                                                                                                                         |
| Info   | `src/services/storage/auth.storage.ts`                                                  | Auth tokens are correctly persisted via `SecureStore`, consistently, with appropriate encryption. No issue.                                                                                                                                                                                                                           | —                                                                                                                                                                                                         |

---

## 3. Large Components

| Sev    | File                                                                                                                                                                                    | Size       | What to extract                                                                                                                                                                                                                                                                                                                                    |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High   | `src/features/home/components/HouseholdMembersList.tsx`                                                                                                                                 | ~829 lines | Contains a full custom calendar (`CustomDatePicker`, ~280 lines — **duplicates** `src/components/ui/date-picker.tsx`), an add-member form, an edit-member row, and the list container, each with its own state cluster. Split into `AddMemberForm`, `EditMemberRow`, and reuse the existing shared date picker instead of a second implementation. |
| High   | `src/features/pantry/screens/AddEditPantryItemScreen.tsx` (456) / `src/features/shopping-list/components/AddEditShoppingItemModal.tsx` (398)                                            | —          | Form state, validation, image/AI-scan handling, and full JSX all in one file. Extract form logic into `useAddEditPantryItemForm` / `useAddEditShoppingItemForm` hooks (mirroring the existing `useHouseholdMembers` pattern).                                                                                                                      |
| High   | `src/features/profile/screens/EditProfileScreen.tsx` (433) / `ProfileScreen.tsx` (381)                                                                                                  | —          | Avatar upload logic mixed with form state and layout — extract a `useProfileAvatar` hook.                                                                                                                                                                                                                                                          |
| High   | `src/components/navigation/AppDrawer.tsx` (510)                                                                                                                                         | —          | Menu-item config, active-route logic, and gesture/animation code all inlined. Move static menu config to a data file; move animation logic to a hook.                                                                                                                                                                                              |
| Medium | `PantryItemDetailsScreen.tsx` (347), `AddExpenseForm.tsx` (328), `PantryScreen.tsx` (299), `app/(onboarding)/step4.tsx` (293), `OfferDetailsScreen.tsx` / `InviteScreen.tsx` (278 each) | —          | Data-fetching + multi-step local state + full JSX combined. Worth splitting headers/sections out; not urgent.                                                                                                                                                                                                                                      |

---

## 4. Bad Practices / RN Conventions

| Sev      | Location                                                                                       | Issue                                                                                                                                                                                                                                                               | Fix                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **High** | `src/features/home/components/HouseholdMembersList.tsx:330-332`                                | Add-member form ships with **hardcoded real-looking default values**: `useState('Hamada')`, `useState('Male')`, `useState('06/19/2003')`. Any user who doesn't manually clear the fields submits "Hamada" as a household member.                                    | Default to `''`/`undefined`; use the `TextInput` `placeholder` prop for guidance text instead.                            |
| High     | Repo-wide (120 occurrences)                                                                    | `console.log`/`console.error` left in shipped code, e.g. `EditProfileScreen.tsx:106,109,116` — leaks internal state/URIs to device logs, adds overhead.                                                                                                             | Strip via `babel-plugin-transform-remove-console` in production builds, or gate behind `__DEV__` through a shared logger. |
| High     | Repo-wide (151 occurrences)                                                                    | Liberal use of `any`, e.g. `AddEditPantryItemScreen.tsx:253` `(itemsList: any[])`, `PantryScreen.tsx:172` `(scannedItems: any[])`, `AIScanItemRow.tsx:20` `(val: any)` — mostly AI-scan-related and inconsistent, since a `ScannedItem` type already exists nearby. | Type the scan payload once (`ScannedItem[]`) and reuse everywhere instead of `any`.                                       |
| High     | `src/features/offers/screens/OffersScreen.tsx:77-79`                                           | `FlatList`'s `renderItem` is an inline arrow function recreated every render, defeating item-recycling and any future `React.memo` on `OfferCard`. Screen re-renders frequently due to filter state.                                                                | Hoist `renderItem` to a `useCallback` outside the JSX.                                                                    |
| Medium   | `src/features/home/components/HouseholdMembersList.tsx:810`                                    | Renders `members` via `.map()` inside a `ScrollView` instead of `FlatList` — loses virtualization; compounds with the heavy per-row edit-form logic in the same file.                                                                                               | Convert to `FlatList` once the row is extracted into its own component.                                                   |
| Medium   | `EditProfileScreen.tsx:116`                                                                    | Catches `err: any` and accesses `err.errors` without checking it exists — throws a secondary error for any non-Zod error shape.                                                                                                                                     | Normalize errors through a shared utility before branching on `.errors`.                                                  |
| Medium   | `src/components/ui/date-picker.tsx` vs inline `CustomDatePicker` in `HouseholdMembersList.tsx` | Two divergent custom date-picker implementations exist — double maintenance, inconsistent UX.                                                                                                                                                                       | Consolidate to the shared `date-picker.tsx` component.                                                                    |
| Low      | `HouseholdMembersList.tsx:410,570`                                                             | `['Male','Female'].map(...)` over a static array — fine as-is, checked for `key={index}` anti-pattern and found none repo-wide.                                                                                                                                     | No action.                                                                                                                |

---

## 5. Translation Key Parity & Hardcoded Strings

### Key parity: clean

All 11 namespaces (`auth, budget, common, home, households, meals, offers, onboarding, pantry, profile, shopping`) were diffed recursively between `en` and `ar`. **No missing keys either direction, no empty values, no `"TODO"` placeholders, no un-translated copy-paste values.** The JSON resource files themselves are in good shape — the problem is entirely on the "did every component actually call `t()`" side.

### Hardcoded strings — High (entire flows unlocalized)

- **`src/features/home/components/HouseholdMembersList.tsx`** — worst offender, ~18 hardcoded strings: `"Today"`, `"Close"`, `"Set Date"`, `"Full Name"`, `"Gender"`, `"Save Member"`, `"Manager"`, `"Member"`, `"Edit"`, `"Leave"`, `"Demote"`, `"Promote"`, `"Remove"`, `"Save Changes"`, `"Cancel"`, `"Enter full name"` (x2).
- `src/features/households/screens/InviteScreen.tsx:93,237,254` and `PendingInvitationsScreen.tsx:93,109,212,225` — `"Cancel"`, `"Send Invitation"`, `"Refresh"`, `"Accept"`, `"Decline"`, `"Check Again"`.
- `app/(households)/settings.tsx:122,162,188,204` — `"Address"`, `"City"`, `"Save Changes"`, `"Danger Zone"`.
- Pantry components: `ImagePickerSheet.tsx` (`"Take a Photo"`, `"Cancel"`), `DeleteConfirmationModal.tsx` (`"Cancel"`), `PantryFAB.tsx` (`"Add Item"`), `PantryImagePicker.tsx` (`"Scan Items"`), `PantryErrorView.tsx` (`"Try again"`), `AIScanActionButtons.tsx` (`"Cancel"`), `AISuggestionCard.tsx` (`"Add to List"`), `PantryItemDetailsHeader.tsx` (`"Item Detail"`), `UnitSelectorSheet.tsx` (`"No units found"`), `AIScanItemRow.tsx` placeholder `"Item Name"`.
- `AddEditPantryItemScreen.tsx` — placeholders `"Select"`, `"Select a category"`, button `"Remove Item"`, and a fully-untranslated native `Alert.alert('Category Image', 'Linked to the selected category.')` (line 318).
- Budget components: `BudgetSummaryCards.tsx` (`"Set Target"`), `AddExpenseForm.tsx` (`"Log Household Expense"`, `"Select Date"`), `ExpensesLogList.tsx` (`"Expenses Log"`), `SetTargetModal.tsx` (`"Save Target"`, `"Cancel"`).
- `app/(onboarding)/step1.tsx`, `step2.tsx`, `step3.tsx` — all share the same hardcoded `"Continue"` CTA.

### Hardcoded strings — Medium

- `ProfileScreen.tsx:249-251` — `ProfileListItem` titles (`"Household Members"`, `"Grocery Budget"`, `"Dietary Preferences"`) passed as raw strings.
- `MealPlansPagination.tsx` — `"Previous"` / `"Next"`.
- `PantryItemDetailsScreen.tsx` — `"Quantity"`, `"Delete Item"`.
- `OfferCard.tsx` — `"No Image Available"`.
- `app/offers/[id].tsx` — `"Offer ID is missing"` (user-visible error state).

### Hardcoded strings — Low

- `"HomePal"` literal in `RegisterScreen.tsx`, `SignInScreen.tsx`, `DashboardHeader.tsx`, `budget.tsx` — likely fine as a proper noun, confirm intent.
- `src/features/test/TestTheme.tsx` — dev scratch screen; delete rather than translate.

**Recommendation:** given the volume, treat this as a dedicated i18n cleanup pass per feature folder. Start with `HouseholdMembersList.tsx` and the households screens since they're the most saturated.

---

## 6. RTL Handling

**Foundation is correct.** `src/localization/config.ts` / `i18n.ts` / `hooks/useLanguage.ts` correctly call `I18nManager.allowRTL/forceRTL` and force a full reload on RTL change (required by RN — `forceRTL` only applies after reload). `src/components/ui/SvgIcon.tsx:5-10,110-114` already has a correct mirroring mechanism (`DIRECTIONAL_ICONS` set + `I18nManager.isRTL` + `scaleX(-1)`) — the issue is this pattern isn't applied everywhere. Most spacing already uses NativeWind logical utilities (`ms-`/`me-`), which are RTL-safe by design — no stray `marginLeft/marginRight/paddingLeft/paddingRight` bugs were found.

### Icons — biggest gap (~18 files)

Every `lucide-react-native` directional icon (`ArrowLeft`, `ArrowRight`, `ChevronLeft`, `ChevronRight`) is rendered as a plain unmirrored SVG glyph, unlike icons routed through `SvgIcon`. SVG glyphs don't auto-flip with `I18nManager` — only flexbox layout does.

- **Back buttons always render `ArrowLeft`** regardless of language: `app/(onboarding)/step1.tsx:70`, `step2.tsx:97`, `step3.tsx:86`, `step4.tsx:157`, `app/(households)/settings.tsx:48`, `family-management.tsx:46`, `meal-plan-details.tsx:50`, `app/(auth)/forgot-password.tsx:70`, `OfferDetailsScreen.tsx:90`, `PendingInvitationsScreen.tsx:147`, `MemberPreferencesScreen.tsx:35`, `CreateHouseholdScreen.tsx:109`, `InviteScreen.tsx:131`. In Arabic, "back" conventionally points toward the reading-start side (right) — these always point left.
- **Pagination/carousel chevrons don't flip**: `date-picker.tsx:164,185` (month prev/next), `MealPlansPagination.tsx:40,53` (page prev/next), `HouseholdMembersList.tsx:178,183` (member carousel).
- **`ArrowRight` "continue" button**: `CreateHouseholdScreen.tsx:242` — same one-directional problem.

**Fix:** extend `Icon` (`src/components/ui/icon.tsx`) with a `directional` prop that applies the same `scaleX(-1)` logic already proven in `SvgIcon.tsx:110-114`, and adopt it at every back-button/chevron/pagination call site above.

_Not a bug_: `ChevronDown` usages are direction-agnostic and correctly left unmirrored.

### Directional Styles

- `app/(households)/meal-plan-details.tsx:91,100,108,116,121,129-130` — Markdown styles hardcode `textAlign: 'right'`, `writingDirection: 'rtl'`, and `list_item` hardcodes `flexDirection: 'row-reverse'`, assuming meal-plan content is always Arabic. If a plan is ever displayed in English, body text is forced right-aligned/RTL and list bullets render reversed. **Fix:** derive from `I18nManager.isRTL` / active `i18n.language` instead of hardcoding.

### Positioning

- `ToastProvider.tsx:151-152` (`left: 16, right: 16`) and all `hitSlop` usages checked (`AddExpenseForm.tsx:295`, `ShoppingListItemCard.tsx:53,125,131`, `ShoppingListHeader.tsx:30`, `PantryHeader.tsx:36`) are symmetric — **not bugs**.
- No other asymmetric absolute-positioning found in headers, drawers, or modals; they rely on auto-flipping flexbox layout.

---

## Priority Summary

**Fix first (High, user-visible or data-loss risk):**

1. Hardcoded `'Hamada'` default in the add-member form (`HouseholdMembersList.tsx:330-332`) — ships a fake name into real data.
2. `ThemeProvider` unmemoized context value — re-renders the entire app tree on every theme/provider change.
3. Onboarding progress not persisted — silent data loss on app kill mid-flow.
4. Directional icons (back buttons, chevrons) don't mirror in RTL — visually broken/confusing in Arabic.
5. Widespread hardcoded English strings in households/pantry/budget screens — breaks the Arabic experience despite clean underlying locale files.

**Fix next (Medium):** consolidate duplicate drawer-open state and duplicate date-picker implementations; wire cached profile into offline hydration; fix hardcoded RTL styles in meal-plan markdown rendering; type the AI-scan `any`s; memoize `FlatList` `renderItem` in `OffersScreen`.

**Backlog (Low):** preload paired i18n namespaces; move non-sensitive prefs off `SecureStore`; delete `TestTheme.tsx`; confirm intentional untranslated `"HomePal"` branding.
