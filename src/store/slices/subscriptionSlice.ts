import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { subscriptionService } from '@/src/services/api/subscription.service';
import {
  SubscriptionPlanResponse,
  UserSubscriptionResponse,
  PaymentTransactionResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
} from '@/src/types/api';
// Missing import removed

const extractErrorMessage = (error: any): string => {
  return error?.response?.data?.message || error?.message || 'An unexpected error occurred';
};
interface SubscriptionState {
  plans: SubscriptionPlanResponse[];
  currentSubscription: UserSubscriptionResponse | null;
  paymentHistory: PaymentTransactionResponse[];
  isLoading: boolean;
  isLoadingCheckout: boolean;
  error: string | null;
  checkoutError: string | null;
}

const initialState: SubscriptionState = {
  plans: [],
  currentSubscription: null,
  paymentHistory: [],
  isLoading: false,
  isLoadingCheckout: false,
  error: null,
  checkoutError: null,
};

export const fetchPlans = createAsyncThunk(
  'subscription/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getPlans();
      console.log('[fetchPlans] Raw response:', JSON.stringify(response, null, 2));
      if (response.success && response.data) {
        console.log('[fetchPlans] Returning plans:', response.data.length);
        return response.data;
      }
      console.log(
        '[fetchPlans] Failed condition. success:',
        response.success,
        'data exists:',
        !!response.data
      );
      return rejectWithValue(response.message || 'Failed to fetch plans');
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchCurrentSubscription = createAsyncThunk(
  'subscription/fetchCurrentSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getCurrentSubscription();
      console.log('[fetchCurrentSubscription] Raw response:', JSON.stringify(response, null, 2));
      if (response.success && response.data) {
        return response.data;
      }
      // If no active sub, the backend might return success: true and data: null
      if (response.success && response.data === null) {
        return null;
      }
      if (!response.success && response.status === 'NotFound') {
        return null;
      }
      // If 404 or no active sub, it might return success false or empty data, handle appropriately
      if (!response.success && response.status === 'NotFound') {
        return null;
      }
      return rejectWithValue(response.message || 'Failed to fetch current subscription');
    } catch (error: any) {
      // API may throw 404 for no subscription, which is a valid state
      if (error?.response?.status === 404) {
        return null;
      }
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'subscription/fetchPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getPaymentHistory();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch payment history');
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const checkoutPlan = createAsyncThunk(
  'subscription/checkoutPlan',
  async (request: InitiatePaymentRequest, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.initiateCheckout(request);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to initiate checkout');
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
    clearCheckoutError: (state) => {
      state.checkoutError = null;
    },
  },
  extraReducers: (builder) => {
    // fetchPlans
    builder.addCase(fetchPlans.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPlans.fulfilled, (state, action) => {
      state.isLoading = false;
      state.plans = action.payload;
    });
    builder.addCase(fetchPlans.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // fetchCurrentSubscription
    builder.addCase(fetchCurrentSubscription.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentSubscription = action.payload;
    });
    builder.addCase(fetchCurrentSubscription.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // fetchPaymentHistory
    builder.addCase(fetchPaymentHistory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPaymentHistory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.paymentHistory = action.payload;
    });
    builder.addCase(fetchPaymentHistory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // checkoutPlan
    builder.addCase(checkoutPlan.pending, (state) => {
      state.isLoadingCheckout = true;
      state.checkoutError = null;
    });
    builder.addCase(checkoutPlan.fulfilled, (state, action) => {
      state.isLoadingCheckout = false;
      // We don't store the iframeURL here long term, we just rely on component resolving the promise
    });
    builder.addCase(checkoutPlan.rejected, (state, action) => {
      state.isLoadingCheckout = false;
      state.checkoutError = action.payload as string;
    });
  },
});

export const { clearSubscriptionError, clearCheckoutError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
