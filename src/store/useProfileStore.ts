import { create } from 'zustand';

export interface ProfileState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImageUri: string | null;
  family: string;
  updateProfile: (profile: Partial<Omit<ProfileState, 'updateProfile'>>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  firstName: 'Noura',
  lastName: 'Hassan',
  email: 'noura@example.com',
  phoneNumber: '+20 100 000 0000',
  profileImageUri: null,
  family: 'Hassan Family',
  updateProfile: (updatedFields) =>
    set((state) => ({
      ...state,
      ...updatedFields,
    })),
}));
