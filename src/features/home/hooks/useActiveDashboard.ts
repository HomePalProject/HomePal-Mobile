/**
 * useActiveDashboard.ts
 * Logic hook for the Active Household Dashboard (State B).
 * Manages mock data for stats and members — will be replaced by API calls.
 */

export type MemberRole = 'Manager' | 'Member';

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
  onManageMembers: () => void;
  onInviteMember: () => void;
}

export function useActiveDashboard(): ActiveDashboardData {
  // ─── Mock Data (replace with API calls) ───────────────────────────────────
  const householdName = 'The Hassan Family';
  const location = 'Cairo, Egypt';

  const stats: HouseholdStats = {
    totalMembers: 4,
    sentInvitations: 1,
    receivedInvitations: 0,
  };

  const members: HouseholdMember[] = [
    {
      id: '1',
      fullName: 'Nora Hassan',
      username: '@nora_h',
      role: 'Manager',
      avatarUri: null,
      initial: 'N',
    },
    {
      id: '2',
      fullName: 'Ahmed Hassan',
      username: '@ahmed_h',
      role: 'Member',
      avatarUri: null,
      initial: 'A',
    },
    {
      id: '3',
      fullName: 'Sara Hassan',
      username: '@sara_h',
      role: 'Member',
      avatarUri: null,
      initial: 'S',
    },
  ];

  const onManageMembers = () => {
    console.log('[ActiveDashboard] Navigate to Manage Members');
  };

  const onInviteMember = () => {
    console.log('[ActiveDashboard] Navigate to Invite Member');
  };

  return {
    householdName,
    location,
    stats,
    members,
    onManageMembers,
    onInviteMember,
  };
}
