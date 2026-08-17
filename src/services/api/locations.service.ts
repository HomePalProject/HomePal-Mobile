import { apiClient as api } from './client';
import { ApiResponse, GovernorateResponse, CityResponse } from '@/src/types/api';

export const locationsService = {
  /**
   * Fetch all available governorates.
   */
  async getGovernorates(): Promise<GovernorateResponse[]> {
    const response = await api.get<ApiResponse<GovernorateResponse[]>>(
      '/api/locations/governorates'
    );
    if (response.data?.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to load governorates');
  },

  /**
   * Fetch cities, optionally filtered by governorateId and/or searchTerm.
   */
  async getCities(governorateId?: string, searchTerm?: string): Promise<CityResponse[]> {
    const params = new URLSearchParams();
    if (governorateId) params.append('governorateId', governorateId);
    if (searchTerm) params.append('searchTerm', searchTerm);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get<ApiResponse<CityResponse[]>>(
      `/api/locations/cities${queryString}`
    );

    if (response.data?.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to load cities');
  },
};
