import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAppSelector } from '@/src/store';

export function useProtectedRoute() {
  const { isAuthenticated, isBootstrapped } = useAppSelector((state) => state.auth);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isBootstrapped) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const isAtRoot = !segments[0];

    if (!isAuthenticated && !inAuthGroup && !inOnboardingGroup) {
      router.replace('/(auth)/welcome');
    } else if (isAuthenticated && (inAuthGroup || isAtRoot)) {
      router.replace('/(tabs)' as any);
    }
  }, [isAuthenticated, isBootstrapped, segments, router]);
}
