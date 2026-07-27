import Constants from 'expo-constants';

/**
 * Centralized environment configuration.
 *
 * Values are read from app.json → expo.extra at build-time via expo-constants.
 * Falls back to sensible defaults for development.
 */
const extra = Constants.expoConfig?.extra ?? {};

export const env = {
  /** Base URL for the HomePal REST API */
  API_BASE_URL: (extra.apiBaseUrl as string) || 'https://homepal.runasp.net/',

  /** Google OAuth Web Client ID (used for Android native sign-in) */
  GOOGLE_WEB_CLIENT_ID:
    (extra.googleWebClientId as string) ||
    '815260218319-25gl1soin1gf2cavndjoqmtt501dkn1s.apps.googleusercontent.com',
} as const;
