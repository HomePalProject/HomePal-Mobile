import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShopScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-surface-background">
      <Text className="text-h3 font-cairo text-text-secondary">Shop Screen</Text>
    </SafeAreaView>
  );
}
