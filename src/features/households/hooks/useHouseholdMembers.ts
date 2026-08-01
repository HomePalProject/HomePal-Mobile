/**
 * useHouseholdMembers.ts
 * Logic hook for the Household Members management section.
 * Provides mock member data with roles, types, and action handlers.
 * Will be connected to GET /api/households/{id}/members and related endpoints.
 */
import { useState } from 'react';
import { toast } from '@/src/providers/ToastProvider';

export type HouseholdMemberRole = 'Manager' | 'Member';
export type HouseholdMemberType = 'Registered' | 'Offline';

export interface DetailedMember {
  id: string;
  fullName: string;
  initial: string;
  avatarUri: string | null;
  role: HouseholdMemberRole;
  type: HouseholdMemberType;
  isCurrentUser: boolean;
  gender?: string;
  dob?: string;
}

export interface AddOfflineMemberPayload {
  fullName: string;
  gender: string;
  dob: string;
}

export function useHouseholdMembers() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [members, setMembers] = useState<DetailedMember[]>([
    {
      id: '1',
      fullName: 'Mariam Essam2',
      initial: 'M',
      avatarUri: null,
      role: 'Manager',
      type: 'Registered',
      isCurrentUser: true,
    },
    {
      id: '2',
      fullName: 'Hamada',
      initial: 'H',
      avatarUri: null,
      role: 'Member',
      type: 'Offline',
      isCurrentUser: false,
      gender: 'Male',
      dob: '06/19/2003',
    },
  ]);

  const handleToggleAddForm = () => {
    setIsAddFormOpen((prev) => !prev);
  };

  const handleAddOfflineMember = (payload: AddOfflineMemberPayload) => {
    if (!payload.fullName.trim()) {
      toast.error('Validation Error', 'Full Name is required');
      return false;
    }

    const newMember: DetailedMember = {
      id: Date.now().toString(),
      fullName: payload.fullName.trim(),
      initial: payload.fullName.trim()[0]?.toUpperCase() || 'M',
      avatarUri: null,
      role: 'Member',
      type: 'Offline',
      isCurrentUser: false,
      gender: payload.gender,
      dob: payload.dob,
    };

    setMembers((prev) => [...prev, newMember]);
    setIsAddFormOpen(false);
    toast.success('Member Added!', `Added ${newMember.fullName} as an Offline Member.`);
    return true;
  };

  const handlePreferences = (memberId: string) => {
    console.log(`[useHouseholdMembers] Preferences for member ${memberId}`);
  };

  const handleEdit = (memberId: string) => {
    console.log(`[useHouseholdMembers] Edit member ${memberId}`);
  };

  const handlePromote = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: 'Manager' as HouseholdMemberRole } : m))
    );
    toast.success('Member Promoted', 'Member has been promoted to Manager.');
  };

  const handleLeave = (memberId: string) => {
    console.log(`[useHouseholdMembers] Leave household — member ${memberId}`);
    toast.error('Leave Household', 'You left the household.');
  };

  const handleRemove = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    toast.success('Member Removed', 'The member has been removed from the household.');
  };

  return {
    members,
    isAddFormOpen,
    onToggleAddForm: handleToggleAddForm,
    onAddOfflineMember: handleAddOfflineMember,
    onPreferences: handlePreferences,
    onEdit: handleEdit,
    onPromote: handlePromote,
    onLeave: handleLeave,
    onRemove: handleRemove,
  };
}
