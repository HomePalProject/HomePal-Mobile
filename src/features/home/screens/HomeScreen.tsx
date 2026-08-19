import { useAppSelector } from '@/src/store';
import { Href, router, Stack } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation('home');
  const { fullName, family } = useAppSelector((state) => state.profile);

  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  const firstInitial = firstName ? firstName[0].toUpperCase() : '';
  const lastInitial = lastName ? lastName[0].toUpperCase() : '';

  const user = {
    firstName,
    firstInitial,
    lastInitial,
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
              {t('active.welcomeUser', { name: user.firstName })}
            </Text>
            <Text className="text-caption font-cairo text-text-secondary">{user.family}</Text>
          </View>

          <View className="h-12 w-12 items-center justify-center rounded-radius-full bg-brand-primary-container">
            <Text className="text-body font-cairo font-bold text-brand-primary">
              {user.firstInitial}
              {user.lastInitial}
            </Text>
          </View>
        </Pressable>

        <View className="mt-spacing-24 flex-1 items-center justify-center">
          <Text className="text-body font-cairo text-text-disabled">
            {t('active.homeContent', 'Home Content')}
          </Text>
        </View>
      </View>
    </>
  );
}
