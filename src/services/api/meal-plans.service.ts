import { apiClient as api } from '@/src/services/api/client';
import {
  ApiResponse,
  MealPlanResponse,
  CreateMealPlanRequest,
  UpdateMealPlanRequest,
} from '@/src/types/api';

export interface PaginatedMealPlans {
  items: MealPlanResponse[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const mealPlansApi = {
  /**
   * Retrieves a paginated list of meal plans.
   */
  getMealPlans: async (
    pageNumber: number = 1,
    pageSize: number = 5
  ): Promise<ApiResponse<PaginatedMealPlans>> => {
    const response = await api.get<ApiResponse<PaginatedMealPlans>>('/api/meal-plans', {
      params: { PageNumber: pageNumber, PageSize: pageSize },
    });
    return response.data;
  },

  /**
   * Retrieves the latest active meal plan.
   */
  getLatestMealPlan: async (): Promise<ApiResponse<MealPlanResponse>> => {
    const response = await api.get<ApiResponse<MealPlanResponse>>('/api/meal-plans/last');
    return response.data;
  },

  /**
   * Retrieves a specific meal plan by its ID.
   */
  getMealPlanById: async (id: string): Promise<ApiResponse<MealPlanResponse>> => {
    const response = await api.get<ApiResponse<MealPlanResponse>>(`/api/meal-plans/${id}`);
    return response.data;
  },

  /**
   * Creates a new meal plan.
   */
  createMealPlan: async (data: CreateMealPlanRequest): Promise<ApiResponse<MealPlanResponse>> => {
    const response = await api.post<ApiResponse<MealPlanResponse>>('/api/meal-plans', data);
    return response.data;
  },

  /**
   * Updates an existing meal plan.
   */
  updateMealPlan: async (
    id: string,
    data: UpdateMealPlanRequest
  ): Promise<ApiResponse<MealPlanResponse>> => {
    const response = await api.put<ApiResponse<MealPlanResponse>>(`/api/meal-plans/${id}`, data);
    return response.data;
  },

  /**
   * Deletes a meal plan.
   */
  deleteMealPlan: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/api/meal-plans/${id}`);
    return response.data;
  },
};
