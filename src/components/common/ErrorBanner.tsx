import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { AlertCircle } from 'lucide-react-native';

interface ErrorBannerProps {
  message?: string | null;
  error?: string | null;
}

/**
 * Reusable error banner with fade-in/out animation.
 * Replaces the copy-pasted error banners across auth and onboarding screens.
 */
export function ErrorBanner({ message, error }: ErrorBannerProps) {
  const displayMessage = message || error;
  if (!displayMessage) return null;

  return (
    <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(150)}>
      <View className="border-status-error/30 bg-status-error/10 flex-row items-center gap-2.5 rounded-[12px] border p-3.5">
        <Icon as={AlertCircle} size={20} className="shrink-0 text-status-error" />
        <Text className="flex-1 font-cairo text-[13px] font-medium leading-[18px] text-status-error">
          {displayMessage}
        </Text>
      </View>
    </Animated.View>
  );
}
