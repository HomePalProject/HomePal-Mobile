import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { UserProfile } from '@/src/types/api';

const ACCESS_TOKEN_KEY = 'homepal_access_token';
const REFRESH_TOKEN_KEY = 'homepal_refresh_token';
const USER_PROFILE_KEY = 'homepal_user_profile';

const isSecureStoreAvailable = async (): Promise<boolean> => {
  if (Platform.OS === 'web') return false;
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
};

/**
 * Safely converts or extracts a token string from any provided value.
 * Prevents "Invalid value provided to SecureStore" errors when backend returns objects.
 */
const ensureString = (val: any): string | null => {
  if (val === null || val === undefined) return null;
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    if (typeof val.token === 'string') return val.token;
    if (typeof val.tokenString === 'string') return val.tokenString;
    if (typeof val.accessToken === 'string') return val.accessToken;
    if (typeof val.refreshToken === 'string') return val.refreshToken;
    try {
      return JSON.stringify(val);
    } catch {
      return null;
    }
  }
  return String(val);
};

/**
 * Safely extracts raw JWT string if stored value was serialized as a JSON object.
 */
const extractTokenString = (val: string | null): string | null => {
  if (!val) return null;
  if (val.startsWith('{') && val.endsWith('}')) {
    try {
      const obj = JSON.parse(val);
      if (typeof obj.token === 'string') return obj.token;
      if (typeof obj.tokenString === 'string') return obj.tokenString;
      if (typeof obj.accessToken === 'string') return obj.accessToken;
      if (typeof obj.refreshToken === 'string') return obj.refreshToken;
    } catch {
      // ignore parse error if it's not a JSON token object
    }
  }
  return val;
};

export const authStorage = {
  /**
   * Save access token and refresh token securely.
   */
  setTokens: async (token: any, refreshToken?: any): Promise<void> => {
    console.log('[authStorage] setTokens called with:', {
      tokenType: typeof token,
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
    });
    try {
      const tokenStr = ensureString(token);
      const refreshTokenStr = ensureString(refreshToken);
      console.log('[authStorage] setTokens processed strings:', {
        tokenStrLength: tokenStr?.length,
        refreshTokenStrLength: refreshTokenStr?.length,
        tokenStrPreview: tokenStr ? `${tokenStr.substring(0, 15)}...` : 'None',
      });

      const available = await isSecureStoreAvailable();
      console.log('[authStorage] setTokens storage availability:', { available });
      if (available) {
        if (tokenStr) {
          await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokenStr);
          console.log('[authStorage] Saved access token to SecureStore');
        }
        if (refreshTokenStr) {
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshTokenStr);
          console.log('[authStorage] Saved refresh token to SecureStore');
        }
      } else if (typeof localStorage !== 'undefined') {
        if (tokenStr) {
          localStorage.setItem(ACCESS_TOKEN_KEY, tokenStr);
          console.log('[authStorage] Saved access token to localStorage');
        }
        if (refreshTokenStr) {
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshTokenStr);
          console.log('[authStorage] Saved refresh token to localStorage');
        }
      } else {
        console.warn('[authStorage] No storage mechanism available to save tokens!');
      }
    } catch (error) {
      console.error('Error saving auth tokens:', error);
    }
  },

  /**
   * Retrieve stored access token.
   */
  getAccessToken: async (): Promise<string | null> => {
    try {
      const available = await isSecureStoreAvailable();
      let token: string | null = null;
      if (available) {
        token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      } else if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem(ACCESS_TOKEN_KEY);
      }
      const finalToken = extractTokenString(token);
      console.log('[authStorage] getAccessToken retrieved:', {
        hasToken: !!finalToken,
        tokenLength: finalToken?.length,
        rawLength: token?.length,
        tokenPreview: finalToken ? `${finalToken.substring(0, 15)}...` : 'None',
      });
      return finalToken;
    } catch (error) {
      console.error('Error getting access token:', error);
    }
    return null;
  },

  /**
   * Retrieve stored refresh token.
   */
  getRefreshToken: async (): Promise<string | null> => {
    try {
      const available = await isSecureStoreAvailable();
      let token: string | null = null;
      if (available) {
        token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      } else if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem(REFRESH_TOKEN_KEY);
      }
      const finalToken = extractTokenString(token);
      console.log('[authStorage] getRefreshToken retrieved:', {
        hasRefreshToken: !!finalToken,
        refreshTokenLength: finalToken?.length,
        rawLength: token?.length,
        refreshTokenPreview: finalToken ? `${finalToken.substring(0, 15)}...` : 'None',
      });
      return finalToken;
    } catch (error) {
      console.error('Error getting refresh token:', error);
    }
    return null;
  },

  /**
   * Clear all stored tokens and session data.
   */
  clearTokens: async (): Promise<void> => {
    try {
      const available = await isSecureStoreAvailable();
      if (available) {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_PROFILE_KEY);
        await SecureStore.deleteItemAsync('homepal_temp_reg');
        await SecureStore.deleteItemAsync('homepal_onboarding_data');
      } else if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_PROFILE_KEY);
        localStorage.removeItem('homepal_temp_reg');
        localStorage.removeItem('homepal_onboarding_data');
      }
    } catch (error) {
      console.error('Error clearing auth tokens:', error);
    }
  },

  /**
   * Save user profile data for offline restoration.
   */
  setUserProfile: async (user: any): Promise<void> => {
    try {
      if (!user) return;
      const serialized = typeof user === 'string' ? user : JSON.stringify(user);
      const available = await isSecureStoreAvailable();
      if (available) {
        await SecureStore.setItemAsync(USER_PROFILE_KEY, serialized);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(USER_PROFILE_KEY, serialized);
      }
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  },

  /**
   * Retrieve stored user profile data.
   */
  getUserProfile: async (): Promise<UserProfile | null> => {
    try {
      let serialized: string | null = null;
      const available = await isSecureStoreAvailable();
      if (available) {
        serialized = await SecureStore.getItemAsync(USER_PROFILE_KEY);
      } else if (typeof localStorage !== 'undefined') {
        serialized = localStorage.getItem(USER_PROFILE_KEY);
      }
      if (serialized) {
        return JSON.parse(serialized) as UserProfile;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
    }
    return null;
  },
  /**
   * Save temporary registration data (onboarding step 1 & 2).
   */
  setTempRegistration: async (data: any): Promise<void> => {
    try {
      const available = await isSecureStoreAvailable();
      if (available) {
        await SecureStore.setItemAsync('homepal_temp_reg', JSON.stringify(data));
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem('homepal_temp_reg', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error saving temp registration:', error);
    }
  },

  getTempRegistration: async (): Promise<any | null> => {
    try {
      const available = await isSecureStoreAvailable();
      let serialized: string | null = null;
      if (available) {
        serialized = await SecureStore.getItemAsync('homepal_temp_reg');
      } else if (typeof localStorage !== 'undefined') {
        serialized = localStorage.getItem('homepal_temp_reg');
      }
      if (serialized) return JSON.parse(serialized);
    } catch (error) {
      console.error('Error getting temp registration:', error);
    }
    return null;
  },

  /**
   * Save onboarding preferences (step 3 & 4).
   */
  setOnboardingData: async (data: any): Promise<void> => {
    try {
      const available = await isSecureStoreAvailable();
      if (available) {
        await SecureStore.setItemAsync('homepal_onboarding_data', JSON.stringify(data));
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem('homepal_onboarding_data', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  },

  getOnboardingData: async (): Promise<any | null> => {
    try {
      const available = await isSecureStoreAvailable();
      let serialized: string | null = null;
      if (available) {
        serialized = await SecureStore.getItemAsync('homepal_onboarding_data');
      } else if (typeof localStorage !== 'undefined') {
        serialized = localStorage.getItem('homepal_onboarding_data');
      }
      if (serialized) return JSON.parse(serialized);
    } catch (error) {
      console.error('Error getting onboarding data:', error);
    }
    return null;
  },
};
