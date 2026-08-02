import { useState, useEffect, useCallback } from 'react';
import { invitationService } from '@/src/services/api/invitation.service';
import { HouseholdInvitationResponse } from '@/src/types/api';
import { toast } from '@/src/providers/ToastProvider';
import { ApiError } from '@/src/services/api/client';

export function usePendingInvitations() {
  const [invitations, setInvitations] = useState<HouseholdInvitationResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await invitationService.getMyInvitations();
      setInvitations(data || []);
    } catch (error: any) {
      console.error('[usePendingInvitations] Error fetching invitations:', error);
      toast.error('Failed to load', 'Could not load your pending invitations.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleAccept = async (id: string) => {
    setIsProcessingId(id);
    try {
      await invitationService.acceptInvitation(id);
      toast.success('Invitation Accepted', 'You have successfully joined the household!');

      // Instantly remove accepted invitation from local state
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    } catch (error: any) {
      const message =
        error instanceof ApiError ? error.message : 'Could not accept the invitation.';
      toast.error('Error', message);
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleDecline = async (id: string) => {
    setIsProcessingId(id);
    try {
      await invitationService.declineInvitation(id);
      toast.info('Invitation Declined', 'The invitation has been removed.');

      // Instantly remove declined invitation from local state
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    } catch (error: any) {
      const message =
        error instanceof ApiError ? error.message : 'Could not decline the invitation.';
      toast.error('Error', message);
    } finally {
      setIsProcessingId(null);
    }
  };

  return {
    invitations,
    isLoading,
    isProcessingId,
    isEmpty: invitations.length === 0 && !isLoading,
    handleAccept,
    handleDecline,
    refreshInvitations: fetchInvitations,
  };
}
