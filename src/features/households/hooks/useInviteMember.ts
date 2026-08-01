/**
 * useInviteMember.ts
 * Logic hook for the "Invite to Household" screen.
 * Manages form state, sent invitations list, and simulates API calls.
 * Will be connected to POST /api/households/invitations and related endpoints.
 */
import { useState } from 'react';
import { toast } from '@/src/providers/ToastProvider';

export type InvitationStatus = 'Pending' | 'Accepted' | 'Declined';

export interface SentInvitation {
  id: string;
  recipient: string; // email or username
  status: InvitationStatus;
}

export function useInviteMember() {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState<string | undefined>();
  const [isSending, setIsSending] = useState(false);

  // Mock sent invitations — will be fetched from GET /api/households/invitations
  const [sentInvitations, setSentInvitations] = useState<SentInvitation[]>([
    { id: '1', recipient: 'me1929@fayoum.edu.eg', status: 'Pending' },
    { id: '2', recipient: 'Mariam2', status: 'Pending' },
  ]);

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
    try {
      // Simulate POST /api/households/invitations
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newInvitation: SentInvitation = {
        id: Date.now().toString(),
        recipient: inputValue.trim(),
        status: 'Pending',
      };
      setSentInvitations((prev) => [newInvitation, ...prev]);
      setInputValue('');
      toast.success('Invitation Sent!', `Invitation sent to ${newInvitation.recipient}`);
    } catch {
      toast.error('Failed to Send', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCancelInvite = async (id: string) => {
    // Simulate DELETE /api/households/invitations/{id}
    setSentInvitations((prev) => prev.filter((inv) => inv.id !== id));
    toast.success('Invitation Cancelled', 'The invitation has been cancelled.');
  };

  const handleRefresh = () => {
    console.log('[useInviteMember] Refresh — connect to GET /api/households/invitations');
  };

  return {
    inputValue,
    inputError,
    isSending,
    sentInvitations,
    onInputChange: handleInputChange,
    onSendInvite: handleSendInvite,
    onCancelInvite: handleCancelInvite,
    onRefresh: handleRefresh,
  };
}
