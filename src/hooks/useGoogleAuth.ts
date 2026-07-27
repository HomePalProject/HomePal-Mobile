import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { loginWithGoogle, clearError } from '@/src/store/slices/authSlice';
import { performGoogleSignIn } from '@/src/utils/googleAuth';
import { toast } from '@/src/providers/ToastProvider';
import * as Haptics from 'expo-haptics';

interface UseGoogleAuthOptions {
  /** Where to navigate on successful login (default: '/(tabs)') */
  redirectTo?: string;
  /** Custom success message */
  successMessage?: string;
}

/**
 * Shared hook for Google OAuth sign-in.
 * Eliminates the duplicated handleGoogleSignIn logic from SignInScreen and RegisterScreen.
 */
export function useGoogleAuth(options?: UseGoogleAuthOptions) {
  const {
    redirectTo = '/(tabs)',
    successMessage = 'You have signed in with Google successfully.',
  } = options ?? {};

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error: authError } = useAppSelector((state) => state.auth);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = useCallback(async () => {
    if (authError) dispatch(clearError());
    setIsGoogleLoading(true);

    try {
      const idToken = await performGoogleSignIn();
      if (!idToken) {
        setIsGoogleLoading(false);
        return;
      }
      // console.log(idToken,' id Token');

      await dispatch(loginWithGoogle({ idToken })).unwrap();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success('Welcome!', successMessage);
      router.replace(redirectTo as any);
    } catch (err: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      toast.error('Google Sign-In Notice', err.message || 'Could not authenticate with Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  }, [authError, dispatch, router, redirectTo, successMessage]);

  return { handleGoogleSignIn, isGoogleLoading };
}
