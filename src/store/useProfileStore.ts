import { create } from 'zustand';
import { Gender, UpdateProfileRequest } from '../types/api';
import { authService } from '../services/api/auth.service';

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
    profile: Partial<Omit<ProfileState, 'updateProfile' | 'fetchProfile' | 'saveProfile'>>
  ) => void;
  fetchProfile: () => Promise<void>;
  saveProfile: (payload: UpdateProfileRequest) => Promise<void>;
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
}));
