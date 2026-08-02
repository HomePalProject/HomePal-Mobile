import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { toast } from '@/src/providers/ToastProvider';
import { householdService } from '@/src/services/api/household.service';
import { ApiError } from '@/src/services/api/client';
import { HouseholdDto } from '@/src/types/api';

export function useHouseholdSettings() {
  const router = useRouter();

  const [household, setHousehold] = useState<HouseholdDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadHousehold() {
      setIsLoading(true);
      try {
        const data = await householdService.getMyHousehold();
        if (isMounted && data) {
          setHousehold(data);
          setName(data.name || '');
          setAddress(data.address || '');
          setGovernorate(data.governorate || '');
          setCity(data.city || '');
        }
      } catch (error: any) {
        console.warn('[useHouseholdSettings] Error loading household:', error?.message || error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadHousehold();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error('Validation Error', 'Household Name is required.');
      return;
    }

    setIsUpdating(true);
    try {
      await householdService.updateHousehold({
        name: name.trim(),
        address: address.trim() || null,
        governorate: governorate.trim() || null,
        city: city.trim() || null,
      });

      toast.success('Household Updated!', 'Your household settings have been saved.');
      router.back();
    } catch (error: any) {
      const message =
        error instanceof ApiError
          ? error.message
          : error?.message || 'Failed to update household settings.';
      toast.error('Error', message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Household',
      'Are you sure you want to delete this household? This action cannot be undone and will remove all member access.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Household',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await householdService.deleteHousehold();
              toast.success('Household Deleted', 'Your household has been permanently removed.');
              router.replace('/(tabs)');
            } catch (error: any) {
              const message =
                error instanceof ApiError
                  ? error.message
                  : error?.message || 'Failed to delete household.';
              toast.error('Error', message);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return {
    household,
    isLoading,
    isUpdating,
    isDeleting,
    name,
    setName,
    address,
    setAddress,
    governorate,
    setGovernorate,
    city,
    setCity,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
    onBack: () => router.back(),
  };
}
