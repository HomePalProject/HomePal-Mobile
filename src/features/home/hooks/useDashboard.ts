import { useState, useEffect, useCallback } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/src/store';
import { updateProfileFields } from '@/src/store/slices/profileSlice';
import { useRouter, Href } from 'expo-router';
import { householdService } from '@/src/services/api/household.service';
import { HouseholdDto } from '@/src/types/api';

export function useDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    fullName,
    profileImageUri,
    isLoading: isProfileLoading,
  } = useAppSelector((state) => state.profile);

  const [hasHousehold, setHasHousehold] = useState(false);
  const [householdData, setHouseholdData] = useState<HouseholdDto | null>(null);
  const [isHouseholdLoading, setIsHouseholdLoading] = useState(true);
  const [isFetchingHousehold, setIsFetchingHousehold] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setIsHouseholdLoading(true);
    setIsFetchingHousehold(true);
    try {
      // 1. Fetch my-household endpoint (GET /api/Households/my-household)
      const data = await householdService.getMyHousehold();

      if (data) {
        setHouseholdData(data);
        setHasHousehold(true); // 200 OK -> User has household -> Render State B
        dispatch(updateProfileFields({ hasHousehold: true }));
      } else {
        setHouseholdData(null);
        setHasHousehold(false); // 404 Not Found -> User has no household -> Render State A
        dispatch(updateProfileFields({ hasHousehold: false, isManager: false }));
      }
    } catch (error: any) {
      console.warn(
        '[useDashboard] Handled fetch dashboard status fallback:',
        error?.message || error
      );
      setHouseholdData(null);
      setHasHousehold(false);
      dispatch(updateProfileFields({ hasHousehold: false, isManager: false }));
    } finally {
      setIsHouseholdLoading(false);
      setIsFetchingHousehold(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchDashboardData();

    // Listen for on-demand refetch events (e.g. after creating a household)
    const subscription = DeviceEventEmitter.addListener('REFRESH_DASHBOARD', () => {
      fetchDashboardData();
    });

    return () => subscription.remove();
  }, [fetchDashboardData]);

  const handleCreateHousehold = () => {
    console.log('[Dashboard] Navigating to Create Household screen...');
    router.push('/(households)/create' as Href);
  };

  const handleViewInvitations = () => {
    console.log('[Dashboard] Navigating to Received Pending Invitations screen...');
    router.push('/(households)/invitations' as Href);
  };

  // Safety fallback for name parsing
  const safeFullName = fullName || '';
  const nameParts = safeFullName.trim().split(/\s+/);
  const firstName = nameParts[0] || 'User';
  const firstInitial = firstName ? firstName[0].toUpperCase() : 'U';

  const combinedLoading = isProfileLoading || isHouseholdLoading;

  return {
    isLoading: combinedLoading,
    isFetchingHousehold,
    hasHousehold,
    householdData,
    fullName,
    firstName,
    firstInitial,
    profileImageUri,
    onCreateHousehold: handleCreateHousehold,
    onViewInvitations: handleViewInvitations,
    refreshDashboard: fetchDashboardData,
    setHasHousehold,
  };
}
