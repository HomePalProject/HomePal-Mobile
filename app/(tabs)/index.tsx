import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Href } from 'expo-router';
import { useDashboard } from '@/src/features/home/hooks/useDashboard';
import { useActiveDashboard } from '@/src/features/home/hooks/useActiveDashboard';
import { useHouseholdMembers } from '@/src/features/households/hooks/useHouseholdMembers';
import { DashboardHeader } from '@/src/features/home/components/DashboardHeader';
import { OrphanStateView } from '@/src/features/home/components/OrphanStateView';
import { ActiveStateView } from '@/src/features/home/components/ActiveStateView';
import { Text } from '@/src/components/ui/text';

import { useDrawerStore } from '@/src/store/useDrawerStore';

export default function DashboardScreen() {
  const { openDrawer } = useDrawerStore();
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
  } = useDashboard();

  const {
    members: detailedMembers,
    isAddFormOpen,
    editingMemberId,
    onToggleAddForm,
    onAddOfflineMember,
    onPreferences,
    onEdit,
    onCancelEdit,
    onSaveEdit,
    onPromote,
    onDemote,
    onLeave,
    onRemove,
  } = useHouseholdMembers();

  const { householdName, location, stats, members, onManageMembers } = useActiveDashboard(
    householdData,
    detailedMembers.length
  );

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['top']}>
      {/* Top Header Navigation */}
      <DashboardHeader
        firstInitial={firstInitial}
        profileImageUri={profileImageUri}
        onAvatarPress={openDrawer}
        onNotificationPress={() => console.log('[Dashboard] Notification bell pressed')}
      />

      {/* Conditional State Rendering */}
      {isFetchingHousehold ? (
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
        />
      ) : (
        // State B: Active household dashboard
        <ActiveStateView
          firstName={firstName}
          householdName={householdName}
          location={location}
          stats={stats}
          members={members}
          onManageMembers={onManageMembers}
          onInviteMember={() => router.push('/(households)/invite' as Href)}
          detailedMembers={detailedMembers}
          isAddFormOpen={isAddFormOpen}
          onToggleAddForm={onToggleAddForm}
          onAddOfflineMember={onAddOfflineMember}
          onPreferences={onPreferences}
          onEditMember={onEdit}
          editingMemberId={editingMemberId}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onPromote={onPromote}
          onDemote={onDemote}
          onLeave={onLeave}
          onRemove={onRemove}
        />
      )}
    </SafeAreaView>
  );
}
