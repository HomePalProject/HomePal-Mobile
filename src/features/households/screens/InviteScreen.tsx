import React from 'react';
import { View, ScrollView, Pressable, Image, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Mail, Send } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { ProTipCard } from '@/src/components/ui/pro-tip-card';
import { SentInvitation } from '../hooks/useInviteMember';

// ─── Props ────────────────────────────────────────────────────────────────────
export interface InviteScreenProps {
  // Header
  userInitials: string;
  userAvatarUri: string | null;
  onBack: () => void;
  onNotificationPress: () => void;
  // Form
  inputValue: string;
  inputError: string | undefined;
  isSending: boolean;
  onInputChange: (value: string) => void;
  onSendInvite: () => void;
  // Invitations list
  sentInvitations: SentInvitation[];
  cancelingId?: string | null;
  onCancelInvite: (id: string) => void;
  onRefresh: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface InvitationCardProps {
  invitation: SentInvitation;
  cancelingId?: string | null;
  onCancel: (id: string) => void;
}

function InvitationCard({ invitation, cancelingId, onCancel }: InvitationCardProps) {
  const recipient =
    invitation.invitedEmail || invitation.invitedUserName || invitation.token || 'User';
  const isCanceled =
    invitation.status === 'Canceled' ||
    invitation.status === 'Cancelled' ||
    invitation.status === 'Declined';
  const isCanceling = cancelingId === invitation.id;

  return (
    <View
      className="bg-surface-card rounded-2xl border border-surface-border p-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      }}>
      <Text className="text-on-surface font-cairo text-[14px] font-semibold leading-[20px]">
        To: {recipient}
      </Text>
      <Text className="mt-0.5 font-cairo text-[13px] leading-[18px] text-text-secondary">
        Status: {invitation.status}
      </Text>

      {/* Conditionally render Action Button vs Muted Canceled Badge */}
      {isCanceled ? (
        <View className="mt-3 w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-100 py-2.5">
          <Text className="font-cairo text-[13px] font-bold text-gray-500">
            {invitation.status}
          </Text>
        </View>
      ) : (
        <Pressable
          onPress={() => onCancel(invitation.id)}
          disabled={isCanceling}
          className="mt-3 w-full flex-row items-center justify-center gap-2 rounded-xl py-3 active:opacity-80"
          style={{ backgroundColor: isCanceling ? '#E57373' : '#D32F2F' }}
          accessibilityRole="button"
          accessibilityLabel={`Cancel invitation to ${recipient}`}>
          {isCanceling ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={{ fontFamily: 'Cairo', fontSize: 14, fontWeight: '700', color: '#fff' }}>
                Cancelling...
              </Text>
            </>
          ) : (
            <Text style={{ fontFamily: 'Cairo', fontSize: 14, fontWeight: '700', color: '#fff' }}>
              Cancel
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function InviteScreen({
  userInitials,
  userAvatarUri,
  onBack,
  onNotificationPress,
  inputValue,
  inputError,
  isSending,
  onInputChange,
  onSendInvite,
  sentInvitations,
  cancelingId,
  onCancelInvite,
  onRefresh,
}: InviteScreenProps) {
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
          <Icon as={ArrowLeft} size={24} className="text-on-surface" />
        </Pressable>

        {/* Title */}
        <Text className="text-on-surface font-cairo text-[16px] font-bold">
          Invite to Household
        </Text>

        {/* Right: Bell + Avatar */}
        <View className="flex-row items-center gap-3">
          <Pressable onPress={onNotificationPress} className="p-1 active:opacity-60">
            <Icon as={Bell} size={24} className="text-brand-primary" />
          </Pressable>
          <Pressable
            onPress={onBack}
            className="h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-primary-container">
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
        contentContainerStyle={{ padding: 20, gap: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* ── Hero Section ── */}
        <View style={{ gap: 6 }}>
          <Text className="font-cairo text-[24px] font-bold leading-[32px] text-brand-primary">
            Grow your circle
          </Text>
          <Text className="font-cairo text-[14px] leading-[22px] text-text-secondary">
            Send an invitation to a family member or roommate using their email or HomePal username.
          </Text>
        </View>

        {/* Hero Illustration */}
        <View className="w-full overflow-hidden rounded-2xl">
          <Image
            source={require('@/assets/images/invite-illustration.png')}
            className="w-full"
            style={{ aspectRatio: 16 / 9 }}
            resizeMode="cover"
          />
        </View>

        {/* ── Invite Form Card ── */}
        <View
          className="bg-surface-card rounded-2xl border border-surface-border"
          style={{
            padding: 20,
            gap: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
          }}>
          {/* Label */}
          <Text className="font-cairo text-[13px] font-semibold text-text-secondary">
            Email or Username
          </Text>

          {/* Input with mail icon */}
          <View
            className="flex-row items-center gap-2 rounded-xl bg-gray-200 px-4"
            style={{ height: 52 }}>
            <Icon as={Mail} size={18} className="text-text-disabled" />
            <TextInput
              value={inputValue}
              onChangeText={onInputChange}
              placeholder="e.g., nora@example.com or @nora"
              placeholderTextColor="#A8A29B"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="done"
              onSubmitEditing={onSendInvite}
              editable={!isSending}
              style={{
                flex: 1,
                fontFamily: 'Cairo',
                fontSize: 14,
                color: '#1e1b17',
              }}
            />
          </View>

          {/* Validation error */}
          {inputError && (
            <Text className="font-cairo text-[12px] text-status-error">{inputError}</Text>
          )}

          {/* Send Invitation Button */}
          <Pressable
            onPress={onSendInvite}
            disabled={isSending}
            className="w-full flex-row items-center justify-center gap-2 rounded-xl active:opacity-80"
            style={{
              height: 52,
              backgroundColor: isSending ? '#8CA296' : '#356859',
            }}
            accessibilityRole="button"
            accessibilityLabel="Send Invitation">
            {isSending ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text
                  style={{ fontFamily: 'Cairo', fontSize: 15, fontWeight: '700', color: '#fff' }}>
                  Sending...
                </Text>
              </>
            ) : (
              <>
                <Icon as={Send} size={18} color="#fff" />
                <Text
                  style={{ fontFamily: 'Cairo', fontSize: 15, fontWeight: '700', color: '#fff' }}>
                  Send Invitation
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {/* ── Sent Invitations Section ── */}
        {sentInvitations.length > 0 && (
          <View style={{ gap: 12 }}>
            {/* Section Header */}
            <View className="flex-row items-center justify-between">
              <Text className="text-on-surface font-cairo text-[18px] font-bold leading-[26px]">
                Household Sent Invitations
              </Text>
              <Pressable
                onPress={onRefresh}
                className="rounded-full px-3 py-1.5 active:opacity-70"
                style={{ backgroundColor: '#FDBA5A' }}>
                <Text
                  style={{
                    fontFamily: 'Cairo',
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#734a00',
                  }}>
                  Refresh
                </Text>
              </Pressable>
            </View>

            {/* Invitation Cards */}
            {sentInvitations.map((inv) => (
              <InvitationCard
                key={inv.id}
                invitation={inv}
                cancelingId={cancelingId}
                onCancel={onCancelInvite}
              />
            ))}
          </View>
        )}

        {/* ── Pro Tip Card ── */}
        <ProTipCard
          description="Once they accept the invite, you'll be able to share groceries, chore lists, and household bills instantly."
          className="bg-brand-primary-container/15 border-brand-primary-container"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
