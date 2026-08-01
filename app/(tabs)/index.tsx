import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Href } from 'expo-router';
import { useDashboard } from '@/src/features/home/hooks/useDashboard';
import { useActiveDashboard } from '@/src/features/home/hooks/useActiveDashboard';
import { useHouseholdMembers } from '@/src/features/households/hooks/useHouseholdMembers';
import { DashboardHeader } from '@/src/features/home/components/DashboardHeader';
import { OrphanStateView } from '@/src/features/home/components/OrphanStateView';
import { ActiveStateView } from '@/src/features/home/components/ActiveStateView';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';

export default function DashboardScreen() {
  const {
    isLoading,
    hasHousehold,
    firstName,
    firstInitial,
    profileImageUri,
    onCreateHousehold,
    onViewInvitations,
    setHasHousehold,
  } = useDashboard();

  const { householdName, location, stats, members, onManageMembers } = useActiveDashboard();

  const {
    members: detailedMembers,
    isAddFormOpen,
    onToggleAddForm,
    onAddOfflineMember,
    onPreferences,
    onEdit,
    onPromote,
    onLeave,
    onRemove,
  } = useHouseholdMembers();

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['top']}>
      {/* Top Header Navigation */}
      <DashboardHeader
        firstInitial={firstInitial}
        profileImageUri={profileImageUri}
        onAvatarPress={() => router.push('/profile' as Href)}
        onNotificationPress={() => console.log('[Dashboard] Notification bell pressed')}
      />

      {/* Conditional State Rendering */}
      {!hasHousehold ? (
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
          onPromote={onPromote}
          onLeave={onLeave}
          onRemove={onRemove}
        />
      )}

      {/* ── Developer Toggle (test only) ── */}
      <View className="absolute bottom-6 left-6 z-10 shadow-lg">
        <Button
          onPress={() => setHasHousehold(!hasHousehold)}
          size="sm"
          className="h-9 rounded-full border border-brand-accent/20 bg-brand-accent px-4">
          <Text className="font-cairo text-[11px] font-bold text-text-primary">
            {hasHousehold ? 'State A' : 'State B'}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
