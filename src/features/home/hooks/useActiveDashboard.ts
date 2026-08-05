import { useState, useEffect, useCallback } from 'react';
import { HouseholdDto } from '@/src/types/api';
import { invitationService } from '@/src/services/api/invitation.service';

export type MemberRole = 'Household Manager' | 'Household Member';

export interface HouseholdMember {
  id: string;
  fullName: string;
  username: string;
  role: MemberRole;
  /** URI for avatar image, or null to show initials */
  avatarUri: string | null;
  /** First character of the name used as avatar fallback */
  initial: string;
}

export interface HouseholdStats {
  totalMembers: number;
  sentInvitations: number;
  receivedInvitations: number;
}

export interface ActiveDashboardData {
  householdName: string;
  location: string;
  stats: HouseholdStats;
  members: HouseholdMember[];
  onInviteMember: () => void;
}

export function useActiveDashboard(householdData?: HouseholdDto | null): ActiveDashboardData {
  // Derive dynamic household name and location from real backend response when available
  const householdName = householdData?.name || 'My Household';
  const location =
    householdData?.city && householdData?.governorate
      ? `${householdData.city}, ${householdData.governorate}`
      : householdData?.city || householdData?.governorate || 'Cairo, Egypt';

  const [sentCount, setSentCount] = useState<number>(0);
  const [receivedCount, setReceivedCount] = useState<number>(0);

  const fetchStats = useCallback(async () => {
    try {
      const [sentList, receivedList] = await Promise.all([
        invitationService.getSentInvitations(),
        invitationService.getMyInvitations(),
      ]);

      const pendingSent = (sentList || []).filter(
        (inv) => inv.status === 'Pending' || inv.status === 'pending'
      ).length;
      setSentCount(pendingSent);

      const pendingReceived = (receivedList || []).filter(
        (inv) => inv.status === 'Pending' || inv.status === 'pending'
      ).length;
      setReceivedCount(pendingReceived);
    } catch (error) {
      console.warn('[useActiveDashboard] Failed to fetch invitation stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const totalMembers = Number(householdData?.membersCount) || 1;

  const stats: HouseholdStats = {
    totalMembers,
    sentInvitations: sentCount,
    receivedInvitations: receivedCount,
  };

  const members: HouseholdMember[] = [];

  const onInviteMember = () => {
    console.log('[ActiveDashboard] Navigate to Invite Member');
  };

  return {
    householdName,
    location,
    stats,
    members,
    onInviteMember,
  };
}
