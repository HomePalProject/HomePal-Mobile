import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { toast } from '@/src/providers/ToastProvider';

// export const GOOGLE_CLIENT_ID = '815260218319-v67vfp1rvf86c2c7lh6atsbhlcd7i3kr.apps.googleusercontent.com';
export const GOOGLE_CLIENT_ID =
  '815260218319-25gl1soin1gf2cavndjoqmtt501dkn1s.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
});

export async function performGoogleSignIn(): Promise<string | null> {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
    const idToken = (userInfo as any).data?.idToken || (userInfo as any).idToken;

    if (!idToken) {
      throw new Error('No Google ID token returned from device auth flow.');
    }
    return idToken;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // User cancelled login flow silently
      return null;
    } else if (error.code === statusCodes.IN_PROGRESS) {
      toast.info('Please wait', 'Google Sign-In is already in progress.');
      return null;
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      toast.error(
        'Google Auth Error',
        'Google Play Services is not available or outdated on this device.'
      );
      return null;
    } else {
      console.warn('Google Signin Error:', error);
      throw error;
    }
  }
}
