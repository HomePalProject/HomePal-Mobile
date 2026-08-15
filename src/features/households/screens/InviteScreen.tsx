import React from 'react';
import { View, ScrollView, Pressable, Image, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Send } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { BackButton } from '@/src/components/ui/back-button';
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
  const isAccepted = invitation.status === 'Accepted';
  const isInactive =
    isAccepted ||
    invitation.status === 'Canceled' ||
    invitation.status === 'Cancelled' ||
    invitation.status === 'Declined';
  const isCanceling = cancelingId === invitation.id;

  return (
    <View
      className="rounded-2xl border border-surface-border bg-surface-surface p-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      }}>
      <Text className="font-cairo text-[14px] font-semibold leading-[20px] text-text-primary">
        To: {recipient}
      </Text>
      <Text className="mt-0.5 font-cairo text-[13px] leading-[18px] text-text-secondary">
        Status: {invitation.status}
      </Text>

      {/* Conditionally render Action Button vs Muted Badge */}
      {isInactive ? (
        <View
          className={`mt-3 w-full items-center justify-center rounded-xl border py-2.5 ${
            isAccepted
              ? 'border-brand-primary/20 bg-brand-primary-container'
              : 'bg-surface-variant border-surface-border'
          }`}>
          <Text
            className={`font-cairo text-[13px] font-bold ${
              isAccepted ? 'text-brand-primary' : 'text-text-secondary'
            }`}>
            {invitation.status}
          </Text>
        </View>
      ) : (
        <Pressable
          onPress={() => onCancel(invitation.id)}
          disabled={isCanceling}
          className={`mt-3 w-full flex-row items-center justify-center gap-2 rounded-xl bg-status-error py-3 active:opacity-80 ${isCanceling ? 'opacity-70' : ''}`}
          accessibilityRole="button"
          accessibilityLabel={`Cancel invitation to ${recipient}`}>
          {isCanceling ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text className="font-cairo text-[14px] font-bold text-white">Cancelling...</Text>
            </>
          ) : (
            <Text className="font-cairo text-[14px] font-bold text-white">Cancel</Text>
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
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['bottom', 'left', 'right']}>
      {/* ── Header ── */}
      <View
        className="flex-row items-center justify-between border-b border-surface-divider bg-surface-surface px-5 pb-3 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 16) + 12 }}>
        {/* Back button */}
        <BackButton onPress={onBack} />

        {/* Title */}
        <Text className="font-cairo text-[16px] font-bold text-text-primary">
          Invite to Household
        </Text>

        {/* Right: Avatar */}
        <View className="flex-row items-center gap-3">
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
            source={require('@/src/assets/images/invite-illustration.png')}
            className="w-full"
            style={{ aspectRatio: 16 / 9 }}
            resizeMode="cover"
          />
        </View>

        {/* ── Invite Form Card ── */}
        <View
          className="rounded-2xl border border-surface-border bg-surface-surface"
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
            className="bg-surface-variant flex-row items-center gap-2 rounded-xl px-4"
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
              className="flex-1 font-cairo text-[14px] text-text-primary"
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
            className={`h-[52px] w-full flex-row items-center justify-center gap-2 rounded-xl bg-brand-primary active:opacity-80 ${isSending ? 'opacity-50' : ''}`}
            accessibilityRole="button"
            accessibilityLabel="Send Invitation">
            {isSending ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text className="font-cairo text-[15px] font-bold text-white">Sending...</Text>
              </>
            ) : (
              <>
                <Icon as={Send} size={18} color="#fff" />
                <Text className="font-cairo text-[15px] font-bold text-white">Send Invitation</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* ── Sent Invitations Section ── */}
        {sentInvitations.length > 0 && (
          <View style={{ gap: 12 }}>
            {/* Section Header */}
            <View className="flex-row items-center justify-between">
              <Text className="font-cairo text-[18px] font-bold leading-[26px] text-text-primary">
                Household Sent Invitations
              </Text>
              <Pressable
                onPress={onRefresh}
                className="rounded-full bg-brand-amber-300 px-3 py-1.5 active:opacity-70">
                <Text className="font-cairo text-[12px] font-bold text-text-primary">Refresh</Text>
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
