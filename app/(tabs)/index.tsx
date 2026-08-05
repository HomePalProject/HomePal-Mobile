import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Href } from 'expo-router';
import { useDashboard } from '@/src/features/home/hooks/useDashboard';
import { useActiveDashboard } from '@/src/features/home/hooks/useActiveDashboard';
import { DashboardHeader } from '@/src/features/home/components/DashboardHeader';
import { OrphanStateView } from '@/src/features/home/components/OrphanStateView';
import { ActiveStateView } from '@/src/features/home/components/ActiveStateView';
import { Text } from '@/src/components/ui/text';

import { useAppDispatch } from '@/src/store';
import { openDrawer } from '@/src/store/slices/uiSlice';

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const handleOpenDrawer = () => dispatch(openDrawer());
  const {
    isLoading,
    isFetchingHousehold,
    hasHousehold,
    householdData,
    firstName,
    firstInitial,
    profileImageUri,
    onCreateHousehold,
    onViewInvitations,
    refreshDashboard,
  } = useDashboard();

  const { householdName, location, stats, members } = useActiveDashboard(householdData);

  const handleRefresh = async () => {
    await refreshDashboard();
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['top']}>
      {/* Top Header Navigation */}
      <DashboardHeader
        firstInitial={firstInitial}
        profileImageUri={profileImageUri}
        onAvatarPress={handleOpenDrawer}
      />

      {/* Conditional State Rendering */}
      {isFetchingHousehold && !householdData && !hasHousehold ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#356859" />
          <Text className="mt-3 font-cairo text-[14px] text-text-secondary">
            Loading dashboard...
          </Text>
        </View>
      ) : !hasHousehold ? (
        // State A: No household yet
        <OrphanStateView
          onCreateHousehold={onCreateHousehold}
          onViewInvitations={onViewInvitations}
          onRefresh={handleRefresh}
          isRefreshing={isFetchingHousehold}
        />
      ) : (
        // State B: Active household dashboard
        <ActiveStateView
          firstName={firstName}
          householdName={householdName}
          location={location}
          stats={stats}
          members={members}
          onRefresh={handleRefresh}
          isRefreshing={isFetchingHousehold}
        />
      )}
    </SafeAreaView>
  );
}
