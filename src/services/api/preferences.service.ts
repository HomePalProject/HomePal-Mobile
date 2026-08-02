import { apiClient } from './client';
import {
  ApiResponse,
  PreferenceResponse,
  PreferenceCategoryResponse,
  AssignPreferencesRequest,
} from '@/src/types/api';

export const preferencesService = {
  /**
   * GET /api/preferences
   * Fetches all available preferences
   */
  async getAvailablePreferences(): Promise<PreferenceResponse[]> {
    try {
      const response = await apiClient.get<
        ApiResponse<PreferenceResponse[]> | PreferenceResponse[]
      >('/api/preferences');

      console.log('[preferencesService] getAvailablePreferences raw response:', response.data);

      if (
        response.data &&
        typeof response.data === 'object' &&
        'data' in response.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data;
      }

      if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.warn(
        '[preferencesService] Error fetching available preferences:',
        error?.message || error
      );
      return [];
    }
  },

  /**
   * GET /api/preferences/categories
   * Fetches all preference categories
   */
  async getPreferenceCategories(): Promise<PreferenceCategoryResponse[]> {
    try {
      const response = await apiClient.get<
        ApiResponse<PreferenceCategoryResponse[]> | PreferenceCategoryResponse[]
      >('/api/preferences/categories');

      console.log('[preferencesService] getPreferenceCategories raw response:', response.data);

      if (
        response.data &&
        typeof response.data === 'object' &&
        'data' in response.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data;
      }

      if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.warn(
        '[preferencesService] Error fetching preference categories:',
        error?.message || error
      );
      return [];
    }
  },

  /**
   * GET /api/households/members/{memberId}/preferences
   * Fetches the preferences assigned to a specific household member
   */
  async getMemberPreferences(memberId: string): Promise<PreferenceResponse[]> {
    try {
      const response = await apiClient.get<
        ApiResponse<PreferenceResponse[]> | PreferenceResponse[]
      >(`/api/households/members/${memberId}/preferences`);

      console.log('[preferencesService] getMemberPreferences raw response:', response.data);

      if (
        response.data &&
        typeof response.data === 'object' &&
        'data' in response.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data;
      }

      if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.warn(
        '[preferencesService] Error fetching member preferences:',
        error?.message || error
      );
      return [];
    }
  },

  /**
   * PUT /api/households/members/{memberId}/preferences
   * Assigns (replaces all) preferences for a specific household member
   */
  async assignMemberPreferences(
    memberId: string,
    payload: AssignPreferencesRequest
  ): Promise<PreferenceResponse[]> {
    const response = await apiClient.put<ApiResponse<PreferenceResponse[]> | PreferenceResponse[]>(
      `/api/households/members/${memberId}/preferences`,
      payload
    );

    console.log('[preferencesService] assignMemberPreferences raw response:', response.data);

    if (
      response.data &&
      typeof response.data === 'object' &&
      'data' in response.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  },
};
