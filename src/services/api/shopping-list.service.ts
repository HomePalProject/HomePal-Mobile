import { apiClient } from './client';
import {
  ApiResponse,
  ShoppingListItemResponse,
  CreateShoppingListItemRequest,
  UpdateShoppingListItemRequest,
} from '@/src/types/api';

export const shoppingListService = {
  async getShoppingListItems(): Promise<ShoppingListItemResponse[]> {
    try {
      const response = await apiClient.get<
        ApiResponse<ShoppingListItemResponse[]> | ShoppingListItemResponse[]
      >('/api/shopping-list');

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
        return [];
      }
      return [];
    }
  },

  async createShoppingListItem(
    payload: CreateShoppingListItemRequest
  ): Promise<ShoppingListItemResponse> {
    const response = await apiClient.post<
      ApiResponse<ShoppingListItemResponse> | ShoppingListItemResponse
    >('/api/shopping-list', payload);

    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
      return resData.data;
    }
    return resData as ShoppingListItemResponse;
  },

  async createFromOffer(offerId: string): Promise<ShoppingListItemResponse> {
    const response = await apiClient.post<
      ApiResponse<ShoppingListItemResponse> | ShoppingListItemResponse
    >(`/api/shopping-list/from-offer/${offerId}`);

    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
      return resData.data;
    }
    return resData as ShoppingListItemResponse;
  },

  async updateShoppingListItem(
    id: string,
    payload: UpdateShoppingListItemRequest
  ): Promise<ShoppingListItemResponse> {
    const response = await apiClient.put<
      ApiResponse<ShoppingListItemResponse> | ShoppingListItemResponse
    >(`/api/shopping-list/${id}`, payload);

    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
      return resData.data;
    }
    return resData as ShoppingListItemResponse;
  },

  async deleteShoppingListItem(id: string): Promise<boolean> {
    await apiClient.delete<ApiResponse<any> | any>(`/api/shopping-list/${id}`);
    return true;
  },

  async toggleShoppingListItem(id: string): Promise<ShoppingListItemResponse> {
    const response = await apiClient.patch<
      ApiResponse<ShoppingListItemResponse> | ShoppingListItemResponse
    >(`/api/shopping-list/${id}/toggle`);

    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
      return resData.data;
    }
    return resData as ShoppingListItemResponse;
  },

  async clearPurchasedItems(): Promise<boolean> {
    await apiClient.delete<ApiResponse<any> | any>('/api/shopping-list/purchased');
    return true;
  },
};
