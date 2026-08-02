import React from 'react';
import { useRouter } from 'expo-router';
import { useProfileStore } from '@/src/store/useProfileStore';
import { usePendingInvitations } from '@/src/features/households/hooks/usePendingInvitations';
import { PendingInvitationsScreen } from '@/src/features/households/screens/PendingInvitationsScreen';

export default function PendingInvitationsRoute() {
  const router = useRouter();
  const { fullName, profileImageUri } = useProfileStore();

  const {
    invitations,
    isLoading,
    isProcessingId,
    isEmpty,
    handleAccept,
    handleDecline,
    refreshInvitations,
  } = usePendingInvitations();

  // Derive user initials for header
  const safeFullName = fullName || '';
  const firstName = safeFullName.trim().split(/\s+/)[0] || 'U';
  const userInitials = firstName[0].toUpperCase();

  return (
    <PendingInvitationsScreen
      userInitials={userInitials}
      userAvatarUri={profileImageUri}
      onBack={() => router.back()}
      onNotificationPress={() => console.log('[Invitations] Notification pressed')}
      invitations={invitations}
      isLoading={isLoading}
      isProcessingId={isProcessingId}
      isEmpty={isEmpty}
      onAccept={handleAccept}
      onDecline={handleDecline}
      onRefresh={refreshInvitations}
    />
  );
}
