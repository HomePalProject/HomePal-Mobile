import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { Menu } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { useAppDispatch } from '@/src/store';
import { openDrawer } from '@/src/store/slices/uiSlice';

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
}: DashboardHeaderProps) {
  const dispatch = useAppDispatch();

  const handleOpenDrawer = () => {
    if (onAvatarPress) {
      onAvatarPress();
    } else {
      dispatch(openDrawer());
    }
  };

  return (
    <View className="h-16 flex-row items-center justify-between bg-surface-surface px-6 shadow-sm">
      {/* Left side: Menu Drawer Icon + Avatar + Brand Name */}
      <View className="flex-row items-center gap-3">
        {/* Menu Icon Button */}
        <Pressable
          onPress={handleOpenDrawer}
          className="rounded-full p-1.5 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Open Navigation Drawer">
          <Icon as={Menu} size={24} className="text-brand-primary" />
        </Pressable>

        {/* User Avatar */}
        <Pressable
          onPress={handleOpenDrawer}
          className="border-brand-primary/20 h-10 w-10 items-center justify-center overflow-hidden rounded-radius-full border bg-brand-primary-container active:opacity-70">
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
    </View>
  );
}
