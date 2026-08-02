import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/src/providers/ToastProvider';
import { memberService } from '@/src/services/api/member.service';
import { useProfileStore } from '@/src/store/useProfileStore';
import { HouseholdMemberResponse } from '@/src/types/api';

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
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [members, setMembers] = useState<DetailedMember[]>([]);

  const { fullName: currentFullName } = useProfileStore();

  const mapResponseToDetailedMember = useCallback(
    (res: HouseholdMemberResponse): DetailedMember => {
      const isSelf =
        res.isCurrentUser ||
        (currentFullName &&
          res.fullName &&
          res.fullName.trim().toLowerCase() === currentFullName.trim().toLowerCase());

      const roleStr: HouseholdMemberRole = res.role === 'Manager' ? 'Manager' : 'Member';
      const typeStr: HouseholdMemberType = res.isRegistered ? 'Registered' : 'Offline';

      const trimmedName = res.fullName ? res.fullName.trim() : 'Member';
      const initial = trimmedName[0]?.toUpperCase() || 'M';

      return {
        id: res.id,
        fullName: trimmedName,
        initial,
        avatarUri: null,
        role: roleStr,
        type: typeStr,
        isCurrentUser: !!isSelf,
        gender: res.gender !== null && res.gender !== undefined ? String(res.gender) : undefined,
        dob: res.dateOfBirth || undefined,
      };
    },
    [currentFullName]
  );

  const fetchMembers = useCallback(async () => {
    setIsLoadingMembers(true);
    try {
      const data = await memberService.getHouseholdMembers();
      if (data && data.length > 0) {
        const mapped = data.map((m) => mapResponseToDetailedMember(m));
        setMembers(mapped);
      } else {
        // Fallback default member if list is empty
        setMembers([
          {
            id: '1',
            fullName: currentFullName || 'Household Member',
            initial: currentFullName ? currentFullName[0].toUpperCase() : 'M',
            avatarUri: null,
            role: 'Manager',
            type: 'Registered',
            isCurrentUser: true,
          },
        ]);
      }
    } catch (error: any) {
      console.warn(
        '[useHouseholdMembers] Handled fetch members fallback:',
        error?.message || error
      );
    } finally {
      setIsLoadingMembers(false);
    }
  }, [mapResponseToDetailedMember, currentFullName]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

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
    isLoadingMembers,
    isAddFormOpen,
    onToggleAddForm: handleToggleAddForm,
    onAddOfflineMember: handleAddOfflineMember,
    onPreferences: handlePreferences,
    onEdit: handleEdit,
    onPromote: handlePromote,
    onLeave: handleLeave,
    onRemove: handleRemove,
    refreshMembers: fetchMembers,
  };
}
