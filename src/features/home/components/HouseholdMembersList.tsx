/**
 * HouseholdMembersList.tsx
 * Dumb UI component for the detailed Household Members management section.
 * All logic is managed by useHouseholdMembers.ts.
 */
import React, { useState } from 'react';
import { View, Pressable, FlatList } from 'react-native';
import { Users } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import {
  DetailedMember,
  AddOfflineMemberPayload,
} from '@/src/features/households/hooks/useHouseholdMembers';
import { AddOfflineMemberForm } from './AddOfflineMemberForm';
import { MemberCard } from './MemberCard';

export interface HouseholdMembersListProps {
  members: DetailedMember[];
  isAddFormOpen?: boolean;
  onToggleAddForm?: () => void;
  onAddOfflineMember: (payload: AddOfflineMemberPayload) => void;
  onPreferences: (id: string) => void;
  onEdit: (id: string) => void;
  onPromote: (id: string) => void;
  onDemote?: (id: string) => void;
  onLeave: (id: string) => void;
  onRemove: (id: string) => void;
  editingMemberId?: string | null;
  onCancelEdit?: () => void;
  onSaveEdit?: (id: string, payload: { fullName: string; gender: string; dob: string }) => void;
}

import { useTranslation } from 'react-i18next';

export function HouseholdMembersList({
  members,
  isAddFormOpen = false,
  onToggleAddForm,
  onAddOfflineMember,
  onPreferences,
  onEdit,
  onPromote,
  onDemote,
  onLeave,
  onRemove,
  editingMemberId,
  onCancelEdit,
  onSaveEdit,
}: HouseholdMembersListProps) {
  const { t } = useTranslation('households');
  const [internalFormOpen, setInternalFormOpen] = useState(false);
  const showForm = onToggleAddForm ? isAddFormOpen : internalFormOpen;
  const toggleForm = onToggleAddForm || (() => setInternalFormOpen((prev) => !prev));

  const currentUserMember = members.find((m) => m.isCurrentUser);
  const isCurrentUserAdmin = currentUserMember
    ? currentUserMember.role === 'Household Manager'
    : false;

  const ListHeaderComponent = (
    <View style={{ gap: 16, marginBottom: 16 }}>
      {/* ── Section Header ── */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Icon as={Users} size={20} className="text-brand-primary" />
          <Text className="font-cairo text-[18px] font-bold leading-[26px] text-brand-primary">
            {t('membersList.title')}
          </Text>
        </View>
        {isCurrentUserAdmin && (
          <Pressable
            onPress={toggleForm}
            className="rounded-full active:opacity-80"
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              backgroundColor: '#356859',
            }}>
            <Text style={{ fontFamily: 'Cairo', fontSize: 13, fontWeight: '700', color: '#fff' }}>
              {t('membersList.addOfflineMember')}
            </Text>
          </Pressable>
        )}
      </View>

      {/* ── Add Offline Member Form (Shown when toggled) ── */}
      {showForm && <AddOfflineMemberForm onSubmit={onAddOfflineMember} />}
    </View>
  );

  return (
    <FlatList
      data={members}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={{ gap: 12, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item: member }) => (
        <MemberCard
          member={member}
          isCurrentUserAdmin={isCurrentUserAdmin}
          isEditing={member.id === editingMemberId}
          onPreferences={onPreferences}
          onEdit={onEdit}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onPromote={onPromote}
          onDemote={onDemote}
          onLeave={onLeave}
          onRemove={onRemove}
        />
      )}
    />
  );
}
