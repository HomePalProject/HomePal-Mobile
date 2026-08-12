/**
 * Universal API Response Envelope matching HomePal API specifications.
 */
export interface ApiResponse<T = any> {
  success: boolean;
  status: string; // e.g., "Created", "OK", "Forbidden", "Unauthorized", "BadRequest"
  message: string;
  data: T | null;
  errors: Array<{ message?: string; [key: string]: any }> | null;
}

/**
 * Gender enumeration matching backend schema.
 */
export enum Gender {
  Male = 1,
  Female = 2,
}

/**
 * User Profile data returned from authentication and profile endpoints.
 */
export interface UserProfile {
  id: string;
  fullName: string;
  gender: Gender | null;
  username: string;
  email: string;
  birthDate: string | null;
  governorate: string;
  city: string;
  isActive?: boolean;
  isProfileComplete?: boolean;
  emailConfirmed?: boolean;
  createdAt?: string;
  lastLoginAt?: string | null;
  roles?: string[];
  profileImageUrl?: string | null;
  profileImage?: string | null;
}

/**
 * Auth Token & Session payload returned upon successful login / token refresh.
 */
export interface AuthResponseData {
  token?: string;
  refreshToken?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt?: string;
    refreshTokenExpiresAt?: string;
  };
  user?: UserProfile;
  [key: string]: any;
}

/**
 * ASP.NET Core ProblemDetails schema for error responses.
 */
export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | string | null;
  detail?: string | null;
  instance?: string | null;
  errors?: Record<string, string[]>;
  [key: string]: any;
}

// --- Request Payload Interfaces ---

export interface RegisterRequest {
  fullName: string;
  gender?: Gender | null;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate?: string | null;
  governorate?: string;
  city?: string;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ConfirmEmailRequest {
  userId: string;
  token: string;
}

export interface ResendConfirmationEmailRequest {
  email: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  gender?: Gender | null;
  birthDate?: string | null;
  governorate: string;
  city: string;
}

// --- Household API Schemas ---

export interface CreateHouseholdRequest {
  name: string;
  address?: string | null;
  governorate?: string | null;
  city?: string | null;
}

export interface UpdateHouseholdRequest {
  name: string;
  address?: string | null;
  governorate?: string | null;
  city?: string | null;
}

export interface HouseholdDto {
  id: string;
  name: string;
  address?: string;
  governorate?: string;
  city?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface HouseholdInvitationResponse {
  id: string;
  householdId: string;
  householdName: string;
  invitedEmail?: string | null;
  invitedUserName?: string | null;
  invitedById: string;
  invitedByName: string;
  token: string;
  status: string;
  createdAt: string;
}

export interface SendInvitationRequest {
  invitedUserNameOrEmail: string;
}

export interface HouseholdMemberResponse {
  id: string;
  householdId: string;
  userId?: string | null;
  userName?: string | null;
  fullName: string;
  gender?: Gender | number | null;
  dateOfBirth?: string | null;
  role: string;
  isRegistered: boolean;
  joinedAt?: string;
  [key: string]: any;
}

export interface AddOfflineMemberRequest {
  fullName: string;
  gender: Gender | number;
  dateOfBirth?: string | null;
}

export interface UpdateMemberRequest {
  fullName: string;
  gender: Gender | number;
  dateOfBirth?: string | null;
  role?: string | null;
}

export interface PreferenceResponse {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface PreferenceCategoryResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface AssignPreferencesRequest {
  preferenceIds: string[];
}

// --- Pantry DTOs ---

export interface PantryItemResponse {
  id: string;
  pantryId: string;
  name: string;
  expireDate?: string | null;
  quantity: number;
  measuringUnitId: string;
  measuringUnitName?: string | null;
  measuringUnitSymbol?: string | null;
  categoryId: string;
  categoryName?: string | null;
  categoryImagePath?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreatePantryItemRequest {
  name: string;
  expireDate?: string | null;
  quantity?: number;
  measuringUnitId: string;
  categoryId: string;
}

export interface UpdatePantryItemRequest {
  name: string;
  expireDate?: string | null;
  quantity?: number;
  measuringUnitId: string;
  categoryId: string;
}

export interface PantryScanItemDto {
  name: string;
  quantity: number;
  measuringUnitId: string;
  measuringUnitName?: string | null;
  categoryId: string;
  categoryName?: string | null;
  suggestedExpireDate?: string | null;
}

export interface PantryScanResponse {
  items: PantryScanItemDto[];
}

// --- Product Categories DTOs ---

export interface ProductCategoryResponse {
  id: string;
  name: string;
  description?: string | null;
  imagePath?: string | null;
  createdAt: string;
}

// --- Measuring Units DTOs ---

export interface MeasuringUnitResponse {
  id: string;
  name: string;
  symbol?: string | null;
  createdAt: string;
}
