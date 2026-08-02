import React from 'react';
import { useRouter } from 'expo-router';
import { useProfileStore } from '@/src/store/useProfileStore';
import { useInviteMember } from '@/src/features/households/hooks/useInviteMember';
import { InviteScreen } from '@/src/features/households/screens/InviteScreen';

export default function InviteRoute() {
  const router = useRouter();
  const { fullName, profileImageUri } = useProfileStore();

  const {
    inputValue,
    inputError,
    isSending,
    cancelingId,
    sentInvitations,
    onInputChange,
    onSendInvite,
    onCancelInvite,
    onRefresh,
  } = useInviteMember();

  // Derive user initials for the header avatar
  const safeFullName = fullName || '';
  const firstName = safeFullName.trim().split(/\s+/)[0] || 'U';
  const userInitials = firstName[0].toUpperCase();

  return (
    <InviteScreen
      userInitials={userInitials}
      userAvatarUri={profileImageUri}
      onBack={() => router.back()}
      onNotificationPress={() => console.log('[Invite] Notification pressed')}
      inputValue={inputValue}
      inputError={inputError}
      isSending={isSending}
      onInputChange={onInputChange}
      onSendInvite={onSendInvite}
      sentInvitations={sentInvitations}
      cancelingId={cancelingId}
      onCancelInvite={onCancelInvite}
      onRefresh={onRefresh}
    />
  );
}
