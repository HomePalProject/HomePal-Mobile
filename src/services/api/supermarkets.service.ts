import { apiClient } from './client';
import { ApiResponse } from '@/src/types/api';
import { Supermarket, PaginatedList } from '@/src/features/offers/types';

export const supermarketsService = {
  /**
   * Get all supermarkets
   */
  getSupermarkets: async (): Promise<ApiResponse<PaginatedList<Supermarket>>> => {
    console.log('[Supermarkets API] getSupermarkets Request');
    const response =
      await apiClient.get<ApiResponse<PaginatedList<Supermarket>>>('/api/supermarkets');
    console.log('[Supermarkets API] getSupermarkets Response Data:', response.data);
    return response.data;
  },
};
