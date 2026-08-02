import { apiClient } from '@/src/services/api/client';
import { ApiResponse, HouseholdInvitationResponse, SendInvitationRequest } from '@/src/types/api';

export const invitationService = {
  /**
   * Fetch all pending received invitations for the currently authenticated user (Inbox).
   * GET /api/households/invitations/my-invitations
   */
  getMyInvitations: async (): Promise<HouseholdInvitationResponse[]> => {
    try {
      const response = await apiClient.get<
        ApiResponse<HouseholdInvitationResponse[]> | HouseholdInvitationResponse[]
      >('/api/households/invitations/my-invitations');

      console.log('[invitationService] getMyInvitations raw response:', response.data);

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
      if (error?.status === 404 || error?.statusCode === 404 || error?.response?.status === 404) {
        console.warn('[invitationService] My invitations 404, returning []');
        return [];
      }
      throw error;
    }
  },

  /**
   * Fetch all household sent invitations (Outbox).
   * GET /api/households/invitations
   */
  getSentInvitations: async (): Promise<HouseholdInvitationResponse[]> => {
    try {
      const response = await apiClient.get<
        ApiResponse<HouseholdInvitationResponse[]> | HouseholdInvitationResponse[]
      >('/api/households/invitations');

      console.log('[invitationService] getSentInvitations raw response:', response.data);

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
      if (error?.status === 404 || error?.statusCode === 404 || error?.response?.status === 404) {
        console.warn(
          '[invitationService] No household found (404), returning empty sent invitations []'
        );
        return [];
      }
      throw error;
    }
  },

  /**
   * Send a new household invitation by email or username.
   * POST /api/households/invitations
   */
  sendInvitation: async (
    payload: SendInvitationRequest
  ): Promise<ApiResponse<HouseholdInvitationResponse>> => {
    const response = await apiClient.post<ApiResponse<HouseholdInvitationResponse>>(
      '/api/households/invitations',
      payload
    );
    return response.data;
  },

  /**
   * Cancel an outbound household invitation.
   * POST /api/households/invitations/{id}/cancel
   */
  cancelInvitation: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>(
      `/api/households/invitations/${id}/cancel`,
      {}
    );
    return response.data;
  },

  /**
   * Accept a pending household invitation.
   * POST /api/households/invitations/{id}/accept
   */
  acceptInvitation: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>(
      `/api/households/invitations/${id}/accept`,
      {}
    );
    return response.data;
  },

  /**
   * Decline a pending household invitation.
   * POST /api/households/invitations/{id}/decline
   */
  declineInvitation: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>(
      `/api/households/invitations/${id}/decline`,
      {}
    );
    return response.data;
  },
};
