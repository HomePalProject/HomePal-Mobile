import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { Menu } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { useAppSelector, useAppDispatch } from '@/src/store';
import { openDrawer } from '@/src/store/slices/uiSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface TabHeaderProps {
  title?: string;
  onNotificationPress?: () => void;
}

export function TabHeader({ title = 'HomePal', onNotificationPress }: TabHeaderProps) {
  const dispatch = useAppDispatch();
  const { fullName, profileImageUri } = useAppSelector((state) => state.profile);
  const handleOpenDrawer = () => dispatch(openDrawer());
  const insets = useSafeAreaInsets();

  const firstInitial = fullName ? fullName.trim()[0]?.toUpperCase() : 'H';

  return (
    <View
      className="flex-row items-center justify-between border-b border-surface-divider bg-surface-surface px-6 pb-3 shadow-sm"
      style={{ paddingTop: Math.max(insets.top, 16) + 12 }}>
      {/* Left: Menu Drawer Icon + Avatar + Title */}
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={handleOpenDrawer}
          className="rounded-full p-1.5 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Open Navigation Drawer">
          <Icon as={Menu} size={24} className="text-brand-primary" />
        </Pressable>

        <Pressable
          onPress={handleOpenDrawer}
          className="border-brand-primary/20 h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-brand-primary-container active:opacity-70">
          {profileImageUri ? (
            <Image source={{ uri: profileImageUri }} className="h-full w-full" />
          ) : (
            <Text className="font-cairo text-[16px] font-bold text-brand-primary">
              {firstInitial}
            </Text>
          )}
        </Pressable>
        <Text className="font-cairo text-[18px] font-bold text-brand-primary">{title}</Text>
      </View>
    </View>
  );
}
