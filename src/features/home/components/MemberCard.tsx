import React, { useState, useEffect } from 'react';
import { View, Pressable, Image, TextInput, ActivityIndicator } from 'react-native';
import { CheckCircle, Circle, ChevronDown } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { DatePicker } from '@/src/components/ui/date-picker';
import { DetailedMember } from '@/src/features/households/hooks/useHouseholdMembers';
import { useTranslation } from 'react-i18next';

export interface MemberCardProps {
  member: DetailedMember;
  isCurrentUserAdmin?: boolean;
  isEditing?: boolean;
  onPreferences: (id: string) => void;
  onEdit: (id: string) => void;
  onCancelEdit?: () => void;
  onSaveEdit?: (id: string, payload: { fullName: string; gender: string; dob: string }) => void;
  onPromote: (id: string) => void;
  onDemote?: (id: string) => void;
  onLeave: (id: string) => void;
  onRemove: (id: string) => void;
}

export function MemberCard({
  member,
  isCurrentUserAdmin = false,
  isEditing = false,
  onPreferences,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onPromote,
  onDemote,
  onLeave,
  onRemove,
}: MemberCardProps) {
  const { t } = useTranslation('households');
  const isManager = member.role === 'Household Manager';
  const isCurrentUser = member.isCurrentUser;
  const isRegistered = member.type === 'Registered';

  const [editName, setEditName] = useState(member.fullName);
  const [editGender, setEditGender] = useState(member.gender || 'Male');
  const [editDob, setEditDob] = useState(member.dob || '');

  const [isGenderPickerOpen, setIsGenderPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setEditName(member.fullName);
      setEditGender(member.gender || 'Male');
      setEditDob(member.dob || '');
    }
  }, [isEditing, member]);

  // ── Inline Edit Mode UI ──
  if (isEditing) {
    return (
      <View
        className="bg-surface-surfaceVariant/40 rounded-2xl border border-brand-primary/40 p-4"
        style={{ gap: 14 }}>
        <Text className="font-cairo text-[15px] font-bold text-text-primary">
          {t('membersList.editMember', { name: member.fullName })}
        </Text>

        {/* Field 1: Full Name */}
        <View style={{ gap: 6 }}>
          <Text className="font-cairo text-[14px] font-bold text-text-primary">
            {t('membersList.fullName')}
          </Text>
          <TextInput
            value={editName}
            onChangeText={setEditName}
            placeholder={t('membersList.fullNamePlaceholder')}
            placeholderClassName="text-text-disabled"
            className="bg-surface-variant rounded-xl border border-surface-border px-3.5 py-2.5 font-cairo text-[15px] text-text-primary"
          />
        </View>

        {/* Field 2 & 3: Gender & DOB side by side */}
        <View className="flex-row gap-3">
          {/* Gender Select */}
          <View className="flex-1" style={{ gap: 6 }}>
            <Text className="font-cairo text-[14px] font-bold text-text-primary">
              {t('membersList.gender')}
            </Text>
            <Pressable
              onPress={() => setIsGenderPickerOpen((prev) => !prev)}
              className="bg-surface-variant flex-row items-center justify-between rounded-xl border border-surface-border px-3.5 py-2.5 active:opacity-80">
              <Text className="font-cairo text-[14px] text-text-primary">
                {editGender === 'Male' ? t('membersList.male') : t('membersList.female')}
              </Text>
              <Icon as={ChevronDown} size={18} className="text-text-primary" />
            </Pressable>
          </View>

          {/* DOB Input */}
          <View className="flex-1" style={{ gap: 6 }}>
            <DatePicker
              label={t('membersList.dob')}
              value={editDob}
              onChange={setEditDob}
              placeholder="YYYY-MM-DD"
            />
          </View>
        </View>

        {/* Inline Gender Picker Options Accordion */}
        {isGenderPickerOpen && (
          <View className="mt-1 w-full rounded-xl border border-surface-border bg-surface-surface p-1 shadow-sm">
            {['Male', 'Female'].map((option) => (
              <Pressable
                key={option}
                onPress={() => {
                  setEditGender(option);
                  setIsGenderPickerOpen(false);
                }}
                className="active:bg-surface-surfaceVariant rounded-lg px-4 py-2.5">
                <Text className="font-cairo text-[14px] font-semibold text-text-primary">
                  {option === 'Male' ? t('membersList.male') : t('membersList.female')}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Action Controls: Cancel & Save Changes */}
        <View className="mt-2 flex-row items-center justify-end gap-3 border-t border-surface-border pt-3">
          <Pressable
            onPress={onCancelEdit}
            disabled={isSubmitting}
            className="rounded-xl border border-surface-border bg-surface-surface px-4 py-2.5 active:opacity-80">
            <Text className="font-cairo text-[14px] font-bold text-text-secondary">
              {t('membersList.cancel')}
            </Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              if (onSaveEdit) {
                setIsSubmitting(true);
                await onSaveEdit(member.id, {
                  fullName: editName,
                  gender: editGender,
                  dob: editDob,
                });
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
            className="flex-row items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 shadow-sm active:opacity-90">
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="font-cairo text-[14px] font-bold text-white">
                {t('membersList.saveChanges')}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Standard Read Mode UI ──
  return (
    <View
      className="bg-surface-surfaceVariant/40 rounded-2xl border border-surface-border"
      style={{ padding: 16, gap: 12 }}>
      {/* ── Row 1: Name + (You) ── */}
      <View className="flex-row items-center gap-3">
        {/* Avatar */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#C8D5D0',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
          {member.avatarUri ? (
            <Image
              source={{ uri: member.avatarUri }}
              style={{ width: 44, height: 44 }}
              resizeMode="cover"
            />
          ) : (
            <Text className="font-cairo text-[18px] font-bold text-brand-primary">
              {member.initial}
            </Text>
          )}
        </View>
        <Text className="font-cairo text-[16px] font-bold text-text-primary">
          {member.fullName}
          {isCurrentUser && (
            <Text className="font-cairo text-[16px] font-normal text-text-secondary">
              {t('membersList.you', ' (You)')}
            </Text>
          )}
        </Text>
      </View>

      {/* ── Row 2: Role + Type Badges ── */}
      <View className="flex-row flex-wrap items-center gap-2">
        {/* Role Badge */}
        {isManager ? (
          <View className="rounded-full bg-brand-primary px-3.5 py-1">
            <Text className="font-cairo text-[12px] font-bold text-white">
              {t('membersList.manager')}
            </Text>
          </View>
        ) : (
          <View className="rounded-full bg-brand-amber-300 px-3.5 py-1">
            <Text className="font-cairo text-[12px] font-bold text-text-primary">
              {t('membersList.member')}
            </Text>
          </View>
        )}

        {/* Type Badge */}
        {isRegistered ? (
          <View className="flex-row items-center gap-1 rounded-full bg-brand-primary-container px-3 py-1">
            <Icon as={CheckCircle} size={13} className="text-brand-primary" />
            <Text className="font-cairo text-[12px] font-semibold text-brand-primary">
              {t('membersList.registeredUser')}
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center gap-1 rounded-full border border-surface-border bg-transparent px-3 py-1">
            <Icon as={Circle} size={13} className="text-text-secondary" />
            <Text className="font-cairo text-[12px] font-semibold text-text-secondary">
              {t('membersList.offlineMember')}
            </Text>
          </View>
        )}
      </View>

      {/* ── Row 3: Action Buttons (right-aligned) ── */}
      <View className="mt-1 flex-row flex-wrap items-center justify-end gap-2">
        {/* Preferences — outline */}
        <Pressable
          onPress={() => onPreferences(member.id)}
          className="rounded-full border border-surface-border bg-surface-surface px-3 py-1.5 active:opacity-70">
          <Text className="font-cairo text-[12px] font-semibold text-text-primary">
            {t('membersList.preferences')}
          </Text>
        </Pressable>

        {/* Edit — solid amber */}
        {isCurrentUserAdmin && (
          <Pressable
            onPress={() => onEdit(member.id)}
            className="rounded-full bg-brand-amber-300 px-3.5 py-1.5 active:opacity-70">
            <Text className="font-cairo text-[12px] font-bold text-text-primary">
              {t('membersList.edit')}
            </Text>
          </Pressable>
        )}

        {/* Conditional: Leave (only if current user is NOT Manager), Remove, or Promote */}
        {isCurrentUser && !isManager ? (
          <Pressable
            onPress={() => onLeave(member.id)}
            className="rounded-full bg-status-error px-3.5 py-1.5 active:opacity-70">
            <Text className="font-cairo text-[12px] font-bold text-white">
              {t('membersList.leave')}
            </Text>
          </Pressable>
        ) : !isCurrentUser && isCurrentUserAdmin ? (
          <>
            {isManager ? (
              <Pressable
                onPress={() => onDemote && onDemote(member.id)}
                className="rounded-full bg-brand-amber-300 px-3.5 py-1.5 active:opacity-70">
                <Text className="font-cairo text-[12px] font-bold text-text-primary">
                  {t('membersList.demote')}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => onPromote(member.id)}
                className="rounded-full bg-brand-amber-300 px-3.5 py-1.5 active:opacity-70">
                <Text className="font-cairo text-[12px] font-bold text-text-primary">
                  {t('membersList.promote')}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => onRemove(member.id)}
              className="rounded-full bg-status-error px-3.5 py-1.5 active:opacity-70">
              <Text className="font-cairo text-[12px] font-bold text-white">
                {t('membersList.remove')}
              </Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </View>
  );
}
