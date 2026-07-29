import { create } from 'zustand';
import { Gender } from '../types/api';

export interface ProfileState {
  fullName: string;
  gender: Gender | null;
  birthDate: string | null;
  governorate: string;
  city: string;
  email: string;
  profileImageUri: string | null;
  family: string;
  updateProfile: (profile: Partial<Omit<ProfileState, 'updateProfile'>>) => void;
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
  updateProfile: (updatedFields) =>
    set((state) => ({
      ...state,
      ...updatedFields,
    })),
}));
