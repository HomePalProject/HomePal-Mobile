import { apiClient } from './client';
import { ApiResponse, ProductCategoryResponse } from '@/src/types/api';

export const categoryService = {
  /**
   * GET /api/products/categories or /api/products/categories/search
   * Fetches product categories with optional search query.
   * Returns empty array if 404 or on error.
   */
  async getCategories(query?: string): Promise<ProductCategoryResponse[]> {
    try {
      const endpoint =
        query && query.trim().length > 0
          ? `/api/products/categories/search?query=${encodeURIComponent(query.trim())}`
          : '/api/products/categories';

      const response = await apiClient.get<
        ApiResponse<ProductCategoryResponse[]> | ProductCategoryResponse[]
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
        console.log('[CategoryService] No product categories found (404 Not Found)');
        return [];
      }
      console.warn('[CategoryService] Error fetching product categories:', error?.message || error);
      return [];
    }
  },

  /**
   * GET /api/products/categories/{categoryId}
   * Fetches a single product category by ID.
   * Returns null if 404 or on error.
   */
  async getCategoryById(id: string): Promise<ProductCategoryResponse | null> {
    try {
      const response = await apiClient.get<
        ApiResponse<ProductCategoryResponse> | ProductCategoryResponse
      >(`/api/products/categories/${id}`);

      const resData = response.data;
      if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
        return resData.data;
      }
      return (resData as ProductCategoryResponse) || null;
    } catch (error: any) {
      const status = error?.response?.status || error?.status || error?.statusCode;
      if (status === 404 || status === '404') {
        console.log(`[CategoryService] Category ${id} not found (404 Not Found)`);
        return null;
      }
      console.warn(`[CategoryService] Error fetching category ${id}:`, error?.message || error);
      return null;
    }
  },
};
