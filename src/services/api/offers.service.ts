import { apiClient } from './client';
import { ApiResponse } from '@/src/types/api';
import { Offer, OfferSearchParams, PaginatedList } from '@/src/features/offers/types';

export const offersService = {
  /**
   * Search for supermarket offers
   */
  searchOffers: async (params: OfferSearchParams): Promise<ApiResponse<PaginatedList<Offer>>> => {
    console.log('[Offers API] searchOffers Request:', params);
    const response = await apiClient.get<ApiResponse<PaginatedList<Offer>>>('/api/offers/search', {
      params,
    });
    console.log('[Offers API] searchOffers Response Data:', response.data);
    return response.data;
  },

  /**
   * Get a specific offer by ID
   */
  getOfferById: async (offerId: string): Promise<ApiResponse<Offer>> => {
    console.log(`[Offers API] getOfferById Request: ${offerId}`);
    const response = await apiClient.get<ApiResponse<Offer>>(`/api/offers/${offerId}`);
    console.log(`[Offers API] getOfferById Response Data:`, response.data);
    return response.data;
  },
};
