import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { toast } from '@/src/providers/ToastProvider';
import { householdService } from '@/src/services/api/household.service';
import { ApiError } from '@/src/services/api/client';
import { HouseholdDto } from '@/src/types/api';
import i18n from '@/src/localization/i18n';

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
      toast.error(
        i18n.t('common:errors.requestFailed', 'Error'),
        i18n.t('households:householdNameRequired', 'Household Name is required.')
      );
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

      toast.success(
        i18n.t('common:buttons.saveChanges', 'Saved!'),
        i18n.t('households:settingsSaved', 'Your household settings have been saved.')
      );
      router.back();
    } catch (error: any) {
      const message =
        error instanceof ApiError
          ? error.message
          : error?.message || i18n.t('common:errors.unexpectedError');
      toast.error(i18n.t('common:errors.requestFailed'), message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      i18n.t('households:deleteConfirmTitle', 'Delete Household'),
      i18n.t('households:deleteConfirmMessage', 'Are you sure you want to delete this household? This action cannot be undone.'),
      [
        { text: i18n.t('common:buttons.cancel', 'Cancel'), style: 'cancel' },
        {
          text: i18n.t('households:deleteHousehold', 'Delete Household'),
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await householdService.deleteHousehold();
              toast.success(
                i18n.t('households:deleteConfirmTitle'),
                i18n.t('households:householdRemoved', 'Your household has been removed.')
              );
              router.replace('/(tabs)');
            } catch (error: any) {
              const message =
                error instanceof ApiError
                  ? error.message
                  : error?.message || i18n.t('common:errors.unexpectedError');
              toast.error(i18n.t('common:errors.requestFailed'), message);
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
