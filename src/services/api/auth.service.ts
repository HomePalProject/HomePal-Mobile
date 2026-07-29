import { apiClient } from '@/src/services/api/client';
import {
  ApiResponse,
  UserProfile,
  AuthResponseData,
  RegisterRequest,
  LoginRequest,
  GoogleLoginRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ConfirmEmailRequest,
  ResendConfirmationEmailRequest,
  UpdateProfileRequest,
} from '@/src/types/api';

export const authService = {
  /**
   * Register a new user account.
   */
  register: async (payload: RegisterRequest): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.post<ApiResponse<UserProfile>>('/api/Auth/register', payload);
    return response.data;
  },

  login: async (payload: LoginRequest): Promise<ApiResponse<AuthResponseData>> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>(
      '/api/Auth/login',
      payload
    );
    console.log('[authService] Raw login response data:', response.data);
    return response.data;
  },

  /**
   * Authenticate using Google ID Token.
   */
  loginWithGoogle: async (payload: GoogleLoginRequest): Promise<ApiResponse<AuthResponseData>> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>(
      '/api/Auth/google',
      payload
    );
    return response.data;
  },

  /**
   * Refresh JWT access token using a valid refresh token.
   */
  refreshToken: async (payload: RefreshTokenRequest): Promise<ApiResponse<AuthResponseData>> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>(
      '/api/Auth/refresh',
      payload
    );
    return response.data;
  },

  /**
   * Log out currently authenticated session.
   */
  logout: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/api/Auth/logout', {});
    return response.data;
  },

  /**
   * Request password reset instructions sent to user email.
   */
  forgotPassword: async (payload: ForgotPasswordRequest): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/api/Auth/forgot-password', payload);
    return response.data;
  },

  /**
   * Reset user password using token received via email.
   */
  resetPassword: async (payload: ResetPasswordRequest): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/api/Auth/reset-password', payload);
    return response.data;
  },

  /**
   * Change password for currently authenticated user.
   */
  changePassword: async (payload: ChangePasswordRequest): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/api/Auth/change-password', payload);
    return response.data;
  },

  /**
   * Confirm user email address using token.
   */
  confirmEmail: async (payload: ConfirmEmailRequest): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/api/Auth/confirm-email', payload);
    return response.data;
  },

  /**
   * Resend confirmation email to user.
   */
  resendConfirmationEmail: async (
    payload: ResendConfirmationEmailRequest
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>(
      '/api/Auth/resend-confirmation',
      payload
    );
    return response.data;
  },

  /**
   * Get current authenticated user's profile details.
   */
  getMe: async (): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/api/Auth/me');
    return response.data;
  },

  /**
   * Update authenticated user's profile details.
   */
  updateProfile: async (payload: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.put<ApiResponse<UserProfile>>('/api/Auth/profile', payload);
    return response.data;
  },
};
