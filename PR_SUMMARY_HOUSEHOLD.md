# 🏡 Household Management & Invitations API Integration

## 📌 Overview

This PR completes the full end-to-end integration of the **Household Management**, **Invitations Inbox/Outbox**, and **Household Members CRUD** features for HomePal Mobile. All UI components have been wired to the backend API (`v1.json` specification) with strict TypeScript type safety, crash-free inline UI components, and smooth UX states.

---

## 🔥 Features Implemented

### 1. 🔐 Authentication & Session Recovery

- **Logout Payload Fix**: Updated `auth.service.ts` and `authSlice.ts` to retrieve the `refreshToken` from secure storage and send it in the request body for `POST /api/Auth/logout` per `v1.json` (`RefreshTokenRequest`).
- **Infinite Loading Fix**: Resolved stale token recovery issue during app refresh or crash recovery.
- **Drawer Logout Modal**: Replaced immediate sign-out with a confirmation modal matching the profile screen.

### 2. 🏠 Dashboard UI (State A vs. State B)

- **Flicker-Free Bootstrap**: Introduced `isFetchingHousehold` state in `useDashboard.ts` to prevent UI flashing State A before `getMyHousehold` responds.
- **State A (No Household)**: Displays the `OrphanStateView` with options to **Create Household** or **View Pending Invitations**.
- **State B (Active Household)**: Renders the active dashboard (`ActiveStateView`) displaying:
  - Primary Residence card with Household Name and Location.
  - Real-time stat cards: **Total Members**, **Sent Invitations**, and **Received Invitations**.
  - Household Members management section.

### 3. 🛠️ Household CRUD & Settings

- **Create Household**: Integrated `POST /api/Households` with validation, loading states, and automatic dashboard state transition.
- **Edit Household**: Built `app/(households)/settings.tsx` powered by `useHouseholdSettings.ts` connecting to `PUT /api/Households`.
- **Delete Household**: Integrated `DELETE /api/Households` with native `Alert.alert` confirmation. On deletion, user session state seamlessly reverts to State A (Orphan State).
- **Manager Permissions**: Gear Settings icon on the Primary Residence card is strictly rendered for Household Managers.

### 4. 📬 Sent & Received Invitations (Inbox / Outbox)

- **API Service (`invitation.service.ts`)**:
  - `GET /api/households/invitations/my-invitations` (Received Inbox)
  - `GET /api/households/invitations` (Sent Outbox)
  - `POST /api/households/invitations` (Send Invitation payload: `invitedUserNameOrEmail`)
  - `POST /api/households/invitations/{id}/accept` & `/decline`
  - `POST /api/households/invitations/{id}/cancel`
- **Graceful Error Handling**: Handled 404s gracefully without triggering Expo RedBox errors when a user has no sent or received invitations.
- **Empty State**: Added visually appealing empty states for both inbox and outbox views.

### 5. 👥 Household Members CRUD & Role Management

- **API Service (`member.service.ts`)**:
  - `GET /api/households/members`
  - `POST /api/households/members/offline`
  - `PUT /api/households/members/{memberId}`
  - `DELETE /api/households/members/{memberId}`
- **Offline Members**: Added support for adding offline household members with custom inline Date & Gender pickers.
- **Inline Card Editing**: Card morphs inline into an edit form pre-filled with member data (`fullName`, `gender`, `dateOfBirth`).
- **Promote / Demote Roles**: Members can be promoted to **Manager** or demoted back to **Member** (`PUT /api/households/members/{memberId}`).
- **Role Authority**: The user who created the household is automatically recognized and rendered as **Manager** by default.

---

## ⚡ Technical Highlights

1. **Crash-Free Inline Accordions**: Replaced portal-based pickers with inline NativeWind v4 accordions (`CustomDatePicker` & Gender selectors), eliminating React Navigation portal crashes.
2. **Fixed Navigation Context Errors**: Fortified `app/_layout.tsx` and `app/(households)/_layout.tsx` with explicit `<Stack.Screen>` declarations to ensure a stable `NavigationStateContext` across all route transitions.
3. **API Response Unwrapping**: Standardized envelope parsing (`response.data.data` vs. direct data) across all services (`household.service.ts`, `invitation.service.ts`, `member.service.ts`).
4. **TypeScript & Prettier Quality**: 100% strict type safety verified via `npx tsc --noEmit` and formatted with Prettier.

---

## 📁 Key Files Changed / Added

- `src/services/api/household.service.ts`
- `src/services/api/invitation.service.ts`
- `src/services/api/member.service.ts`
- `src/features/home/hooks/useDashboard.ts`
- `src/features/home/hooks/useActiveDashboard.ts`
- `src/features/households/hooks/useHouseholdMembers.ts`
- `src/features/households/hooks/useHouseholdSettings.ts`
- `src/features/households/hooks/useInviteMember.ts`
- `src/features/home/components/ActiveStateView.tsx`
- `src/features/home/components/HouseholdMembersList.tsx`
- `src/components/navigation/AppDrawer.tsx`
- `src/components/navigation/TabHeader.tsx`
- `app/(households)/settings.tsx`
- `app/(households)/_layout.tsx`
- `app/_layout.tsx`
