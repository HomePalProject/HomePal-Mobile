import { useState, useEffect, useCallback } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { router } from 'expo-router';
import { toast } from '@/src/providers/ToastProvider';
import { memberService } from '@/src/services/api/member.service';

import { useAppSelector } from '@/src/store';
import { HouseholdMemberResponse } from '@/src/types/api';
import { ApiError } from '@/src/services/api/client';

export type HouseholdMemberRole = 'Household Manager' | 'Household Member';
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

export interface SaveEditMemberPayload {
  fullName: string;
  gender: string;
  dob: string;
}

const formatIsoDate = (dob?: string): string | null => {
  if (!dob) return null;
  if (dob.includes('/')) {
    const parts = dob.split('/');
    if (parts.length === 3) {
      const month = parts[0].padStart(2, '0');
      const day = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
  }
  return dob;
};

export function useHouseholdMembers() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [members, setMembers] = useState<DetailedMember[]>([]);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const { user } = useAppSelector((state) => state.auth);
  const currentFullName = useAppSelector((state) => state.profile.fullName);

  const mapResponseToDetailedMember = useCallback(
    (res: HouseholdMemberResponse): DetailedMember => {
      const isSelf =
        (res as any).isCurrentUser ||
        (user?.id && res.userId === user.id) ||
        (currentFullName &&
          res.fullName &&
          res.fullName.trim().toLowerCase() === currentFullName.trim().toLowerCase());

      const rawRole = String(res.role || '')
        .toLowerCase()
        .trim();
      const isManagerRole =
        rawRole.includes('manager') ||
        rawRole.includes('admin') ||
        rawRole.includes('owner') ||
        rawRole === '1';

      const roleStr: HouseholdMemberRole = isManagerRole ? 'Household Manager' : 'Household Member';
      const typeStr: HouseholdMemberType = res.isRegistered ? 'Registered' : 'Offline';

      const trimmedName = res.fullName ? res.fullName.trim() : 'Household Member';
      const initial = trimmedName[0]?.toUpperCase() || 'M';

      return {
        id: res.id,
        fullName: trimmedName,
        initial,
        avatarUri: null,
        role: roleStr,
        type: typeStr,
        isCurrentUser: !!isSelf,
        gender:
          res.gender !== null && res.gender !== undefined
            ? String(res.gender) === '1'
              ? 'Male'
              : String(res.gender) === '2'
                ? 'Female'
                : String(res.gender)
            : undefined,
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
        let mapped = data.map((m) => mapResponseToDetailedMember(m));

        setMembers(mapped);
      } else {
        // If the API returns no members, set the list to empty (usually means the user has no household)
        setMembers([]);
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

    // Listen for dashboard refresh events (e.g., after household creation)
    const subscription = DeviceEventEmitter.addListener('REFRESH_DASHBOARD', () => {
      fetchMembers();
    });

    return () => subscription.remove();
  }, [fetchMembers]);

  const handleToggleAddForm = () => {
    setIsAddFormOpen((prev) => !prev);
  };

  const handleAddOfflineMember = async (payload: AddOfflineMemberPayload) => {
    if (!payload.fullName.trim()) {
      toast.error('Validation Error', 'Full Name is required');
      return false;
    }

    try {
      const genderVal = payload.gender === 'Male' || payload.gender === '1' ? 1 : 2;
      const formattedDob = formatIsoDate(payload.dob);

      await memberService.addOfflineMember({
        fullName: payload.fullName.trim(),
        gender: genderVal,
        dateOfBirth: formattedDob,
      });

      toast.success('Member Added!', `Added ${payload.fullName.trim()} as an Offline Member.`);
      setIsAddFormOpen(false);
      fetchMembers();
      return true;
    } catch (error: any) {
      const message =
        error instanceof ApiError
          ? error.message
          : error?.message || 'Failed to add offline member.';
      toast.error('Error', message);
      return false;
    }
  };

  const handlePreferences = (memberId: string) => {
    router.push({ pathname: '/(households)/member-preferences', params: { memberId } });
  };

  const handleEdit = (memberId: string) => {
    setEditingMemberId((prev) => (prev === memberId ? null : memberId));
  };

  const handleCancelEdit = () => {
    setEditingMemberId(null);
  };

  const handleSaveEdit = async (memberId: string, payload: SaveEditMemberPayload) => {
    if (!payload.fullName.trim()) {
      toast.error('Validation Error', 'Full Name is required');
      return false;
    }

    const targetMember = members.find((m) => m.id === memberId);
    if (!targetMember) return false;

    try {
      const genderVal = payload.gender === 'Male' || payload.gender === '1' ? 1 : 2;
      const formattedDob = formatIsoDate(payload.dob);

      await memberService.updateMember(memberId, {
        fullName: payload.fullName.trim(),
        gender: genderVal,
        dateOfBirth: formattedDob,
        role: targetMember.role,
      });

      toast.success('Member Updated!', `Updated details for ${payload.fullName.trim()}.`);
      setEditingMemberId(null);
      fetchMembers();
      return true;
    } catch (error: any) {
      const message =
        error instanceof ApiError ? error.message : error?.message || 'Failed to update member.';
      toast.error('Error', message);
      return false;
    }
  };

  const handlePromote = async (memberId: string) => {
    const targetMember = members.find((m) => m.id === memberId);
    if (!targetMember) return;

    try {
      const genderVal = targetMember.gender === 'Male' || targetMember.gender === '1' ? 1 : 2;
      await memberService.updateMember(memberId, {
        fullName: targetMember.fullName,
        gender: genderVal,
        dateOfBirth: formatIsoDate(targetMember.dob),
        role: 'Household Manager',
      });

      toast.success('Member Promoted!', `${targetMember.fullName} has been promoted to Manager.`);
      fetchMembers();
    } catch (error: any) {
      const message =
        error instanceof ApiError ? error.message : error?.message || 'Failed to promote member.';
      toast.error('Error', message);
    }
  };

  const handleDemote = async (memberId: string) => {
    const targetMember = members.find((m) => m.id === memberId);
    if (!targetMember) return;

    try {
      const genderVal = targetMember.gender === 'Male' || targetMember.gender === '1' ? 1 : 2;
      await memberService.updateMember(memberId, {
        fullName: targetMember.fullName,
        gender: genderVal,
        dateOfBirth: formatIsoDate(targetMember.dob),
        role: 'Household Member',
      });

      toast.success('Member Demoted!', `${targetMember.fullName} has been demoted to Member.`);
      fetchMembers();
    } catch (error: any) {
      const message =
        error instanceof ApiError ? error.message : error?.message || 'Failed to demote member.';
      toast.error('Error', message);
    }
  };

  const handleLeave = async (memberId: string) => {
    try {
      await memberService.removeMember(memberId);
      toast.info('Left Household', 'You have left the household.');
      fetchMembers();
    } catch (error: any) {
      const message =
        error instanceof ApiError ? error.message : error?.message || 'Failed to leave household.';
      toast.error('Error', message);
    }
  };

  const handleRemove = async (memberId: string) => {
    const targetMember = members.find((m) => m.id === memberId);
    try {
      await memberService.removeMember(memberId);
      toast.success(
        'Member Removed',
        `${targetMember?.fullName || 'Household Member'} has been removed from the household.`
      );
      fetchMembers();
    } catch (error: any) {
      const message =
        error instanceof ApiError ? error.message : error?.message || 'Failed to remove member.';
      toast.error('Error', message);
    }
  };

  return {
    members,
    isLoadingMembers,
    isAddFormOpen,
    editingMemberId,
    onToggleAddForm: handleToggleAddForm,
    onAddOfflineMember: handleAddOfflineMember,
    onPreferences: handlePreferences,
    onEdit: handleEdit,
    onCancelEdit: handleCancelEdit,
    onSaveEdit: handleSaveEdit,
    onPromote: handlePromote,
    onDemote: handleDemote,
    onLeave: handleLeave,
    onRemove: handleRemove,
    refreshMembers: fetchMembers,
  };
}
