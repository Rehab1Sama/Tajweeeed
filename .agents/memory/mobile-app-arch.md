---
name: Mobile app architecture
description: Expo mobile app structure, auth, and API integration details
---

## Structure
- app/_layout.tsx: ClerkProvider + ClerkLoaded wraps Stack; setBaseUrl from EXPO_PUBLIC_DOMAIN
- app/index.tsx: landing page (redirects to /(tabs) if signed in)
- app/sign-in.tsx + sign-up.tsx: Clerk Core v3 custom auth screens
- app/(tabs)/_layout.tsx: auth guard (Redirect if !isSignedIn), user sync via useSyncUser, setAuthTokenGetter
- app/(tabs)/index.tsx: student dashboard (useGetStudentDashboard + useGetDailyWird)
- app/(tabs)/lessons.tsx: lesson list grouped by level
- app/(tabs)/progress.tsx: tajweed rules with mastery tracking
- app/(tabs)/profile.tsx: user info + sign out
- app/lesson/[id].tsx: lesson detail screen

## Clerk Auth
- Core v3 API: signIn.password() / signIn.finalize() / signUp.password() / signUp.verifications.*
- tokenCache from @clerk/expo/token-cache (uses expo-secure-store)
- EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=$CLERK_PUBLISHABLE_KEY injected in dev script

## API Auth
- setAuthTokenGetter(() => getToken()) called in (tabs)/_layout.tsx useEffect
- setBaseUrl(`https://${process.env.EXPO_PUBLIC_DOMAIN}`) in root _layout.tsx
- useSyncUser() called on mount to provision user in local DB (idempotent upsert)

**Why:** setAuthTokenGetter must be set before any authenticated API calls; (tabs) layout is the right place since it runs before any tab screen renders.
