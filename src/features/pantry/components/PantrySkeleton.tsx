import React from 'react';
import { View, ScrollView } from 'react-native';
import { Skeleton } from '@/src/components/ui/skeleton';

export function PantrySkeleton() {
  return (
    <View className="flex-1 bg-surface-background">
      <View className="py-spacing-8">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {[1, 2, 3, 4, 5].map((key) => (
            <Skeleton
              key={key}
              className="h-9 rounded-radius-full"
              style={{ width: key === 1 ? 50 : key % 2 === 0 ? 80 : 100 }}
            />
          ))}
        </ScrollView>
      </View>

      <View className="flex-row items-center gap-spacing-8 px-spacing-16 py-spacing-8">
        <Skeleton className="h-11 flex-1 rounded-radius-large" />
        <Skeleton className="h-11 w-11 rounded-radius-full" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 32,
        }}>
        {[1, 2, 3].map((rowKey) => (
          <View key={rowKey} className="mb-[16px] flex-row justify-between">
            {[1, 2].map((colKey) => (
              <View
                key={`${rowKey}-${colKey}`}
                className="w-[48%] rounded-radius-large border border-surface-border bg-surface-surface p-2 shadow-sm">
                <Skeleton className="mb-2 h-28 w-full rounded-radius-medium" />
                <Skeleton className="mb-2 h-4 w-3/4 rounded-radius-small" />
                <Skeleton className="mb-2 h-3 w-1/2 rounded-radius-small" />
                <View className="flex-row items-center justify-between">
                  <Skeleton className="h-6 w-16 rounded-radius-full" />
                  <Skeleton className="h-6 w-6 rounded-radius-full" />
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
