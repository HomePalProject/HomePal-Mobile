import React from 'react';
import { View } from 'react-native';

export function ShoppingListSkeleton() {
  return (
    <View className="flex-1 px-spacing-16 pt-spacing-8">
      {/* Summary Bar Skeleton */}
      <View className="mb-spacing-12 p-spacing-12 flex-row rounded-radius-large border border-surface-border bg-surface-surface-variant">
        <View className="flex-1 items-center gap-spacing-4">
          <View className="h-3 w-16 rounded-radius-small bg-surface-border" />
          <View className="h-5 w-8 rounded-radius-small bg-surface-border" />
        </View>
        <View className="w-px bg-surface-border" />
        <View className="flex-1 items-center gap-spacing-4">
          <View className="h-3 w-16 rounded-radius-small bg-surface-border" />
          <View className="h-5 w-8 rounded-radius-small bg-surface-border" />
        </View>
        <View className="w-px bg-surface-border" />
        <View className="flex-1 items-center gap-spacing-4">
          <View className="h-3 w-16 rounded-radius-small bg-surface-border" />
          <View className="h-5 w-12 rounded-radius-small bg-surface-border" />
        </View>
      </View>

      {/* Item Card Skeletons */}
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          className="p-spacing-12 mb-spacing-8 rounded-radius-large border border-surface-border bg-surface-surface">
          <View className="flex-row items-start gap-spacing-8">
            <View className="mt-0.5 h-5 w-5 rounded-radius-small bg-surface-border" />
            <View className="flex-1 gap-spacing-4">
              <View className="h-4 w-32 rounded-radius-small bg-surface-border" />
              <View className="mt-spacing-4 flex-row gap-spacing-4">
                <View className="h-5 w-16 rounded-radius-full bg-surface-border" />
                <View className="h-5 w-20 rounded-radius-full bg-surface-border" />
              </View>
            </View>
            <View className="flex-row gap-spacing-4">
              <View className="h-7 w-7 rounded-radius-medium bg-surface-border" />
              <View className="h-7 w-7 rounded-radius-medium bg-surface-border" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
