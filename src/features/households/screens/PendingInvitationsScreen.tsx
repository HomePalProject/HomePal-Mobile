import React from 'react';
import { View, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check, X, Inbox, Home } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { ProTipCard } from '@/src/components/ui/pro-tip-card';
import { HouseholdInvitationResponse } from '@/src/types/api';
import { useDrawerStore } from '@/src/store/useDrawerStore';

export interface PendingInvitationsScreenProps {
  userInitials: string;
  userAvatarUri: string | null;
  onBack: () => void;
  onNotificationPress: () => void;
  invitations: HouseholdInvitationResponse[];
  isLoading: boolean;
  isProcessingId: string | null;
  isEmpty: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onRefresh: () => void;
}

interface ReceivedInvitationCardProps {
  invitation: HouseholdInvitationResponse;
  isProcessing: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

function ReceivedInvitationCard({
  invitation,
  isProcessing,
  onAccept,
  onDecline,
}: ReceivedInvitationCardProps) {
  const formattedDate = invitation.createdAt
    ? new Date(invitation.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <View
      className="rounded-2xl border border-surface-border bg-surface-surface p-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      }}>
      {/* Household & Sender Info Header */}
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-brand-primary-container">
          <Icon as={Home} size={20} className="text-brand-primary" />
        </View>
        <View className="flex-1">
          <Text className="font-cairo text-[16px] font-bold leading-[22px] text-text-primary">
            {invitation.householdName || 'Household Invitation'}
          </Text>
          <Text className="font-cairo text-[13px] leading-[18px] text-text-secondary">
            Invited by:{' '}
            <Text className="font-semibold text-text-primary">
              {invitation.invitedByName || 'Household Manager'}
            </Text>
          </Text>
        </View>
      </View>

      {formattedDate ? (
        <Text className="mt-2 font-cairo text-[12px] text-text-disabled">
          Received on {formattedDate}
        </Text>
      ) : null}

      {/* Action Buttons: Accept vs Decline */}
      <View className="mt-4 flex-row items-center gap-2.5">
        <Pressable
          onPress={() => onAccept(invitation.id)}
          disabled={isProcessing}
          className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-3 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Accept Invitation">
          {isProcessing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Icon as={Check} size={18} color="#fff" />
              <Text className="font-cairo text-[14px] font-bold text-white">Accept</Text>
            </>
          )}
        </Pressable>

        <Pressable
          onPress={() => onDecline(invitation.id)}
          disabled={isProcessing}
          className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border border-surface-border bg-surface-surface py-3 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Decline Invitation">
          {isProcessing ? (
            <ActivityIndicator size="small" color="#D9534F" />
          ) : (
            <>
              <Icon as={X} size={18} className="text-status-error" />
              <Text className="font-cairo text-[14px] font-bold text-text-primary">Decline</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export function PendingInvitationsScreen({
  userInitials,
  userAvatarUri,
  onBack,
  onNotificationPress,
  invitations,
  isLoading,
  isProcessingId,
  isEmpty,
  onAccept,
  onDecline,
  onRefresh,
}: PendingInvitationsScreenProps) {
  const { openDrawer } = useDrawerStore();

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View className="h-16 flex-row items-center justify-between bg-surface-surface px-5 shadow-sm">
        {/* Back button */}
        <Pressable
          onPress={onBack}
          className="active:bg-surface-surfaceVariant rounded-full p-2"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Icon as={ArrowLeft} size={24} className="text-text-primary" />
        </Pressable>

        {/* Title */}
        <Text className="font-cairo text-[16px] font-bold text-text-primary">
          Received Invitations
        </Text>

        {/* Right: Avatar (Drawer trigger) */}
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={openDrawer}
            className="h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-primary-container active:opacity-70">
            {userAvatarUri ? (
              <Image source={{ uri: userAvatarUri }} className="h-full w-full" />
            ) : (
              <Text className="font-cairo text-[15px] font-bold text-brand-primary">
                {userInitials}
              </Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, gap: 20 }}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={{ gap: 6 }}>
          <Text className="font-cairo text-[24px] font-bold leading-[32px] text-brand-primary">
            Pending Invitations
          </Text>
          <Text className="font-cairo text-[14px] leading-[22px] text-text-secondary">
            Review and accept household invitations sent to you by family or roommates.
          </Text>
        </View>

        {/* Conditional Loading State */}
        {isLoading ? (
          <View style={{ marginVertical: 48, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#356859" />
            <Text className="mt-3 font-cairo text-[14px] text-text-secondary">
              Checking for received invitations...
            </Text>
          </View>
        ) : isEmpty ? (
          /* Empty State Card */
          <View className="my-6 items-center rounded-2xl border border-surface-border bg-surface-surface p-8 shadow-sm">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-primary-container">
              <Icon as={Inbox} size={32} className="text-brand-primary" />
            </View>
            <Text className="mt-4 font-cairo text-[18px] font-bold text-text-primary">
              No Received Invitations
            </Text>
            <Text className="mt-1 text-center font-cairo text-[14px] leading-[22px] text-text-secondary">
              You're all caught up! You don't have any pending household invitations at the moment.
            </Text>
            <Pressable
              onPress={onRefresh}
              className="mt-5 rounded-full bg-brand-amber-300 px-6 py-2.5 active:opacity-80">
              <Text className="font-cairo text-[13px] font-bold text-text-primary">
                Check Again
              </Text>
            </Pressable>
          </View>
        ) : (
          /* List of Pending Invitations */
          <View style={{ gap: 14 }}>
            <View className="flex-row items-center justify-between">
              <Text className="font-cairo text-[16px] font-bold text-text-primary">
                Inbox ({invitations.length})
              </Text>
              <Pressable
                onPress={onRefresh}
                className="bg-brand-accent/20 rounded-full px-3 py-1 active:opacity-70">
                <Text className="font-cairo text-[12px] font-bold text-brand-accent">Refresh</Text>
              </Pressable>
            </View>

            {invitations.map((inv) => (
              <ReceivedInvitationCard
                key={inv.id}
                invitation={inv}
                isProcessing={isProcessingId === inv.id}
                onAccept={onAccept}
                onDecline={onDecline}
              />
            ))}
          </View>
        )}

        {/* Pro Tip */}
        <ProTipCard
          description="Once you accept an invitation, you will automatically gain access to that household's shared hub, chore lists, and member management."
          className="bg-brand-primary-container/15 mt-2 border-brand-primary-container"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
