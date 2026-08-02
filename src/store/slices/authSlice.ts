import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/src/services/api/auth.service';
import { authStorage } from '@/src/services/storage/auth.storage';
import { UserProfile, LoginRequest, RegisterRequest, GoogleLoginRequest } from '@/src/types/api';
import { ApiError } from '@/src/services/api/client';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isBootstrapped: boolean;
  error: string | null;
  tempRegistration: Partial<RegisterRequest> | null;
  onboardingData: Record<string, any> | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isBootstrapped: false,
  error: null,
  tempRegistration: null,
  onboardingData: null,
};

/**
 * Bootstrap auth session on app launch by reading secure token and verifying with backend.
 */
export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async (_, { rejectWithValue }) => {
  try {
    const token = await authStorage.getAccessToken();
    if (!token) {
      await authStorage.clearTokens();
      return null;
    }

    // Try fetching profile from backend to ensure token is valid
    const response = await authService.getMe();
    if (response.success && response.data) {
      await authStorage.setUserProfile(response.data);
      return { user: response.data, token };
    }

    // Invalid payload or expired session
    await authStorage.clearTokens();
    return null;
  } catch (error: any) {
    console.warn('[authSlice] bootstrapAuth failed/401, clearing tokens:', error?.message || error);
    await authStorage.clearTokens();
    return rejectWithValue(error?.message || 'Failed to restore session');
  }
});

/**
 * Authenticate user with credentials, save tokens securely, and populate user state.
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(payload);
      console.log('[authSlice] login raw response:', response);
      if (response.success && response.data) {
        const token = response.data.tokens?.accessToken || response.data.token;
        const refreshToken = response.data.tokens?.refreshToken || response.data.refreshToken;
        const user = response.data.user;
        await authStorage.setTokens(token, refreshToken);

        let userProfile = user;
        if (!userProfile) {
          const meRes = await authService.getMe();
          userProfile = meRes.data || undefined;
        }

        if (userProfile) {
          await authStorage.setUserProfile(userProfile);
        }

        return { user: userProfile || null, token: token || null };
      }
      return rejectWithValue(response.message || 'Login failed');
    } catch (error: any) {
      const msg = error instanceof ApiError ? error.message : error.message || 'Login failed';
      return rejectWithValue(msg);
    }
  }
);

/**
 * Authenticate with Google ID Token, save tokens securely, and populate user state.
 */
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (payload: GoogleLoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.loginWithGoogle(payload);
      if (response.success && response.data) {
        const token = response.data.tokens?.accessToken || response.data.token;
        const refreshToken = response.data.tokens?.refreshToken || response.data.refreshToken;
        const user = response.data.user;
        await authStorage.setTokens(token, refreshToken);

        let userProfile = user;
        if (!userProfile) {
          const meRes = await authService.getMe();
          userProfile = meRes.data || undefined;
        }

        if (userProfile) {
          await authStorage.setUserProfile(userProfile);
        }

        return { user: userProfile || null, token: token || null };
      }
      return rejectWithValue(response.message || 'Google Sign-In failed');
    } catch (error: any) {
      const msg =
        error instanceof ApiError ? error.message : error.message || 'Google Sign-In failed';
      return rejectWithValue(msg);
    }
  }
);

/**
 * Register a new user account.
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(payload);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Registration failed');
    } catch (error: any) {
      const msg =
        error instanceof ApiError ? error.message : error.message || 'Registration failed';
      return rejectWithValue(msg);
    }
  }
);

/**
 * Log out current session and clear secure storage.
 */
export const logoutUser = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    await authService.logout();
  } catch (e) {
    // Ignore server error during logout (e.g. if offline or already expired)
  } finally {
    await authStorage.clearTokens();
  }
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
    },
    forceLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.tempRegistration = null;
      state.onboardingData = null;
    },
    saveTempRegistration: (state, action: PayloadAction<Partial<RegisterRequest>>) => {
      state.tempRegistration = { ...state.tempRegistration, ...action.payload };
    },
    saveOnboardingData: (state, action: PayloadAction<Record<string, any>>) => {
      state.onboardingData = { ...state.onboardingData, ...action.payload };
    },
    clearTempRegistration: (state) => {
      state.tempRegistration = null;
      state.onboardingData = null;
    },
  },
  extraReducers: (builder) => {
    // Bootstrap
    builder.addCase(bootstrapAuth.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(bootstrapAuth.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isBootstrapped = true;
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }
    });
    builder.addCase(bootstrapAuth.rejected, (state) => {
      state.isLoading = false;
      state.isBootstrapped = true;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || 'Login failed';
      state.isAuthenticated = false;
    });

    // Login with Google
    builder.addCase(loginWithGoogle.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(loginWithGoogle.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || 'Google Sign-In failed';
      state.isAuthenticated = false;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
      state.tempRegistration = null;
      state.onboardingData = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || 'Registration failed';
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.tempRegistration = null;
      state.onboardingData = null;
    });
  },
});

export const {
  clearError,
  updateUser,
  forceLogout,
  saveTempRegistration,
  saveOnboardingData,
  clearTempRegistration,
} = authSlice.actions;
export default authSlice.reducer;
