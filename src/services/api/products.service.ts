import { apiClient } from './client';
import { ApiResponse } from '@/src/types/api';
import { ProductCategory } from '@/src/features/offers/types';

export const productsService = {
  /**
   * Get all product categories
   */
  getCategories: async (): Promise<ApiResponse<ProductCategory[]>> => {
    console.log('[Products API] getCategories Request');
    const response = await apiClient.get<ApiResponse<ProductCategory[]>>(
      '/api/products/categories'
    );
    console.log('[Products API] getCategories Response Data:', response.data);
    return response.data;
  },
};
