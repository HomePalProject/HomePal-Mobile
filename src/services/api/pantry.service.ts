import { apiClient } from './client';
import {
  ApiResponse,
  PantryItemResponse,
  CreatePantryItemRequest,
  UpdatePantryItemRequest,
} from '@/src/types/api';

export const pantryService = {
  /**
   * GET /api/pantry/items
   * Fetches all pantry items for the household.
   * Returns empty array if 404 or on error.
   */
  async getPantryItems(): Promise<PantryItemResponse[]> {
    try {
      const response = await apiClient.get<
        ApiResponse<PantryItemResponse[]> | PantryItemResponse[]
      >('/api/pantry/items');

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
        console.log('[PantryService] No pantry items found (404 Not Found)');
        return [];
      }
      console.warn('[PantryService] Error fetching pantry items:', error?.message || error);
      return [];
    }
  },

  /**
   * GET /api/pantry/items/{id}
   * Fetches a single pantry item by ID.
   * Returns null if 404 or on error.
   */
  async getPantryItemById(id: string): Promise<PantryItemResponse | null> {
    try {
      const response = await apiClient.get<ApiResponse<PantryItemResponse> | PantryItemResponse>(
        `/api/pantry/items/${id}`
      );

      const resData = response.data;
      if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
        return resData.data;
      }
      return (resData as PantryItemResponse) || null;
    } catch (error: any) {
      const status = error?.response?.status || error?.status || error?.statusCode;
      if (status === 404 || status === '404') {
        console.log(`[PantryService] Pantry item ${id} not found (404 Not Found)`);
        return null;
      }
      console.warn(`[PantryService] Error fetching pantry item ${id}:`, error?.message || error);
      return null;
    }
  },

  /**
   * POST /api/pantry/items
   * Creates a new pantry item.
   */
  async createPantryItem(payload: CreatePantryItemRequest): Promise<PantryItemResponse> {
    const response = await apiClient.post<ApiResponse<PantryItemResponse> | PantryItemResponse>(
      '/api/pantry/items',
      payload
    );

    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
      return resData.data;
    }
    return resData as PantryItemResponse;
  },

  /**
   * PUT /api/pantry/items/{id}
   * Updates an existing pantry item.
   */
  async updatePantryItem(
    id: string,
    payload: UpdatePantryItemRequest
  ): Promise<PantryItemResponse> {
    const response = await apiClient.put<ApiResponse<PantryItemResponse> | PantryItemResponse>(
      `/api/pantry/items/${id}`,
      payload
    );

    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
      return resData.data;
    }
    return resData as PantryItemResponse;
  },

  /**
   * DELETE /api/pantry/items/{id}
   * Deletes a pantry item.
   */
  async deletePantryItem(id: string): Promise<boolean> {
    await apiClient.delete<ApiResponse<any> | any>(`/api/pantry/items/${id}`);
    return true;
  },
};
