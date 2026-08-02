import React from 'react';
import { useRouter } from 'expo-router';
import { useProfileStore } from '@/src/store/useProfileStore';
import { useCreateHousehold } from '@/src/features/households/hooks/useCreateHousehold';
import { CreateHouseholdScreen } from '@/src/features/households/screens/CreateHouseholdScreen';

export default function CreateHouseholdRoute() {
  const router = useRouter();
  const { fullName, profileImageUri } = useProfileStore();
  const { formData, errors, isLoading, onChangeField, onSubmit } = useCreateHousehold();

  // Extract initials for the profile avatar in the header
  const safeFullName = fullName || '';
  const nameParts = safeFullName.trim().split(/\s+/);
  const firstName = nameParts[0] || 'User';
  const initials = firstName ? firstName[0].toUpperCase() : 'U';

  return (
    <CreateHouseholdScreen
      formData={formData}
      errors={errors}
      isLoading={isLoading}
      onChangeField={onChangeField}
      onSubmit={onSubmit}
      onBack={() => router.back()}
      userAvatarUri={profileImageUri}
      userInitials={initials}
    />
  );
}
