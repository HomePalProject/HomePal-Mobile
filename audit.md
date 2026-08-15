# HomePal Mobile — Code Audit

Scope: bad practices, oversized components, RN/React conventions, theme & language toggle performance, persistence gaps, translation key parity, and RTL handling. Branch `feature/localization-rtl`.

Severity legend: **High** = user-visible bug or real perf/data-loss risk · **Medium** = real but limited-blast-radius issue · **Low** = polish/consistency nit.

> **Revision note.** This is a corrected second pass. The first pass contained four defects: two findings that were already fixed in the code, one false positive read from a commented-out block, and one recommendation that was backwards and would have deleted the wrong module. Those are kept inline as ~~struck~~ entries with the reason rather than silently removed, so the record stays auditable. Items resolved by work done since the first pass are marked **✅ Resolved**. **Section 2 (Persistence) was not re-verified** against the current tree — treat its line references as first-pass.

---

## 1. Theme & Language Toggle Performance

| Sev         | Location                                      | Issue                                                                                                                                                                                                                                                                                                                                                                                  | Fix                                                                                                                                                                                                                                                  |
| ----------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ Resolved | `src/providers/ThemeProvider.tsx:59,68-73`    | ~~`contextValue` and `handleSetMode` unmemoized, re-rendering every `useTheme()` consumer.~~ **Correction: already fixed when the audit was written.** `handleSetMode` is wrapped in `useCallback` (line 59) and `contextValue` in `useMemo` with the correct dep array (68-73).                                                                                                       | None needed.                                                                                                                                                                                                                                         |
| ✅ Resolved | `src/localization/hooks/useLanguage.ts:19,67` | ~~The hook exposes no in-flight loading state during the RTL reload.~~ **Correction: factually wrong.** `isReloading` is declared (line 19) and returned (line 67).                                                                                                                                                                                                                    | None needed.                                                                                                                                                                                                                                         |
| ✅ Resolved | `src/localization/`                           | Namespaces were lazy-loaded through a custom i18next backend, so `t()` returned raw keys until each namespace resolved — a visible flash of untranslated text on every first screen visit.                                                                                                                                                                                             | **Done.** Lazy loading removed; all locales bundled statically as `resources`. Total ~35 KB for both languages (~15 KB each, largest namespace ~3 KB) — far too small to justify deferring. Also added the missing `home` namespace to `NAMESPACES`. |
| Low         | `src/store/useDrawerStore.ts`                 | ~~Drawer state duplicated across zustand and Redux causing double-renders; keep zustand, drop the Redux copy.~~ **Correction: inverted, and would have broken the drawer.** `useDrawerStore` is imported **nowhere** — it exists only in its own file. `AppDrawer.tsx:45` reads from Redux (`useAppSelector((state) => state.ui.isDrawerOpen)`). No double-render, no competing state. | Delete `useDrawerStore.ts` as dead code. Severity drops Medium → Low.                                                                                                                                                                                |
| Low         | `src/providers/ThemeProvider.tsx:28-29,38-40` | `useRNColorScheme()` is subscribed unconditionally even when `mode` is explicitly `'light'`/`'dark'`, so an OS scheme flip re-renders the provider though `resolvedMode` doesn't change. Largely absorbed by the existing memoization.                                                                                                                                                 | Optional: short-circuit the OS-listener effect when `mode !== 'system'`.                                                                                                                                                                             |
| Low         | `src/providers/ThemeProvider.tsx:26,42-57`    | `mode` initializes to `'system'`, then is overwritten once `SecureStore.getItemAsync` resolves — brief flash from default to persisted theme on cold start.                                                                                                                                                                                                                            | Hydrate before first paint, same splash-gate pattern now used for i18n in `app/_layout.tsx:81-83`.                                                                                                                                                   |

---

## 2. Persistence Gaps

> Not re-verified in this pass. Line references are first-pass and may have drifted.

| Sev    | Location                                                                 | Issue                                                                                                                                                                                                                                                                                  | Fix                                                                                                                              |
| ------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| High   | `src/store/slices/authSlice.ts:14-15,179-187`                            | Multi-step onboarding progress (`tempRegistration`, `onboardingData`) lives only in Redux memory. If the app is killed mid-onboarding (memory pressure, crash), progress is silently lost with no recovery.                                                                            | Mirror to `SecureStore`/AsyncStorage on each `saveTempRegistration`/`saveOnboardingData`; clear on completion.                   |
| Medium | `src/store/useProfileStore.ts` vs `src/services/storage/auth.storage.ts` | `useProfileStore` has no persistence — profile refetches from network every cold start with no offline fallback. Meanwhile `authStorage.setUserProfile`/`getUserProfile` caches a profile on login that **nothing ever reads back** — dead writes plus a missed hydration opportunity. | Wire `authStorage.getUserProfile()` into bootstrap so a cached profile paints instantly, then is replaced by the network result. |
| Low    | `src/store/slices/{pantry,shoppingList,budget,mealPlans}Slice.ts`        | In-memory only, no draft persistence. In-progress form state is lost on background/kill.                                                                                                                                                                                               | Product call — persist drafts only if these forms hold meaningful in-progress state.                                             |
| Low    | `ThemeProvider.tsx`, `useLanguage.ts`                                    | Theme and language preferences stored in `SecureStore` rather than `AsyncStorage`. Not wrong, just slower than needed for non-confidential flags.                                                                                                                                      | Cosmetic.                                                                                                                        |
| Info   | `src/services/storage/auth.storage.ts`                                   | Auth tokens correctly persisted via `SecureStore`. No issue.                                                                                                                                                                                                                           | —                                                                                                                                |

---

## 3. Large Components

Line counts re-measured in this pass.

| Sev         | File                                                                                                                                        | Lines         | What to extract                                                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ Resolved | `src/features/home/components/HouseholdMembersList.tsx`                                                                                     | **829 → 116** | Refactored since the first pass: split into `AddOfflineMemberForm.tsx` and `MemberCard.tsx`, and the duplicate inline `CustomDatePicker` is gone.                 |
| Medium      | `src/features/pantry/screens/AddEditPantryItemScreen.tsx`                                                                                   | 440           | Form state, validation, and image/AI-scan handling in one file. Extract a `useAddEditPantryItemForm` hook (mirroring the existing `useHouseholdMembers` pattern). |
| Medium      | `src/components/navigation/AppDrawer.tsx`                                                                                                   | 407           | Menu config, active-route logic, and animation inlined together. Move static menu config to a data file, animation to a hook.                                     |
| Medium      | `src/features/profile/screens/EditProfileScreen.tsx`                                                                                        | 407           | Avatar upload logic mixed with form state and layout — extract `useProfileAvatar`.                                                                                |
| Medium      | `src/features/profile/screens/ProfileScreen.tsx`                                                                                            | 389           | Contains a large commented-out block (~lines 199-254) that should simply be deleted; that alone trims it meaningfully.                                            |
| Low         | `src/features/home/components/MemberCard.tsx`                                                                                               | ~300          | New file from the refactor; already borderline. Worth watching rather than acting on.                                                                             |
| Low         | `AddEditShoppingItemModal.tsx` (339), `PantryItemDetailsScreen.tsx`, `AddExpenseForm.tsx`, `PantryScreen.tsx`, `app/(onboarding)/step4.tsx` | ~280-340      | Data-fetching + local state + full JSX combined. Not urgent.                                                                                                      |

---

## 4. Bad Practices / RN Conventions

| Sev         | Location                                             | Issue                                                                                                                                                                                                                                                                                                                        | Fix                                                                                                              |
| ----------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| ✅ Resolved | `HouseholdMembersList.tsx`                           | ~~Add-member form shipped hardcoded defaults `useState('Hamada')` / `'Male'` / `'06/19/2003'`, so an untouched form submitted a fake member.~~ Verified gone from the entire repo in the refactor.                                                                                                                           | None needed.                                                                                                     |
| ✅ Resolved | `src/features/offers/screens/OffersScreen.tsx:74-79` | ~~`FlatList` `renderItem` was an inline arrow recreated every render.~~ Now hoisted into a `useCallback` with `[router]`.                                                                                                                                                                                                    | None — though the `item: any` annotation remains (see `any` row).                                                |
| ✅ Resolved | `HouseholdMembersList.tsx`                           | ~~Members rendered via `.map()` inside a `ScrollView`, losing virtualization.~~ Now uses `FlatList` (line 93).                                                                                                                                                                                                               | None needed.                                                                                                     |
| ✅ Resolved | `date-picker.tsx` vs `HouseholdMembersList.tsx`      | ~~Two divergent custom date-picker implementations.~~ The inline `CustomDatePicker` no longer exists; `src/components/ui/date-picker.tsx` is the single implementation.                                                                                                                                                      | None needed.                                                                                                     |
| High        | Repo-wide — **120 occurrences**                      | `console.log`/`error`/`warn` in shipped code, e.g. `EditProfileScreen.tsx:107,110,117`. Verified accurate: 120 hits excluding tests, none commented out. Leaks internal state and URIs to device logs.                                                                                                                       | Strip via `babel-plugin-transform-remove-console` in production, or route through a `__DEV__`-gated logger.      |
| High        | Repo-wide — **160 occurrences** (was 151)            | Liberal `any`, concentrated in the AI-scan path: `AddEditPantryItemScreen.tsx` (`scannedItems: any[]`), `PantryScreen.tsx`, `AIScanItemRow.tsx`, `OffersScreen.tsx` (`item: any`). A `ScannedItem` type already exists adjacent to several of these.                                                                         | Type the scan payload once as `ScannedItem[]` and reuse; type `OfferCard`'s item from the existing offers types. |
| Low         | `EditProfileScreen.tsx:117-119`                      | ~~Accesses `err.errors` without a guard and "throws a secondary error".~~ **Overstated:** reading a missing property returns `undefined` rather than throwing, and line 119 already guards with `if (err.errors && typeof err.errors === 'object')`. The only real nit is that line 117 logs `err.errors` before that check. | Cosmetic; normalize errors through a shared helper for consistency.                                              |

---

## 5. Translation Key Parity & Hardcoded Strings

### Key parity: clean

All namespaces diffed recursively between `en` and `ar`. No missing keys either direction, no empty values, no `"TODO"` placeholders, no untranslated copy-paste. The resource files are in good shape — the gap is entirely on the "did the component actually call `t()`" side.

### Corrections from the first pass

- ~~`ProfileScreen.tsx:249-251` — `ProfileListItem` titles `"Household Members"` / `"Grocery Budget"` / `"Dietary Preferences"` hardcoded.~~ **False positive.** These sit inside a commented-out JSX block (`ProfileScreen.tsx:245-254`). Not a live i18n gap — though the dead block is worth deleting (see §3).
- ✅ `HouseholdMembersList.tsx` — the ~18 hardcoded strings flagged in the first pass are gone with the refactor.
- ✅ `UnitSelectorSheet.tsx` — `"No units found"` now uses `t('noUnitsFound', …)`.

### Still outstanding — High

- `src/features/pantry/components/ImagePickerSheet.tsx` — `"Scan Receipt or Items"`, `"Take a Photo"`, `"Choose from Gallery"`, `"Cancel"`.
- `src/features/pantry/components/CategorySelectorSheet.tsx` — `"Select Category"`, `"Search categories..."`, `"No categories found"`.
- `src/features/pantry/components/ExpirationDatePickerModal.tsx` — `"Select Year"`, `"Select Month"`, `"Select Expiration Date"`, `"Back to Days View"`, plus the `MONTHS` / `DAYS_OF_WEEK` constants (English month and weekday names won't localize).
- `src/features/households/screens/InviteScreen.tsx`, `PendingInvitationsScreen.tsx` — `"Cancel"`, `"Send Invitation"`, `"Refresh"`, `"Accept"`, `"Decline"`, `"Check Again"`.
- `app/(households)/settings.tsx` — `"Address"`, `"City"`, `"Save Changes"`, `"Danger Zone"`.
- Other pantry components: `DeleteConfirmationModal`, `PantryFAB`, `PantryImagePicker`, `PantryErrorView`, `AIScanActionButtons`, `AISuggestionCard`, `PantryItemDetailsHeader`, `AIScanItemRow`.
- `AddEditPantryItemScreen.tsx` — placeholders `"Select"` / `"Select a category"`, `"Remove Item"`, and an untranslated `Alert.alert('Category Image', 'Linked to the selected category.')`.
- Budget: `BudgetSummaryCards` (`"Set Target"`), `AddExpenseForm`, `ExpensesLogList`, `SetTargetModal`.
- `app/(onboarding)/step1-3.tsx` — shared hardcoded `"Continue"` CTA.

### Still outstanding — Medium / Low

- `MealPlansPagination.tsx` (`"Previous"` / `"Next"`), `PantryItemDetailsScreen.tsx` (`"Quantity"`, `"Delete Item"`), `OfferCard.tsx` (`"No Image Available"`), `app/offers/[id].tsx` (`"Offer ID is missing"`).
- `"HomePal"` brand literal — fine as a proper noun; confirm intent.
- `src/features/test/TestTheme.tsx` — dev scratch screen, still present. Delete rather than translate.

**Recommendation:** tackle per feature folder. The pantry components are now the most saturated cluster.

---

## 6. RTL Handling

**The first pass's main recommendation has been implemented.** `src/components/ui/icon.tsx:11-18` now exposes a `directional` prop applying `scaleX(-1)` under `I18nManager.isRTL`, and it is adopted across the back-button and chevron call sites. All `ChevronLeft` / `ChevronRight` usages carry it, and no raw lucide directional icons are rendered outside the `Icon` wrapper.

### 🐞 New finding — High: double-flip cancels the mirror

`src/components/ui/back-button.tsx:28-34` applies the RTL flip **twice**:

```tsx
<View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
  <Icon as={ArrowLeft} directional … />
</View>
```

The outer `View` flips, and `directional` flips again. Nested transforms compose, so in Arabic the two `scaleX(-1)` cancel to `scaleX(1)` and the back arrow points **the same way as in LTR** — the exact bug `directional` was added to fix, in the app's shared back button.

**Fix:** remove the wrapping `View`'s transform and let `directional` do the work alone.

### Still outstanding — Medium

`app/(households)/meal-plan-details.tsx:91-130` hardcodes `textAlign: 'right'` (lines 91, 100, 108, 116, 121, 129, 130), `writingDirection: 'rtl'` (92), and `flexDirection: 'row-reverse'` (126) in the Markdown styles, assuming meal-plan content is always Arabic. English plans render right-aligned with reversed list bullets. Derive from `I18nManager.isRTL` / active `i18n.language` instead.

### Verified non-issues

- Spacing uses NativeWind logical utilities (`ms-` / `me-`); no stray `marginLeft` / `marginRight` / `paddingLeft` / `paddingRight` bugs.
- `ToastProvider.tsx` (`left: 16, right: 16`) and all `hitSlop` usages are symmetric.
- `ChevronDown` is direction-agnostic and correctly unmirrored.
- No asymmetric absolute positioning in headers, drawers, or modals.

---

## Priority Summary

**Fix first (High):**

1. **`back-button.tsx` double-flip** — the shared back arrow doesn't mirror in Arabic (§6).
2. **Onboarding progress not persisted** — silent data loss if the app is killed mid-flow (§2).
3. **Hardcoded English strings**, now concentrated in the pantry sheet components — breaks Arabic despite clean locale files (§5).
4. **120 `console.log` calls** shipping to production (§4).

**Fix next (Medium):** type the AI-scan `any`s; fix hardcoded RTL styles in meal-plan markdown; wire the cached profile into offline hydration; extract form hooks from `AddEditPantryItemScreen` / `EditProfileScreen`; delete the commented-out block in `ProfileScreen`.

**Backlog (Low):** delete dead `useDrawerStore.ts`; delete `TestTheme.tsx`; hydrate theme before first paint; move non-sensitive prefs off `SecureStore`; confirm intentional `"HomePal"` branding.

**Not covered:** §2 Persistence was not re-verified against the current tree. The bottom-sheet refactor completed alongside this audit is also still unverified on-device.
