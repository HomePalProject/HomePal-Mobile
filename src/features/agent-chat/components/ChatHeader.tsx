import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Bell, Menu } from 'lucide-react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useDrawerStore } from '@/src/store/useDrawerStore';
import { useTranslation } from 'react-i18next';

export interface ChatHeaderProps {
  onNotificationPress?: () => void;
}

export function ChatHeader({ onNotificationPress }: ChatHeaderProps) {
  const { theme } = useTheme();
  const { t } = useTranslation('agentChat');

  const handleOpenDrawer = () => {
    useDrawerStore.getState().openDrawer();
  };

  return (
    <View className="flex-row items-center justify-between border-b border-surface-border bg-surface-background px-spacing-16 py-spacing-16 shadow-sm">
      {/* Left: Menu Hamburger + HomePal Brand Logo */}
      <View className="flex-row items-center gap-spacing-8">
        <Pressable
          onPress={handleOpenDrawer}
          className="p-spacing-6 rounded-radius-full active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={t('header.openDrawer', 'Open Navigation Drawer')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Menu size={24} color={theme.colors.brand.primary} />
        </Pressable>
        <Image
          source={require('@/src/assets/images/chat-header-logo.png')}
          style={{ width: 96, height: 32 }}
          resizeMode="contain"
        />
      </View>

      {/* Center: AI Assistant Text */}
      <Text className="font-cairo text-xl font-bold uppercase tracking-wider text-text-primary">
        {t('header.title', 'AI ASSISTANT')}
      </Text>

      {/* Right: Bell/Notification Button */}
      <Pressable
        onPress={onNotificationPress}
        accessibilityRole="button"
        accessibilityLabel={t('header.notifications', 'Notifications')}
        className="active:opacity-75">
        <Bell size={24} color={theme.colors.text.secondary} />
      </Pressable>
    </View>
  );
}
