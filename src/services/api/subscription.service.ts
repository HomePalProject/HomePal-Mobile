import { apiClient } from './client';
import {
  ApiResponse,
  SubscriptionPlanResponse,
  UserSubscriptionResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  PaymentTransactionResponse,
} from '@/src/types/api';

/**
 * Subscription API Service
 */
export const subscriptionService = {
  /**
   * Get all available subscription plans.
   */
  getPlans: async (): Promise<ApiResponse<SubscriptionPlanResponse[]>> => {
    const response = await apiClient.get<ApiResponse<SubscriptionPlanResponse[]>>(
      '/api/subscriptions/plans'
    );
    return response.data;
  },

  /**
   * Get the current user's active subscription.
   */
  getCurrentSubscription: async (): Promise<ApiResponse<UserSubscriptionResponse>> => {
    const response = await apiClient.get<ApiResponse<UserSubscriptionResponse>>(
      '/api/subscriptions/current'
    );
    return response.data;
  },

  /**
   * Initiate a checkout process for a given plan.
   * Returns the Paymob iframe URL and payment token.
   */
  initiateCheckout: async (
    data: InitiatePaymentRequest
  ): Promise<ApiResponse<InitiatePaymentResponse>> => {
    const response = await apiClient.post<ApiResponse<InitiatePaymentResponse>>(
      '/api/subscriptions/checkout',
      data
    );
    return response.data;
  },

  /**
   * Get the payment history for the current user.
   */
  getPaymentHistory: async (): Promise<ApiResponse<PaymentTransactionResponse[]>> => {
    const response = await apiClient.get<ApiResponse<PaymentTransactionResponse[]>>(
      '/api/subscriptions/history'
    );
    return response.data;
  },
};
