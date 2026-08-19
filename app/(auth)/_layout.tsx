import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
      }}>
      <Stack.Screen name="welcome" />
      {/* login + register live in the (forms) group; they share a layout and swap
          in place rather than pushing over one another. */}
      <Stack.Screen name="(forms)" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
