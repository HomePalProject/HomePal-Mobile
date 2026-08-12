import React from 'react';
import { View, ScrollView } from 'react-native';

export function PantrySkeleton() {
  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-spacing-16 pb-spacing-24">
        {/* Title Skeleton */}
        <View className="pt-spacing-12">
          <View
            className="mb-spacing-8 h-5 w-28 rounded-radius-small"
            style={{ backgroundColor: '#E4E1DC' }}
          />

          <View
            className="mb-spacing-20 h-3.5 w-40 rounded-radius-small"
            style={{ backgroundColor: '#E4E1DC' }}
          />
        </View>

        {/* Category Pills Skeleton */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 8,
            paddingBottom: 20,
          }}>
          {[1, 2, 3, 4].map((key) => (
            <View
              key={key}
              className="h-7 rounded-radius-full"
              style={{
                width: key === 4 ? 72 : 68,
                backgroundColor: '#E4E1DC',
              }}
            />
          ))}
        </ScrollView>

        {/* Grid Skeleton Cards */}
        <View className="flex-row flex-wrap justify-between gap-y-spacing-16">
          {[1, 2, 3, 4, 5, 6].map((key) => (
            <View
              key={key}
              className="p-spacing-12 w-[48%] rounded-radius-large"
              style={{
                backgroundColor: '#F8F7F4',
              }}>
              {/* Image Skeleton */}
              <View
                className="mb-spacing-12 h-28 w-full rounded-radius-medium"
                style={{
                  backgroundColor: '#E4E1DC',
                }}
              />

              {/* Name Skeleton */}
              <View
                className="mb-spacing-8 h-4 w-3/4 rounded-radius-small"
                style={{
                  backgroundColor: '#E4E1DC',
                }}
              />

              {/* Secondary text Skeleton */}
              <View
                className="mb-spacing-12 h-3 w-1/2 rounded-radius-small"
                style={{
                  backgroundColor: '#E4E1DC',
                }}
              />

              {/* Bottom row */}
              <View className="flex-row items-center justify-between">
                <View
                  className="h-6 w-16 rounded-radius-full"
                  style={{
                    backgroundColor: '#E4E1DC',
                  }}
                />

                <View
                  className="h-6 w-6 rounded-radius-full"
                  style={{
                    backgroundColor: '#E4E1DC',
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
