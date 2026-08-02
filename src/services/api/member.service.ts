import { apiClient } from './client';
import { ApiResponse, HouseholdMemberResponse } from '@/src/types/api';

export const memberService = {
  /**
   * GET /api/households/members
   * Fetches all members of the current user's active household.
   */
  async getHouseholdMembers(): Promise<HouseholdMemberResponse[]> {
    try {
      const response = await apiClient.get<
        ApiResponse<HouseholdMemberResponse[]> | HouseholdMemberResponse[]
      >('/api/households/members');

      console.log('[memberService] getHouseholdMembers raw response:', response.data);

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
      const status = error?.response?.status || error?.status || error?.statusCode;
      if (status === 404 || status === '404') {
        console.warn('[memberService] Household members 404 (no household), returning []');
        return [];
      }
      console.warn('[memberService] Error fetching household members:', error?.message || error);
      return [];
    }
  },
};
