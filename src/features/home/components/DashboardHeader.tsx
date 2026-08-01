import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { Bell } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';

export interface DashboardHeaderProps {
  firstInitial: string;
  profileImageUri: string | null;
  onAvatarPress?: () => void;
  onNotificationPress?: () => void;
}

export function DashboardHeader({
  firstInitial,
  profileImageUri,
  onAvatarPress,
  onNotificationPress,
}: DashboardHeaderProps) {
  return (
    <View className="h-16 flex-row items-center justify-between border-b border-surface-divider bg-surface-surface px-spacing-16 shadow-sm">
      {/* Left side: Avatar + Brand Name */}
      <View className="gap-spacing-12 flex-row items-center">
        <Pressable
          onPress={onAvatarPress}
          className="border-brand-primary/20 h-10 w-10 items-center justify-center overflow-hidden rounded-radius-full border bg-brand-primary-container">
          {profileImageUri ? (
            <Image source={{ uri: profileImageUri }} className="h-full w-full" />
          ) : (
            <Text className="text-body font-cairo font-bold text-brand-primary">
              {firstInitial}
            </Text>
          )}
        </Pressable>
        <Text className="text-bodyLarge font-cairo font-bold text-brand-primary">HomePal</Text>
      </View>

      {/* Right side: Notification Bell */}
      <Pressable
        onPress={onNotificationPress}
        className="bg-surface-surfaceVariant h-10 w-10 items-center justify-center rounded-radius-full">
        <Icon as={Bell} size={20} className="text-brand-primary" />
        {/* Unread dot indicator */}
        <View className="absolute right-[11px] top-[11px] h-2.5 w-2.5 rounded-radius-full border border-surface-surface bg-brand-accent" />
      </Pressable>
    </View>
  );
}
