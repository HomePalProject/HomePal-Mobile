import { Stack } from 'expo-router';
import ProfileScreen from '../src/features/profile/screens/ProfileScreen';

export default function ProfileRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileScreen />
    </>
  );
}
