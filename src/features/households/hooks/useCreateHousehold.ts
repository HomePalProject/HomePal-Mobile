import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DeviceEventEmitter } from 'react-native';
import { toast } from '@/src/providers/ToastProvider';
import { householdService } from '@/src/services/api/household.service';
import { CreateHouseholdRequest } from '@/src/types/api';
import { useAppDispatch } from '@/src/store';
import { bootstrapAuth } from '@/src/store/slices/authSlice';
import { authStorage } from '@/src/services/storage/auth.storage';
import { authService } from '@/src/services/api/auth.service';

export interface CreateHouseholdForm {
  name: string;
  address: string;
  governorate: string;
  city: string;
}

export function useCreateHousehold() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<CreateHouseholdForm>({
    name: '',
    address: '',
    governorate: '',
    city: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateHouseholdForm, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof CreateHouseholdForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const tempErrors: Partial<Record<keyof CreateHouseholdForm, string>> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = 'Household Name is required';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Build CreateHouseholdRequest payload according to swagger spec
      const payload: CreateHouseholdRequest = {
        name: formData.name.trim(),
        ...(formData.address.trim() && { address: formData.address.trim() }),
        ...(formData.governorate.trim() && { governorate: formData.governorate.trim() }),
        ...(formData.city.trim() && { city: formData.city.trim() }),
      };

      // Real API Call: POST /api/Households
      const createdHousehold = await householdService.createHousehold(payload);

      toast.success(
        'Household Registered!',
        `Successfully registered "${createdHousehold.name || formData.name.trim()}"`
      );

      // Refresh token to get the new HouseholdManager claim
      try {
        const rt = await authStorage.getRefreshToken();
        if (rt) {
          const res = await authService.refreshToken({ refreshToken: rt });
          if (res.success && res.data) {
            await authStorage.setTokens(res.data.accessToken, res.data.refreshToken);
          }
        }
        await dispatch(bootstrapAuth()).unwrap();
      } catch (e) {
        console.warn('Failed to refresh session after creating household', e);
      }

      // Trigger a dashboard refetch before navigating back
      DeviceEventEmitter.emit('REFRESH_DASHBOARD');

      // Navigate back to the main dashboard (State B will load automatically on mount)
      router.back();
    } catch (error: any) {
      console.error('[CreateHousehold] Failed to register household:', error);
      const apiMessage =
        error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        'An unexpected error occurred. Please try again.';

      toast.error('Registration Failed', apiMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    onChangeField: handleInputChange,
    onSubmit: handleSubmit,
  };
}
