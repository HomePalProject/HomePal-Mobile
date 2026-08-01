import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDashboard } from '@/src/features/home/hooks/useDashboard';
import { DashboardHeader } from '@/src/features/home/components/DashboardHeader';
import { OrphanStateView } from '@/src/features/home/components/OrphanStateView';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { router, Href } from 'expo-router';

export default function DashboardScreen() {
  const {
    isLoading,
    hasHousehold,
    fullName,
    firstInitial,
    profileImageUri,
    onCreateHousehold,
    onViewInvitations,
    setHasHousehold,
  } = useDashboard();

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
        <OrphanStateView
          onCreateHousehold={onCreateHousehold}
          onViewInvitations={onViewInvitations}
        />
      ) : (
        /* State B: Active Household Placeholder (with simple switch back button for testing) */
        <View className="flex-1 items-center justify-center bg-surface-background p-spacing-24">
          <View className="max-w-[280px] items-center gap-spacing-16">
            <Text className="text-bodyLarge text-center font-cairo font-bold text-brand-primary">
              Active Household Dashboard (State B)
            </Text>
            <Text className="text-bodySmall text-center font-cairo text-text-secondary">
              This screen is designed to show your household statistics, members list, and pantry
              details.
            </Text>
            <Button
              onPress={() => setHasHousehold(false)}
              className="mt-spacing-8 h-12 rounded-radius-full bg-brand-primary px-spacing-24">
              <Text className="font-cairo font-bold text-text-inverse">
                Switch to Orphan State (A)
              </Text>
            </Button>
          </View>
        </View>
      )}

      {/* Developer state switcher (Floating button to easily test State B from the Orphan screen) */}
      {!hasHousehold && (
        <View className="absolute bottom-spacing-24 right-spacing-24 z-10 shadow-lg">
          <Button
            onPress={() => setHasHousehold(true)}
            size="sm"
            className="h-10 rounded-radius-full border border-brand-accent/20 bg-brand-accent px-spacing-16">
            <Text className="font-cairo text-[12px] font-bold text-text-primary">Test State B</Text>
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

// import { View, Text } from 'react-native';

// export default function DashboardScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Hello HomePal!</Text>
//     </View>
//   );
// }
