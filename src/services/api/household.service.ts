import { apiClient } from './client';
import {
  ApiResponse,
  CreateHouseholdRequest,
  UpdateHouseholdRequest,
  HouseholdDto,
} from '@/src/types/api';

export const householdService = {
  /**
   * GET /api/Households/my-household
   * Fetches the current user's household.
   * Returns HouseholdDto if found (200 OK), or null if user has no household (404 Not Found).
   */
  async getMyHousehold(): Promise<HouseholdDto | null> {
    try {
      const response = await apiClient.get<ApiResponse<HouseholdDto> | HouseholdDto>(
        '/api/Households/my-household'
      );

      const resData = response.data;
      if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
        return resData.data;
      }
      return resData as HouseholdDto;
    } catch (error: any) {
      const status = error?.response?.status || error?.status || error?.statusCode;
      if (status === 404 || status === '404') {
        console.log('[HouseholdService] User has no household (404 Not Found)');
        return null;
      }
      console.warn(
        '[HouseholdService] Handled error fetching my-household:',
        error?.message || error
      );
      return null;
    }
  },

  /**
   * POST /api/Households
   * Registers a new household for the user.
   */
  async createHousehold(payload: CreateHouseholdRequest): Promise<HouseholdDto> {
    const response = await apiClient.post<ApiResponse<HouseholdDto> | HouseholdDto>(
      '/api/Households',
      payload
    );

    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
      return resData.data;
    }
    return resData as HouseholdDto;
  },

  /**
   * PUT /api/Households
   * Updates current user's active household.
   */
  async updateHousehold(payload: UpdateHouseholdRequest): Promise<HouseholdDto> {
    const response = await apiClient.put<ApiResponse<HouseholdDto> | HouseholdDto>(
      '/api/Households',
      payload
    );

    console.log('[HouseholdService] updateHousehold raw response:', response.data);

    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
      return resData.data;
    }
    return resData as HouseholdDto;
  },

  /**
   * DELETE /api/Households
   * Deletes current user's active household.
   */
  async deleteHousehold(): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<any> | any>('/api/Households');
    console.log('[HouseholdService] deleteHousehold raw response:', response.data);
    return true;
  },
};
