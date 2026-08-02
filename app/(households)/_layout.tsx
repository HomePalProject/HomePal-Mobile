import { Stack } from 'expo-router';

export default function HouseholdsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create" />
      <Stack.Screen name="invitations" />
      <Stack.Screen name="invite" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
