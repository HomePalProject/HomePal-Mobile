import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAppSelector } from '@/src/store';

/**
 * Auth guard hook.
 *
 * Redirects users based on authentication state:
 * - Unauthenticated users trying to access protected routes → redirect to /(auth)/welcome
 * - Authenticated users on auth screens → redirect to /(tabs)
 *
 * Must be called inside the root layout after the Redux Provider.
 */
export function useProtectedRoute() {
  const { isAuthenticated, isBootstrapped } = useAppSelector((state) => state.auth);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect until bootstrap finishes
    if (!isBootstrapped) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!isAuthenticated && !inAuthGroup && !inOnboardingGroup) {
      // User is not signed in and not on an auth/onboarding screen → redirect to welcome
      router.replace('/(auth)/welcome');
    } else if (isAuthenticated && inAuthGroup) {
      // User is signed in but on an auth screen → redirect to main app
      router.replace('/(tabs)' as any);
    }
  }, [isAuthenticated, isBootstrapped, segments, router]);
}
