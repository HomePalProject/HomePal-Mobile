import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { UtensilsCrossed } from 'lucide-react-native';
import { TabHeader } from '@/src/components/navigation/TabHeader';

export default function MealsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['left', 'right']}>
      <TabHeader title="Meal Plans" />
      <View className="flex-1 items-center justify-center px-6">
        <View className="flex-col items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary-container">
            <Icon as={UtensilsCrossed} size={32} className="text-brand-primary" />
          </View>
          <Text className="font-cairo text-[22px] font-bold text-text-primary">Meal Plans</Text>
          <Text className="text-center font-cairo text-[15px] text-text-secondary">
            AI-powered meal plans and recipes tailored to your household dietary preferences will
            appear here.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
