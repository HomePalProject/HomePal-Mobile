import { apiClient } from './client';
import { ApiResponse, MeasuringUnitResponse } from '@/src/types/api';

export const unitService = {
  /**
   * GET /api/units or /api/units/search
   * Fetches measuring units with optional search query.
   * Returns empty array if 404 or on error.
   */
  async getMeasuringUnits(query?: string): Promise<MeasuringUnitResponse[]> {
    try {
      const endpoint =
        query && query.trim().length > 0
          ? `/api/units/search?query=${encodeURIComponent(query.trim())}`
          : '/api/units';

      const response = await apiClient.get<
        ApiResponse<MeasuringUnitResponse[]> | MeasuringUnitResponse[]
      >(endpoint);

      const resData = response.data;
      if (
        resData &&
        typeof resData === 'object' &&
        'data' in resData &&
        Array.isArray(resData.data)
      ) {
        return resData.data;
      }
      if (Array.isArray(resData)) {
        return resData;
      }
      return [];
    } catch (error: any) {
      const status = error?.response?.status || error?.status || error?.statusCode;
      if (status === 404 || status === '404') {
        console.log('[UnitService] No measuring units found (404 Not Found)');
        return [];
      }
      console.warn('[UnitService] Error fetching measuring units:', error?.message || error);
      return [];
    }
  },

  /**
   * GET /api/units/{measuringUnitId}
   * Fetches a single measuring unit by ID.
   * Returns null if 404 or on error.
   */
  async getMeasuringUnitById(id: string): Promise<MeasuringUnitResponse | null> {
    try {
      const response = await apiClient.get<
        ApiResponse<MeasuringUnitResponse> | MeasuringUnitResponse
      >(`/api/units/${id}`);

      const resData = response.data;
      if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
        return resData.data;
      }
      return (resData as MeasuringUnitResponse) || null;
    } catch (error: any) {
      const status = error?.response?.status || error?.status || error?.statusCode;
      if (status === 404 || status === '404') {
        console.log(`[UnitService] Measuring unit ${id} not found (404 Not Found)`);
        return null;
      }
      console.warn(`[UnitService] Error fetching measuring unit ${id}:`, error?.message || error);
      return null;
    }
  },
};
