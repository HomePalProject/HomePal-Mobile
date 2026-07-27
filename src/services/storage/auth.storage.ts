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

export const authStorage = {
  /**
   * Save access token and refresh token securely.
   */
  setTokens: async (token: string, refreshToken: string): Promise<void> => {
    try {
      const available = await isSecureStoreAvailable();
      if (available) {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
        if (refreshToken) {
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
        }
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        if (refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
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
      if (available) {
        return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      } else if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
      }
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
      if (available) {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      } else if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
      }
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
      } else if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_PROFILE_KEY);
      }
    } catch (error) {
      console.error('Error clearing auth tokens:', error);
    }
  },

  /**
   * Save user profile data for offline restoration.
   */
  setUserProfile: async (user: UserProfile): Promise<void> => {
    try {
      const serialized = JSON.stringify(user);
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
};
