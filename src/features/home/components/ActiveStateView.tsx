/**
 * ActiveStateView.tsx
 * Dumb UI component for the Active Household Dashboard (State B).
 * All logic is managed by useActiveDashboard.ts.
 */
import React from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { Home, MapPin, Users, Send, Inbox, Plus, LucideIcon } from 'lucide-react-native';
import { useRouter, Href } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { cn } from '@/src/utils';
import { HouseholdMember, HouseholdStats } from '../hooks/useActiveDashboard';
import { HouseholdMembersList } from './HouseholdMembersList';
import { DetailedMember } from '@/src/features/households/hooks/useHouseholdMembers';
import { type HouseholdMembersListProps } from './HouseholdMembersList';

// ─── Props ────────────────────────────────────────────────────────────────────
export interface ActiveStateViewProps {
  firstName: string;
  householdName: string;
  location: string;
  stats: HouseholdStats;
  // Simple member list (for the quick-glance section — kept for future use)
  members: HouseholdMember[];
  onManageMembers: () => void;
  onInviteMember: () => void;
  // Detailed members management (HouseholdMembersList)
  detailedMembers: DetailedMember[];
  isAddFormOpen?: boolean;
  onToggleAddForm?: () => void;
  onAddOfflineMember: (payload: any) => void;
  onPreferences: (id: string) => void;
  onEditMember: (id: string) => void;
  onPromote: (id: string) => void;
  onLeave: (id: string) => void;
  onRemove: (id: string) => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Horizontally scrollable stat card */
interface StatCardProps {
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  label: string;
  value: number;
  onPress?: () => void;
}

function StatCard({ icon, iconBgClass, iconColorClass, label, value, onPress }: StatCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-36 flex-shrink-0 rounded-2xl bg-white p-4 active:opacity-75"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}>
      {/* Icon container — rounded-full matching reference */}
      <View className={cn('mb-3 h-11 w-11 items-center justify-center rounded-full', iconBgClass)}>
        <Icon as={icon} size={22} className={iconColorClass} />
      </View>
      <Text className="font-cairo text-[12px] font-semibold leading-[16px] tracking-[0.02em] text-text-secondary">
        {label}
      </Text>
      <Text className="text-on-surface font-cairo text-[20px] font-semibold leading-[28px]">
        {value}
      </Text>
    </Pressable>
  );
}

/** Single member row in the members list */
interface MemberRowProps {
  member: HouseholdMember;
}

function MemberRow({ member }: MemberRowProps) {
  const isManager = member.role === 'Manager';
  return (
    <View
      className="flex-row items-center justify-between rounded-2xl bg-white px-4 py-3"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
      }}>
      {/* Left: Avatar + Name */}
      <View className="flex-row items-center gap-3">
        {/* Avatar — no border, clean circle */}
        <View className="h-12 w-12 overflow-hidden rounded-full bg-brand-primary-container">
          {member.avatarUri ? (
            <Image
              source={{ uri: member.avatarUri }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="font-cairo text-[17px] font-bold text-brand-primary">
                {member.initial}
              </Text>
            </View>
          )}
        </View>

        {/* Name & Username */}
        <View style={{ gap: 1 }}>
          <Text className="text-on-surface font-cairo text-[15px] font-semibold leading-[22px]">
            {member.fullName}
          </Text>
          <Text className="font-cairo text-[13px] leading-[18px] text-text-disabled">
            {member.username}
          </Text>
        </View>
      </View>

      {/* Role Badge */}
      {isManager ? (
        <View className="rounded-full bg-brand-primary px-4 py-1.5">
          <Text className="font-cairo text-[12px] font-bold leading-[16px] tracking-[0.02em] text-white">
            Manager
          </Text>
        </View>
      ) : (
        <View className="rounded-full border border-surface-border px-4 py-1.5">
          <Text className="font-cairo text-[12px] font-semibold leading-[16px] tracking-[0.02em] text-text-secondary">
            Member
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ActiveStateView({
  firstName,
  householdName,
  location,
  stats,
  onInviteMember,
  onManageMembers,
  detailedMembers,
  isAddFormOpen,
  onToggleAddForm,
  onAddOfflineMember,
  onPreferences,
  onEditMember,
  onPromote,
  onLeave,
  onRemove,
}: ActiveStateViewProps) {
  const router = useRouter();

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1 bg-surface-background"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 120,
          gap: 32,
        }}
        showsVerticalScrollIndicator={false}>
        {/* ── 1. Greeting Section ── */}
        <View style={{ gap: 16 }}>
          <View style={{ gap: 4 }}>
            <Text className="text-on-surface font-cairo text-[28px] font-bold leading-[36px]">
              Good Morning, {firstName}!
            </Text>
            <Text className="font-cairo text-[16px] leading-[24px] text-text-secondary">
              Welcome back to your digital home hub.
            </Text>
          </View>

          {/* ── Primary Residence Card ── */}
          <View
            className="overflow-hidden rounded-2xl"
            style={{
              backgroundColor: '#356859',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 12,
              elevation: 6,
            }}>
            {/* Atmospheric glow orb */}
            <View
              className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10"
              style={{ backgroundColor: '#9cd1bf' }}
            />

            <View style={{ padding: 20 }}>
              {/* PRIMARY RESIDENCE label */}
              <View className="mb-3 flex-row items-center gap-2">
                <Icon as={Home} size={18} color="#9cd1bf" />
                <Text className="font-cairo text-[12px] font-bold uppercase tracking-[0.12em] text-slate-100">
                  Primary Residence
                </Text>
              </View>

              {/* Household Name — matches reference size */}
              <Text className="font-cairo text-[22px] font-bold leading-[30px] text-slate-100">
                {householdName}
              </Text>

              {/* Location */}
              <View className="mt-3 flex-row items-center gap-1.5">
                <Icon as={MapPin} size={14} color="#9cd1bf" />
                <Text className="font-cairo text-[14px] leading-[20px] text-slate-100">
                  {location}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── 2. Quick Stats — Horizontal ScrollView ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingVertical: 8 }}>
          <StatCard
            icon={Users}
            iconBgClass="bg-blue-50"
            iconColorClass="text-status-info"
            label="Total Members"
            value={stats.totalMembers}
            onPress={onManageMembers}
          />
          <StatCard
            icon={Send}
            iconBgClass="bg-yellow-50"
            iconColorClass="text-status-warning"
            label="Sent Invitations"
            value={stats.sentInvitations}
            onPress={onInviteMember}
          />
          <StatCard
            icon={Inbox}
            iconBgClass="bg-blue-50"
            iconColorClass="text-status-info"
            label="Received Invitations"
            value={stats.receivedInvitations}
          />
        </ScrollView>

        {/* ── 3. Household Members Management ── */}
        <HouseholdMembersList
          members={detailedMembers}
          isAddFormOpen={isAddFormOpen}
          onToggleAddForm={onToggleAddForm}
          onAddOfflineMember={onAddOfflineMember}
          onPreferences={onPreferences}
          onEdit={onEditMember}
          onPromote={onPromote}
          onLeave={onLeave}
          onRemove={onRemove}
        />
      </ScrollView>

      {/* ── FAB: Invite Member (floats above tab bar) ── */}
      <Pressable
        onPress={onInviteMember}
        className="absolute bottom-6 right-6 z-50 flex-row items-center gap-2 rounded-full bg-brand-primary pl-5 pr-6 active:bg-brand-primary-pressed"
        style={{
          height: 56,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
        }}
        accessibilityRole="button"
        accessibilityLabel="Invite Member">
        <Icon as={Plus} size={22} color="#fff" />
        <Text className="font-cairo text-[14px] font-bold leading-[20px] tracking-[0.01em] text-white">
          Invite Member
        </Text>
      </Pressable>
    </View>
  );
}
