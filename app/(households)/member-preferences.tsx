import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { MemberPreferencesScreen } from '@/src/features/households/screens/MemberPreferencesScreen';

export default function MemberPreferencesRoute() {
  const { memberId } = useLocalSearchParams<{ memberId: string }>();

  // Ensure memberId is always a string, fallback to empty string if undefined (though it shouldn't be)
  return <MemberPreferencesScreen memberId={memberId || ''} />;
}
