import React from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  Home,
  MapPin,
  Users,
  Send,
  Inbox,
  Plus,
  Settings,
  Printer,
  LucideIcon,
} from 'lucide-react-native';
import { useRouter, Href } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { cn } from '@/src/utils';
import { useAppSelector } from '@/src/store';
import { HouseholdMember, HouseholdStats } from '../hooks/useActiveDashboard';
import { useOverview } from '@/src/features/overview/hooks/useOverview';
import { useTheme } from '@/src/providers/ThemeProvider';
import { AnimatedPressable } from '@/src/components/ui/animated-pressable';
import { OverviewStatCards } from './OverviewStatCards';
import { OverviewCharts } from './OverviewCharts';
import { generateOverviewReportHtml } from '@/src/utils/overviewReportHtml';

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
  members,
  onRefresh,
  isRefreshing = false,
}: ActiveStateViewProps) {
  const { isManager } = useAppSelector((state) => state.profile);
  const router = useRouter();
  const { theme } = useTheme();
  const { overviewData, isLoading, isFetching, refetch } = useOverview();

  const handlePrint = async () => {
    if (!overviewData) return;
    try {
      const html = generateOverviewReportHtml(overviewData);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Household Overview Report',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      console.error('Failed to generate report PDF', error);
    }
  };

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
            colors={[theme.colors.brand.primary]}
            tintColor={theme.colors.brand.primary}
            progressViewOffset={50}
          />
        }
        showsVerticalScrollIndicator={false}>
        {/* ── 1. Greeting Section ── */}
        <View style={{ gap: 16 }}>
          <View style={{ gap: 4 }}>
            <Text className="font-cairo text-[28px] font-bold leading-[36px] text-text-primary">
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
              {/* PRIMARY RESIDENCE label + Settings Button (Managers only) */}
              <View className="mb-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Icon as={Home} size={18} color="#9cd1bf" />
                  <Text className="font-cairo text-[12px] font-bold uppercase tracking-[0.12em] text-slate-100">
                    Primary Residence
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

        {/* ── 3. Household Overview Section ── */}
        <View className="gap-y-spacing-16 rounded-radius-large border border-surface-border bg-surface-surface p-spacing-16">
          <View style={{ gap: 4 }}>
            <Text className="font-cairo text-lg font-bold text-text-primary">
              Household Overview
            </Text>
            <Text className="font-cairo text-sm text-text-secondary">
              Your household activity, spending, shopping and inventory at a glance.
            </Text>
          </View>

          <View className="flex-row gap-x-spacing-8">
            <AnimatedPressable
              onPress={() => refetch()}
              disabled={isLoading || isFetching}
              pressScale={0.93}
              hapticStyle="light"
              className="flex-1 items-center justify-center rounded-radius-medium bg-brand-accent py-spacing-8 disabled:opacity-50">
              <Text className="font-cairo text-sm font-bold text-brand-primary">
                {isFetching ? 'Refreshing...' : 'Refresh'}
              </Text>
            </AnimatedPressable>

            <AnimatedPressable
              onPress={handlePrint}
              disabled={isLoading || isFetching || !overviewData}
              pressScale={0.93}
              hapticStyle="light"
              className="flex-1 flex-row items-center justify-center gap-x-spacing-8 rounded-radius-medium border border-surface-border bg-surface-surface py-spacing-8 disabled:opacity-50">
              <Icon as={Printer} size={16} className="text-text-primary" />
              <Text className="font-cairo text-sm font-semibold text-text-primary">Print</Text>
            </AnimatedPressable>
          </View>
        </View>

        {isLoading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color={theme.colors.brand.primary} />
          </View>
        ) : (
          overviewData && (
            <View className="gap-y-spacing-24">
              <OverviewStatCards kpis={overviewData.kpis} />
              <OverviewCharts data={overviewData} />
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}
