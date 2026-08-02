import { apiClient } from './client';
import {
  ApiResponse,
  HouseholdMemberResponse,
  AddOfflineMemberRequest,
  UpdateMemberRequest,
} from '@/src/types/api';

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

  /**
   * POST /api/households/members/offline
   * Adds an offline member to the active household.
   */
  async addOfflineMember(payload: AddOfflineMemberRequest): Promise<HouseholdMemberResponse> {
    const response = await apiClient.post<
      ApiResponse<HouseholdMemberResponse> | HouseholdMemberResponse
    >('/api/households/members/offline', payload);

    console.log('[memberService] addOfflineMember raw response:', response.data);

    if (
      response.data &&
      typeof response.data === 'object' &&
      'data' in response.data &&
      response.data.data
    ) {
      return response.data.data;
    }
    return response.data as HouseholdMemberResponse;
  },

  /**
   * PUT /api/households/members/{memberId}
   * Updates an existing household member's profile/role details.
   */
  async updateMember(
    memberId: string,
    payload: UpdateMemberRequest
  ): Promise<HouseholdMemberResponse> {
    const response = await apiClient.put<
      ApiResponse<HouseholdMemberResponse> | HouseholdMemberResponse
    >(`/api/households/members/${memberId}`, payload);

    console.log('[memberService] updateMember raw response:', response.data);

    if (
      response.data &&
      typeof response.data === 'object' &&
      'data' in response.data &&
      response.data.data
    ) {
      return response.data.data;
    }
    return response.data as HouseholdMemberResponse;
  },

  /**
   * DELETE /api/households/members/{memberId}
   * Removes or leaves a member from the active household.
   */
  async removeMember(memberId: string): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<any> | any>(
      `/api/households/members/${memberId}`
    );

    console.log('[memberService] removeMember raw response:', response.data);
    return true;
  },
};
