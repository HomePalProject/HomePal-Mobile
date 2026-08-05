import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ArrowLeft } from 'lucide-react-native';
import { useHouseholdMembers } from '@/src/features/households/hooks/useHouseholdMembers';
import { HouseholdMembersList } from '@/src/features/home/components/HouseholdMembersList';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { Pressable } from 'react-native';
import { router, Href } from 'expo-router';

export default function FamilyManagementScreen() {
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

  const onInviteMember = () => {
    router.push('/(households)/invite' as Href);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['top', 'bottom']}>
      <View
        className="flex-row items-center justify-between border-b border-surface-divider bg-surface-surface px-spacing-16 shadow-sm"
        style={{ height: 64 }}>
        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={() => router.back()}
            className="active:bg-surface-surfaceVariant mr-2 rounded-full p-2"
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Icon as={ArrowLeft} size={24} className="text-text-primary" />
          </Pressable>
          <Text className="text-bodyLarge font-cairo font-bold text-brand-primary">
            Family Management
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        <HouseholdMembersList
          members={detailedMembers}
          isAddFormOpen={isAddFormOpen}
          onToggleAddForm={onToggleAddForm}
          onAddOfflineMember={onAddOfflineMember}
          onPreferences={onPreferences}
          onEdit={onEdit}
          onPromote={onPromote}
          onDemote={onDemote}
          onLeave={onLeave}
          onRemove={onRemove}
          editingMemberId={editingMemberId}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
        />
      </ScrollView>

      {/* ── FAB: Invite Member ── */}
      <Pressable
        onPress={onInviteMember}
        className="absolute bottom-6 right-6 z-50 flex-row items-center gap-2 rounded-full bg-brand-primary pl-5 pr-6 active:bg-brand-primary-pressed"
        style={{
          height: 56,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
        }}
        accessibilityRole="button"
        accessibilityLabel="Invite Member">
        <Icon as={Plus} size={22} color="#fff" />
        <Text className="font-cairo text-[14px] font-bold leading-[20px] tracking-[0.01em] text-white">
          Invite Member
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
