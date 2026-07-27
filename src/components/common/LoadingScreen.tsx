import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { Home } from 'lucide-react-native';

interface LoadingScreenProps {
  message?: string;
}

/**
 * Full-screen branded loading indicator.
 * Used during bootstrapAuth and other global loading states.
 */
export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      className="flex-1 items-center justify-center bg-surface-background">
      <View className="flex-col items-center gap-6">
        {/* Logo */}
        <View className="h-[80px] w-[80px] items-center justify-center rounded-[24px] bg-brand-primary shadow-lg">
          <Icon as={Home} size={48} className="text-white" />
        </View>
        <Text className="font-cairo text-[28px] font-bold tracking-tight text-brand-primary">
          HomePal
        </Text>
        <ActivityIndicator size="large" color="#356859" />
        <Text className="font-cairo text-[14px] text-text-secondary">{message}</Text>
      </View>
    </Animated.View>
  );
}
