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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function FamilyManagementScreen() {
  const { t } = useTranslation('households');
  const insets = useSafeAreaInsets();
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
    <SafeAreaView className="flex-1 bg-surface-background" edges={['bottom', 'left', 'right']}>
      <View
        className="flex-row items-center justify-between border-b border-surface-divider bg-surface-surface px-spacing-16 pb-3 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 16) + 12 }}>
        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={() => router.back()}
            className="active:bg-surface-surfaceVariant me-2 rounded-full p-2"
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Icon as={ArrowLeft} directional size={24} className="text-text-primary" />
          </Pressable>
          <Text className="text-bodyLarge font-cairo font-bold text-brand-primary">
            {t('familyManagement.title', 'Family Management')}
          </Text>
        </View>
      </View>

      <View className="flex-1 px-5 pt-5">
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
      </View>

      {/* ── FAB: Invite Member ── */}
      <Pressable
        onPress={onInviteMember}
        className="absolute end-6 z-50 flex-row items-center gap-2 rounded-full bg-brand-primary pe-6 ps-5 active:bg-brand-primary-pressed"
        style={{
          bottom: Math.max(insets.bottom + 24, 24),
          height: 56,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
        }}
        accessibilityRole="button"
        accessibilityLabel={t('familyManagement.inviteMember', 'Invite Member')}>
        <Icon as={Plus} size={22} color="#fff" />
        <Text className="font-cairo text-[14px] font-bold leading-[20px] tracking-[0.01em] text-white">
          {t('familyManagement.inviteMember', 'Invite Member')}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
