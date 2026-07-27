import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router, Href, Stack } from 'expo-router';
import { useProfileStore } from '../../../store/useProfileStore';

export default function HomeScreen() {
  const { firstName, lastName, family } = useProfileStore();
  const user = {
    firstName,
    lastName,
    family,
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-surface-background p-spacing-16 pt-spacing-48">
        <Pressable
          onPress={() => router.push('/profile' as Href)}
          className="shadow-low flex-row items-center justify-between rounded-radius-medium border border-surface-border bg-surface-surface p-spacing-16">
          <View className="gap-spacing-4">
            <Text className="text-bodyLarge font-cairo font-bold text-text-primary">
              Welcome, {user.firstName}
            </Text>
            <Text className="text-caption font-cairo text-text-secondary">{user.family}</Text>
          </View>

          <View className="bg-brand-primaryContainer h-12 w-12 items-center justify-center rounded-radius-full">
            <Text className="text-body font-cairo font-bold text-brand-primary">
              {user.firstName[0]}
              {user.lastName[0]}
            </Text>
          </View>
        </Pressable>

        <View className="mt-spacing-24 flex-1 items-center justify-center">
          <Text className="text-body font-cairo text-text-disabled">Home Content</Text>
        </View>
      </View>
    </>
  );
}
