import { useState, useCallback, useEffect } from 'react';
import { PreferenceResponse, PreferenceCategoryResponse } from '@/src/types/api';
import { preferencesService } from '@/src/services/api/preferences.service';
import { toast } from '@/src/providers/ToastProvider';
import { useHouseholdMembers } from './useHouseholdMembers';

export function useMemberPreferences(memberId: string) {
  const [categories, setCategories] = useState<PreferenceCategoryResponse[]>([]);
  const [availablePreferences, setAvailablePreferences] = useState<PreferenceResponse[]>([]);
  const [memberPreferences, setMemberPreferences] = useState<PreferenceResponse[]>([]);

  // Local state for which preference IDs are currently selected in the UI
  const [selectedPreferenceIds, setSelectedPreferenceIds] = useState<Set<string>>(new Set());

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We need to know if the current user is a Manager to allow editing.
  // We can determine this by checking the members list and finding the current user.
  const { members } = useHouseholdMembers();
  const currentUser = members.find((m) => m.isCurrentUser);
  const isManager = currentUser?.role === 'Manager';

  // For the header, we also need to find the target member's details
  const targetMember = members.find((m) => m.id === memberId);

  const fetchAllData = useCallback(async () => {
    if (!memberId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all three concurrently
      const [fetchedCategories, fetchedAvailable, fetchedMemberPrefs] = await Promise.all([
        preferencesService.getPreferenceCategories(),
        preferencesService.getAvailablePreferences(),
        preferencesService.getMemberPreferences(memberId),
      ]);

      setCategories(fetchedCategories);
      setAvailablePreferences(fetchedAvailable);
      setMemberPreferences(fetchedMemberPrefs);

      // Initialize selected set
      const selectedIds = new Set(fetchedMemberPrefs.map((p) => p.id));
      setSelectedPreferenceIds(selectedIds);
    } catch (err: any) {
      console.warn('[useMemberPreferences] Error fetching data:', err);
      setError('Failed to load preferences data.');
      toast.error('Error', 'Could not load preferences.');
    } finally {
      setIsLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const togglePreference = useCallback(
    (preferenceId: string) => {
      if (!isManager) return; // Only managers can edit

      setSelectedPreferenceIds((prev) => {
        const next = new Set(prev);
        if (next.has(preferenceId)) {
          next.delete(preferenceId);
        } else {
          next.add(preferenceId);
        }
        return next;
      });
    },
    [isManager]
  );

  const savePreferences = useCallback(async () => {
    if (!isManager) return false;

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        preferenceIds: Array.from(selectedPreferenceIds),
      };

      const updatedPrefs = await preferencesService.assignMemberPreferences(memberId, payload);
      setMemberPreferences(updatedPrefs);

      toast.success('Preferences Saved', 'Member preferences updated successfully.');
      return true;
    } catch (err: any) {
      console.warn('[useMemberPreferences] Error saving preferences:', err);
      setError('Failed to save preferences.');
      toast.error('Save Failed', 'Could not update preferences.');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [isManager, memberId, selectedPreferenceIds]);

  // Group available preferences by category for easy rendering
  const preferencesByCategory = categories.map((category) => {
    return {
      category,
      preferences: availablePreferences.filter((p) => p.categoryId === category.id),
    };
  });

  return {
    isLoading,
    isSaving,
    error,
    categories,
    preferencesByCategory,
    selectedPreferenceIds,
    targetMember,
    isManager,
    togglePreference,
    savePreferences,
    refetch: fetchAllData,
  };
}
