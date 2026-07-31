import { create } from 'zustand';
import { Gender, UpdateProfileRequest } from '../types/api';
import { authService } from '../services/api/auth.service';
import { env } from '../config/env';

/**
 * Defensive utility to resolve profile image URL from backend response.
 * Detects all common naming conventions and handles relative/absolute URLs.
 */
const resolveProfileImageUri = (data: any): string | null => {
  if (!data) return null;

  let rawUrl: any = null;
  if (typeof data === 'string') {
    rawUrl = data;
  } else if (typeof data === 'object') {
    rawUrl =
      data.profileImageUrl ||
      data.profileImage ||
      data.profilePictureUrl ||
      data.profilePicture ||
      data.imageUrl ||
      data.image ||
      data.pictureUrl ||
      data.picture ||
      data.avatarUrl ||
      data.avatar;
  }

  if (!rawUrl) return null;

  // If it's already a full absolute URL or local path, return as is
  if (
    typeof rawUrl === 'string' &&
    (rawUrl.startsWith('http://') ||
      rawUrl.startsWith('https://') ||
      rawUrl.startsWith('file://') ||
      rawUrl.startsWith('data:') ||
      rawUrl.startsWith('ph://'))
  ) {
    return rawUrl;
  }

  // Prepend base URL for relative paths
  const baseUrl = env.API_BASE_URL.endsWith('/') ? env.API_BASE_URL : `${env.API_BASE_URL}/`;
  const relativePath = rawUrl.startsWith('/') ? rawUrl.substring(1) : rawUrl;
  return `${baseUrl}${relativePath}`;
};

export interface ProfileState {
  fullName: string;
  gender: Gender | null;
  birthDate: string | null;
  governorate: string;
  city: string;
  email: string;
  profileImageUri: string | null;
  family: string;
  isLoading: boolean;
  error: string | null;
  updateProfile: (
    profile: Partial<
      Omit<
        ProfileState,
        | 'updateProfile'
        | 'fetchProfile'
        | 'saveProfile'
        | 'uploadProfileImage'
        | 'deleteProfileImage'
      >
    >
  ) => void;
  fetchProfile: () => Promise<void>;
  saveProfile: (payload: UpdateProfileRequest) => Promise<void>;
  uploadProfileImage: (uri: string) => Promise<void>;
  deleteProfileImage: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  fullName: 'Noura Hassan',
  gender: Gender.Female,
  birthDate: '1998-05-15',
  governorate: 'Cairo',
  city: 'Maadi',
  email: 'noura@example.com',
  profileImageUri: null,
  family: 'Hassan Family',
  isLoading: false,
  error: null,
  updateProfile: (updatedFields) =>
    set((state) => ({
      ...state,
      ...updatedFields,
    })),
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    console.log('[useProfileStore] Fetching profile from backend...');
    try {
      const response = await authService.getMe();
      console.log('[useProfileStore] Profile fetch raw response:', response);
      if (response.success && response.data) {
        const data = response.data;
        set({
          fullName: data.fullName,
          gender: data.gender,
          birthDate: data.birthDate,
          governorate: data.governorate,
          city: data.city,
          email: data.email || 'noura@example.com',
          profileImageUri: resolveProfileImageUri(data),
          isLoading: false,
        });
        console.log('[useProfileStore] Profile fetched and store populated successfully.');
      } else {
        console.warn('[useProfileStore] Profile fetch success was false:', response.message);
        set({ error: response.message || 'Failed to fetch profile', isLoading: false });
      }
    } catch (err: any) {
      console.error('[useProfileStore] Profile fetch threw error:', err);
      set({ error: err.message || 'Failed to fetch profile', isLoading: false });
    }
  },
  saveProfile: async (payload: UpdateProfileRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.updateProfile(payload);
      if (response.success && response.data) {
        const data = response.data;
        set({
          fullName: data.fullName,
          gender: data.gender,
          birthDate: data.birthDate,
          governorate: data.governorate,
          city: data.city,
          profileImageUri: resolveProfileImageUri(data),
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to update profile', isLoading: false });
      throw err;
    }
  },
  uploadProfileImage: async (uri: string) => {
    set({ isLoading: true, error: null });
    try {
      const state = useProfileStore.getState();
      const hasExisting = !!state.profileImageUri;
      console.log('[useProfileStore] Uploading image. Has existing image:', hasExisting);

      let response;
      if (hasExisting) {
        response = await authService.updateProfileImage(uri);
      } else {
        response = await authService.uploadProfileImage(uri);
      }

      console.log('[useProfileStore] Image upload response:', response);
      if (response.success) {
        const responseData = response.data;
        const newUrl = resolveProfileImageUri(responseData);
        if (newUrl) {
          set({ profileImageUri: newUrl, isLoading: false });
        } else {
          await state.fetchProfile();
        }
      } else {
        throw new Error(response.message || 'Failed to upload image');
      }
    } catch (err: any) {
      console.error('[useProfileStore] Image upload threw error:', err);
      set({ error: err.message || 'Failed to upload profile image', isLoading: false });
      throw err;
    }
  },
  deleteProfileImage: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('[useProfileStore] Deleting image...');
      const response = await authService.deleteProfileImage();
      console.log('[useProfileStore] Image delete response:', response);
      if (response.success) {
        set({ profileImageUri: null, isLoading: false });
      } else {
        throw new Error(response.message || 'Failed to delete image');
      }
    } catch (err: any) {
      console.error('[useProfileStore] Image delete threw error:', err);
      set({ error: err.message || 'Failed to delete profile image', isLoading: false });
      throw err;
    }
  },
}));
