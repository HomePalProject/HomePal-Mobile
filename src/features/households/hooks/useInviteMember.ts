import { useState, useEffect, useCallback } from 'react';
import { invitationService } from '@/src/services/api/invitation.service';
import { HouseholdInvitationResponse } from '@/src/types/api';
import { toast } from '@/src/providers/ToastProvider';
import { ApiError } from '@/src/services/api/client';

export type SentInvitation = HouseholdInvitationResponse;

export function useInviteMember() {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState<string | undefined>();
  const [isSending, setIsSending] = useState(false);
  const [isLoadingSent, setIsLoadingSent] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const [sentInvitations, setSentInvitations] = useState<SentInvitation[]>([]);

  const fetchSentInvitations = useCallback(async () => {
    setIsLoadingSent(true);
    try {
      const data = await invitationService.getSentInvitations();
      setSentInvitations(data || []);
    } catch (error: any) {
      console.warn(
        '[useInviteMember] Gracefully handling sent invitations fetch (no household or 404):',
        error?.message || error
      );
      setSentInvitations([]);
    } finally {
      setIsLoadingSent(false);
    }
  }, []);

  useEffect(() => {
    fetchSentInvitations();
  }, [fetchSentInvitations]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (inputError) setInputError(undefined);
  };

  const validate = (): boolean => {
    if (!inputValue.trim()) {
      setInputError('Please enter an email or username');
      return false;
    }
    return true;
  };

  const handleSendInvite = async () => {
    if (!validate()) return;
    setIsSending(true);
    const targetRecipient = inputValue.trim();

    try {
      await invitationService.sendInvitation({ invitedUserNameOrEmail: targetRecipient });
      toast.success('Invitation Sent!', `Invitation sent to ${targetRecipient}`);
      setInputValue('');
      fetchSentInvitations();
    } catch (error: any) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'An unexpected error occurred. Please try again.';
      toast.error('Failed to Send', message);
    } finally {
      setIsSending(false);
    }
  };

  const handleCancelInvite = async (id: string) => {
    setCancelingId(id);
    try {
      await invitationService.cancelInvitation(id);
      toast.success('Invitation Cancelled', 'The invitation has been cancelled.');

      // UX Requirement: DO NOT remove from local state. Map over array & update status to 'Canceled'
      setSentInvitations((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: 'Canceled' } : inv))
      );
    } catch (error: any) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Could not cancel invitation. Please try again.';
      toast.error('Failed to Cancel', message);
    } finally {
      setCancelingId(null);
    }
  };

  return {
    inputValue,
    inputError,
    isSending,
    isLoadingSent,
    cancelingId,
    sentInvitations,
    onInputChange: handleInputChange,
    onSendInvite: handleSendInvite,
    onCancelInvite: handleCancelInvite,
    onRefresh: fetchSentInvitations,
  };
}
