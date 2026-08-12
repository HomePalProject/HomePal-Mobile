import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export function AIScanLoadingState() {
  return (
    <View className="gap-spacing-20 flex-1 items-center justify-center py-spacing-48">
      <ActivityIndicator size="large" color="#206B59" />
      <Text className="text-body text-center font-cairo font-bold text-brand-primary">
        Scanning items via camera AI...
      </Text>
    </View>
  );
}
