import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { Home } from 'lucide-react-native';

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="flex-col items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary-container">
            <Icon as={Home} size={32} className="text-brand-primary" />
          </View>
          <Text className="font-cairo text-[22px] font-bold text-text-primary">Dashboard</Text>
          <Text className="text-center font-cairo text-[15px] text-text-secondary">
            Your household overview will appear here. Track budgets, meals, and pantry at a glance.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
