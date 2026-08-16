import React from 'react';
import { View, ScrollView, Pressable, Image, RefreshControl } from 'react-native';
import { Home, MapPin, Users, Send, Inbox, Plus, Settings, LucideIcon } from 'lucide-react-native';
import { useRouter, Href } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { cn } from '@/src/utils';
import { useAppSelector } from '@/src/store';
import { HouseholdMember, HouseholdStats } from '../hooks/useActiveDashboard';
import { useTranslation } from 'react-i18next';

// ─── Props ────────────────────────────────────────────────────────────────────
export interface ActiveStateViewProps {
  firstName: string;
  householdName: string;
  location: string;
  stats: HouseholdStats;
  // Simple member list (for the quick-glance section — kept for future use)
  members: HouseholdMember[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
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
      className="w-36 flex-shrink-0 rounded-2xl bg-surface-surface p-4 active:opacity-75"
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
      <Text className="font-cairo text-[20px] font-semibold leading-[28px] text-text-primary">
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
  const { t } = useTranslation('home');
  const isManager = member.role === 'Household Manager';
  return (
    <View
      className="flex-row items-center justify-between rounded-2xl bg-surface-surface px-4 py-3"
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
          <Text className="font-cairo text-[15px] font-semibold leading-[22px] text-text-primary">
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
            {t('active.manager')}
          </Text>
        </View>
      ) : (
        <View className="rounded-full border border-surface-border px-4 py-1.5">
          <Text className="font-cairo text-[12px] font-semibold leading-[16px] tracking-[0.02em] text-text-secondary">
            {t('active.member')}
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
  members,
  onRefresh,
  isRefreshing = false,
}: ActiveStateViewProps) {
  const { isManager } = useAppSelector((state) => state.profile);
  const router = useRouter();
  const { t } = useTranslation('home');

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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#356859']}
            tintColor="#356859"
            progressViewOffset={50}
          />
        }
        showsVerticalScrollIndicator={false}>
        {/* ── 1. Greeting Section ── */}
        <View style={{ gap: 16 }}>
          <View style={{ gap: 4 }}>
            <Text className="font-cairo text-[28px] font-bold leading-[36px] text-text-primary">
              {t('active.goodMorning', { firstName })}
            </Text>
            <Text className="font-cairo text-[16px] leading-[24px] text-text-secondary">
              {t('active.welcomeBack')}
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
              className="absolute -end-8 -top-8 h-32 w-32 rounded-full opacity-10"
              style={{ backgroundColor: '#9cd1bf' }}
            />

            <View style={{ padding: 20 }}>
              {/* PRIMARY RESIDENCE label + Settings Button (Managers only) */}
              <View className="mb-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Icon as={Home} size={18} color="#9cd1bf" />
                  <Text className="font-cairo text-[12px] font-bold uppercase tracking-[0.12em] text-slate-100">
                    {t('active.primaryResidence')}
                  </Text>
                </View>

                {isManager && (
                  <Pressable
                    onPress={() => router.push('/(households)/settings' as Href)}
                    className="rounded-full bg-white/15 p-2 active:bg-white/30"
                    accessibilityRole="button"
                    accessibilityLabel="Household Settings">
                    <Icon as={Settings} size={18} color="#ffffff" />
                  </Pressable>
                )}
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
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingVertical: 8 }}>
          <StatCard
            icon={Users}
            iconBgClass="bg-brand-primary-container"
            iconColorClass="text-brand-primary"
            label="Total Members"
            value={stats.totalMembers}
          />
          <StatCard
            icon={Send}
            iconBgClass="bg-brand-accent-container"
            iconColorClass="text-brand-accent"
            label="Sent Invitations"
            value={stats.sentInvitations}
            onPress={onInviteMember}
          />
          <StatCard
            icon={Inbox}
            iconBgClass="bg-brand-primary-container"
            iconColorClass="text-brand-primary"
            label="Received Invitations"
            value={stats.receivedInvitations}
          />
        </ScrollView> */}
      </ScrollView>
    </View>
  );
}
