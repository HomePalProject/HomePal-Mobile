import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { authStorage } from '@/src/services/storage/auth.storage';
import { ApiResponse, ProblemDetails } from '@/src/types/api';
import { env } from '@/src/config/env';

const BASE_URL = env.API_BASE_URL;

/**
 * Custom error structure thrown by apiClient when API returns failure envelope or HTTP error.
 */
export class ApiError extends Error {
  public status: string | number;
  public errors: Array<{ message?: string; [key: string]: any }> | Record<string, string[]> | null;
  public data: any;

  constructor(
    message: string,
    status: string | number = 'Error',
    errors: any = null,
    data: any = null
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.data = data;
  }
}

// Callback invoked when refresh token fails or 401 occurs without valid session
let onUnauthorizedCallback: (() => void) | null = null;

export const registerOnUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en-US',
  },
});

// Flag to prevent concurrent token refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Request Interceptor ---
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await authStorage.getAccessToken();
    console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`, {
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 15)}...` : 'None',
    });
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[HTTP Request Interceptor Error]', error);
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const resData = response.data as ApiResponse;
    console.log(
      `[HTTP Response Success] ${response.config.method?.toUpperCase()} ${response.config.url}`,
      {
        status: response.status,
        successEnvelope: resData?.success,
      }
    );

    // Handle universal API envelope where success === false
    if (resData && typeof resData.success === 'boolean' && !resData.success) {
      const errorMessage = resData.message || 'An error occurred while processing your request.';
      const status = resData.status || response.status;
      console.warn(
        `[HTTP Response Success Envelope Error] ${response.config.method?.toUpperCase()} ${response.config.url}`,
        {
          status,
          message: errorMessage,
        }
      );
      throw new ApiError(errorMessage, status, resData.errors, resData.data);
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    console.warn(
      `[HTTP Response Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      }
    );

    // 1. Handle 401 Unauthorized -> Attempt Token Refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/Auth/login') &&
      !originalRequest.url?.includes('/api/Auth/refresh')
    ) {
      console.log('[HTTP Auth] 401 Unauthorized detected. Attempting token refresh...');
      if (isRefreshing) {
        console.log('[HTTP Auth] Token refresh is already in progress, queuing request.');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await authStorage.getRefreshToken();
        console.log('[HTTP Auth] Stored refresh token details:', {
          hasRefreshToken: !!refreshToken,
          refreshTokenPreview: refreshToken ? `${refreshToken.substring(0, 15)}...` : 'None',
        });
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint directly using clean axios instance to bypass interceptors
        console.log('[HTTP Auth] Calling refresh token endpoint...');
        const refreshResponse = await axios.post<ApiResponse>(`${BASE_URL}api/Auth/refresh`, {
          refreshToken,
        });

        const refreshData = refreshResponse.data;
        // The backend might return an ApiResponse envelope or the raw tokens directly
        const newToken =
          refreshData?.data?.tokens?.accessToken ||
          refreshData?.data?.accessToken ||
          refreshData?.data?.token ||
          (refreshData as any)?.tokens?.accessToken ||
          (refreshData as any)?.accessToken ||
          (refreshData as any)?.token;

        const newRefreshToken =
          refreshData?.data?.tokens?.refreshToken ||
          refreshData?.data?.refreshToken ||
          (refreshData as any)?.tokens?.refreshToken ||
          (refreshData as any)?.refreshToken ||
          refreshToken;

        console.log('[HTTP Auth] Refresh token endpoint response:', {
          isSuccessExplicit: refreshData?.success,
          hasNewToken: !!newToken,
          responseKeys: Object.keys(refreshData || {}),
        });

        // Accept if we found a token and the success flag is NOT explicitly false
        if (refreshData && refreshData.success !== false && newToken) {
          await authStorage.setTokens(newToken, newRefreshToken);
          apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          processQueue(null, newToken);
          console.log('[HTTP Auth] Token refreshed successfully. Retrying original request.');
          return apiClient(originalRequest);
        } else {
          console.warn(
            '[HTTP Auth] Refresh token response missing token or marked as failure.',
            refreshData
          );
          throw new Error('Refresh token request rejected');
        }
      } catch (refreshError: any) {
        console.warn('[HTTP Auth] Token refresh failed:', refreshError.message || refreshError);
        processQueue(refreshError, null);
        await authStorage.clearTokens();
        if (onUnauthorizedCallback) {
          console.log('[HTTP Auth] Dispatching unauthorized/logout callback.');
          onUnauthorizedCallback();
        }
        return Promise.reject(new ApiError('Session expired. Please sign in again.', 401));
      } finally {
        isRefreshing = false;
      }
    }

    // 2. Format Error Response from Envelope or ProblemDetails
    if (error.response?.data) {
      const resData = error.response.data as ApiResponse | ProblemDetails;

      // Envelope error
      if ('success' in resData && typeof resData.success === 'boolean' && !resData.success) {
        const errorMessage = resData.message || error.message || 'Request failed';
        return Promise.reject(
          new ApiError(
            errorMessage,
            resData.status || error.response.status,
            resData.errors,
            resData.data
          )
        );
      }

      // ProblemDetails error
      if ('title' in resData || 'detail' in resData) {
        const problem = resData as ProblemDetails;
        const errorMessage = problem.detail || problem.title || error.message || 'Request failed';
        return Promise.reject(
          new ApiError(errorMessage, problem.status || error.response.status, problem.errors)
        );
      }
    }

    // Generic Axios / Network error
    const fallbackMsg =
      error.message === 'Network Error'
        ? 'Unable to connect to HomePal servers. Please check your internet connection.'
        : error.message || 'An unexpected error occurred.';

    return Promise.reject(new ApiError(fallbackMsg, error.response?.status || 'NetworkError'));
  }
);
