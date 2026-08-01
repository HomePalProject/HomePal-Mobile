import { useState } from 'react';
import { useRouter } from 'expo-router';
import { toast } from '@/src/providers/ToastProvider';

export interface CreateHouseholdForm {
  name: string;
  address: string;
  governorate: string;
  city: string;
}

export function useCreateHousehold() {
  const router = useRouter();

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
      // Simulate backend API latency (POST /api/Households)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Household Registered!', `Successfully registered "${formData.name.trim()}"`);

      // Navigate back to the main tabs dashboard
      router.back();
    } catch (error) {
      console.error('[CreateHousehold] Failed to register household:', error);
      toast.error('Registration Failed', 'An unexpected error occurred. Please try again.');
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
