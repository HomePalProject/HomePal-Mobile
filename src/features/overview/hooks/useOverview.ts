import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useGetHouseholdOverviewQuery } from '../overview.api';

/**
 * Custom hook to access RTK Query Household Overview data.
 * Exposes loading states, data, and refetch support for pull-to-refresh.
 */
export function useOverview() {
  const { data, isLoading, isFetching, error, refetch } = useGetHouseholdOverviewQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Automatically refetch when the screen gains focus (e.g., navigating back to home screen)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return {
    overviewData: data?.data,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}
