import { useState, useEffect } from 'react';
import { useProfileStore } from '@/src/store/useProfileStore';
import { useRouter } from 'expo-router';

export function useDashboard() {
  const router = useRouter();
  const { fullName, profileImageUri, fetchProfile, isLoading } = useProfileStore();
  const [hasHousehold, setHasHousehold] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCreateHousehold = () => {
    console.log('[Dashboard] Navigating to Create Household screen...');
  };

  const handleViewInvitations = () => {
    console.log('[Dashboard] Navigating to Pending Invitations screen...');
  };

  // 🔥 The Fix: Added a safety fallback in case fullName is null/undefined
  const safeFullName = fullName || '';
  const nameParts = safeFullName.trim().split(/\s+/);
  const firstName = nameParts[0] || 'User';
  const firstInitial = firstName ? firstName[0].toUpperCase() : 'U';

  return {
    isLoading,
    hasHousehold,
    fullName,
    firstName,
    firstInitial,
    profileImageUri,
    onCreateHousehold: handleCreateHousehold,
    onViewInvitations: handleViewInvitations,
    setHasHousehold,
  };
}
