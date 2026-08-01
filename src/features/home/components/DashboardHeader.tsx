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
    <View className="h-16 flex-row items-center justify-between bg-surface-surface px-6 shadow-sm">
      {/* Left side: Avatar + Brand Name */}
      <View className="flex-row items-center gap-4">
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

      {/* Right side: Notification Bell — plain icon matching reference */}
      <Pressable
        onPress={onNotificationPress}
        className="items-center justify-center p-2 active:opacity-60"
        accessibilityRole="button"
        accessibilityLabel="Notifications">
        <Icon as={Bell} size={26} className="text-brand-primary" />
        {/* Unread dot indicator */}
        <View className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-accent" />
      </Pressable>
    </View>
  );
}
