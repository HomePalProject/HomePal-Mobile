import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Gender, UpdateProfileRequest, UserProfile } from '@/src/types/api';
import { authService } from '@/src/services/api/auth.service';
import { env } from '@/src/config/env';
import { bootstrapAuth, loginUser, loginWithGoogle, logoutUser } from './authSlice';
import * as FileSystem from 'expo-file-system/legacy';

const resolveProfileImageUri = (data: any): string | null => {
  if (!data) return null;
  let rawUrl: any = null;
  if (typeof data === 'string') {
    rawUrl = data;
  } else if (typeof data === 'object') {
    rawUrl =
      data.profileImageUrl ||
      data.profileImage ||
      data.pictureUrl ||
      data.picture ||
      data.avatarUrl ||
      data.avatar;
  }
  if (!rawUrl) return null;
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
  roles: string[];
  hasHousehold: boolean;
  isManager: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  fullName: '',
  gender: null,
  birthDate: null,
  governorate: '',
  city: '',
  email: '',
  profileImageUri: null,
  family: '',
  roles: [],
  hasHousehold: false,
  isManager: false,
  isLoading: false,
  error: null,
};

const populateProfileState = (state: ProfileState, data: UserProfile) => {
  const roles = data.roles || [];
  const isManager = roles.includes('Household Manager') || roles.includes('HouseholdManager');
  const isMember = roles.includes('Household Member') || roles.includes('HouseholdMember');
  const hasHousehold = isManager || isMember;

  let parsedGender = data.gender;
  if (typeof parsedGender === 'string') {
    if (parsedGender === 'Male') parsedGender = Gender.Male;
    else if (parsedGender === 'Female') parsedGender = Gender.Female;
    else if (!isNaN(parseInt(parsedGender as string, 10)))
      parsedGender = parseInt(parsedGender as string, 10);
  }

  state.fullName = data.fullName || '';
  state.gender = parsedGender || null;
  state.birthDate = data.birthDate || null;
  state.governorate = data.governorate || '';
  state.city = data.city || '';
  state.email = data.email || '';
  state.profileImageUri = resolveProfileImageUri(data);
  state.roles = roles;
  state.isManager = isManager;
  state.hasHousehold = hasHousehold;
};

export const saveProfile = createAsyncThunk(
  'profile/save',
  async (payload: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(payload);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to update profile');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  'profile/uploadImage',
  async (uri: string, { rejectWithValue }) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) throw new Error('File does not exist');
      const response = await authService.uploadProfileImage(uri);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to upload image');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload image');
    }
  }
);

export const deleteProfileImage = createAsyncThunk(
  'profile/deleteImage',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.deleteProfileImage();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to delete image');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete image');
    }
  }
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileFields: (state, action: PayloadAction<Partial<ProfileState>>) => {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    // Populate profile on login or auth bootstrap
    builder.addCase(bootstrapAuth.fulfilled, (state, action) => {
      if (action.payload?.user) {
        populateProfileState(state, action.payload.user);
      }
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      if (action.payload?.user) {
        populateProfileState(state, action.payload.user);
      }
    });
    builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
      if (action.payload?.user) {
        populateProfileState(state, action.payload.user);
      }
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      return initialState;
    });

    // Save profile
    builder.addCase(saveProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(saveProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        populateProfileState(state, action.payload);
      }
    });
    builder.addCase(saveProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Upload image
    builder.addCase(uploadProfileImage.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(uploadProfileImage.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        populateProfileState(state, action.payload);
      }
    });
    builder.addCase(uploadProfileImage.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete image
    builder.addCase(deleteProfileImage.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteProfileImage.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        populateProfileState(state, action.payload);
      }
    });
    builder.addCase(deleteProfileImage.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { updateProfileFields } = profileSlice.actions;

export default profileSlice.reducer;
