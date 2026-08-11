import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { User, Menu } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { openDrawer } from '@/src/store/slices/uiSlice';

interface PantryHeaderProps {
  onProfilePress?: () => void;
}

export function PantryHeader({ onProfilePress }: PantryHeaderProps) {
  const dispatch = useAppDispatch();
  const { fullName, profileImageUri } = useAppSelector((state) => state.profile);

  // Extract first initial
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const firstInitial = firstName ? firstName[0].toUpperCase() : '';

  const handleOpenDrawer = () => {
    dispatch(openDrawer());
  };

  return (
    <View className="h-16 flex-row items-center justify-between bg-surface-background px-spacing-16">
      <View className="flex-row items-center gap-spacing-8">
        {/* Hamburger Menu Drawer Trigger */}
        <Pressable
          onPress={handleOpenDrawer}
          className="p-spacing-6 rounded-radius-full active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Open Navigation Drawer"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon as={Menu} size={24} className="text-brand-primary" />
        </Pressable>
        <Text className="font-cairo text-xl font-bold text-text-primary">Pantry</Text>
      </View>

      {/* Profile Button / User Avatar */}
      <Pressable
        onPress={onProfilePress}
        className="border-brand-primary/20 h-10 w-10 items-center justify-center overflow-hidden rounded-radius-full border bg-brand-primary-container active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel="Profile">
        {profileImageUri ? (
          <Image source={{ uri: profileImageUri }} className="h-full w-full" />
        ) : firstInitial ? (
          <Text className="text-body font-cairo font-bold text-brand-primary">{firstInitial}</Text>
        ) : (
          <Icon as={User} size={20} className="text-brand-primary" />
        )}
      </Pressable>
    </View>
  );
}
