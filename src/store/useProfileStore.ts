import { create } from 'zustand';
import { Gender, UpdateProfileRequest } from '../types/api';
import { authService } from '../services/api/auth.service';
import { authStorage } from '../services/storage/auth.storage';
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
  governorateId: string | null;
  governorate: string;
  cityId: string | null;
  city: string;
  email: string;
  profileImageUri: string | null;
  family: string;
  roles: string[];
  hasHousehold: boolean;
  isManager: boolean;
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
  fullName: '',
  gender: null,
  birthDate: null,
  governorateId: null,
  governorate: '',
  cityId: null,
  city: '',
  email: '',
  profileImageUri: null,
  family: '',
  roles: [],
  hasHousehold: false,
  isManager: false,
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

    // Offline Hydration
    try {
      const cachedProfile = await authStorage.getUserProfile();
      if (cachedProfile) {
        console.log('[useProfileStore] Restoring profile from cache...');
        const roles = cachedProfile.roles || [];
        const isManager = roles.includes('Household Manager');
        const isMember = roles.includes('Household Member');
        const hasHousehold = isManager || isMember;

        let parsedGender: any = cachedProfile.gender;
        if (typeof parsedGender === 'string') {
          if (parsedGender === 'Male') parsedGender = Gender.Male;
          else if (parsedGender === 'Female') parsedGender = Gender.Female;
          else if (!isNaN(parseInt(parsedGender, 10))) parsedGender = parseInt(parsedGender, 10);
        }

        set({
          fullName: cachedProfile.fullName,
          gender: parsedGender,
          birthDate: cachedProfile.birthDate,
          governorateId: cachedProfile.governorateId || null,
          governorate: cachedProfile.governorate,
          cityId: cachedProfile.cityId || null,
          city: cachedProfile.city,
          email: cachedProfile.email || 'noura@example.com',
          profileImageUri: resolveProfileImageUri(cachedProfile),
          roles,
          hasHousehold,
          isManager,
        });
      }
    } catch (err) {
      console.warn('[useProfileStore] Failed to load offline profile', err);
    }

    try {
      const response = await authService.getMe();
      console.log('[useProfileStore] Profile fetch raw response:', response);
      if (response.success && response.data) {
        const data = response.data;
        // Save the latest profile back to cache
        await authStorage.setUserProfile(data);

        const roles = data.roles || [];
        const isManager = roles.includes('Household Manager');
        const isMember = roles.includes('Household Member');
        // We'll rely on useDashboard to verify actual household existence, but keep the claim if present.
        const hasHousehold = isManager || isMember;

        let parsedGender: any = data.gender;
        if (typeof parsedGender === 'string') {
          if (parsedGender === 'Male') parsedGender = Gender.Male;
          else if (parsedGender === 'Female') parsedGender = Gender.Female;
          else if (!isNaN(parseInt(parsedGender, 10))) parsedGender = parseInt(parsedGender, 10);
        }

        set({
          fullName: data.fullName,
          gender: parsedGender,
          birthDate: data.birthDate,
          governorateId: data.governorateId || null,
          governorate: data.governorate || '',
          cityId: data.cityId || null,
          city: data.city || '',
          email: data.email || 'noura@example.com',
          profileImageUri: resolveProfileImageUri(data),
          roles,
          hasHousehold,
          isManager,
          isLoading: false,
        });
        console.log('[useProfileStore] Profile fetched and store populated successfully.');
      } else {
        console.warn('[useProfileStore] Profile fetch success was false:', response.message);
        set({ error: response.message || 'Failed to fetch profile', isLoading: false });
      }
    } catch (err: any) {
      console.warn('[useProfileStore] Profile fetch threw error:', err);
      set({ error: err.message || 'Failed to fetch profile', isLoading: false });
    }
  },
  saveProfile: async (payload: UpdateProfileRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.updateProfile(payload);
      if (response.success && response.data) {
        const data = response.data;
        await authStorage.setUserProfile(data); // update cache
        set({
          fullName: data.fullName,
          gender: data.gender as any,
          birthDate: data.birthDate,
          governorateId: data.governorateId || null,
          governorate: data.governorate || '',
          cityId: data.cityId || null,
          city: data.city || '',
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
          // Optionally update cache, but we just updated the url
          const cached = await authStorage.getUserProfile();
          if (cached) {
            await authStorage.setUserProfile({ ...cached, profileImageUrl: newUrl });
          }
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
        const cached = await authStorage.getUserProfile();
        if (cached) {
          await authStorage.setUserProfile({ ...cached, profileImageUrl: null });
        }
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
