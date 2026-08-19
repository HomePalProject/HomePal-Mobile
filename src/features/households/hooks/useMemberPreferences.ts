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
  const isManager = currentUser?.role === 'Household Manager';

  // For the header, we also need to find the target member's details
  const targetMember = members.find((m) => m.id === memberId);

  const canEdit = isManager || !!targetMember?.isCurrentUser;

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

  const [loadingPreferences, setLoadingPreferences] = useState<Set<string>>(new Set());

  const togglePreference = useCallback(
    async (preferenceId: string) => {
      if (!canEdit) return; // Only managers or the user themselves can edit

      // Set this chip to loading state
      setLoadingPreferences((prev) => {
        const next = new Set(prev);
        next.add(preferenceId);
        return next;
      });

      const isCurrentlySelected = selectedPreferenceIds.has(preferenceId);

      try {
        if (isCurrentlySelected) {
          // Delete it
          const success = await preferencesService.removeMemberPreference(memberId, preferenceId);
          if (success) {
            setSelectedPreferenceIds((prev) => {
              const next = new Set(prev);
              next.delete(preferenceId);
              return next;
            });
            toast.success('Removed', 'Preference removed successfully.');
          } else {
            throw new Error('Failed to remove');
          }
        } else {
          // Add it. Pass current selected + new one to handle both additive and replace-all API semantics
          const payloadIds = Array.from(selectedPreferenceIds);
          payloadIds.push(preferenceId);

          const updatedPrefs = await preferencesService.assignMemberPreferences(memberId, {
            preferenceIds: payloadIds,
          });
          setSelectedPreferenceIds(new Set(updatedPrefs.map((p) => p.id)));
          toast.success('Added', 'Preference added successfully.');
        }
      } catch (err: any) {
        console.warn('[useMemberPreferences] Error toggling preference:', err);
        toast.error('Error', 'Failed to update preference.');
      } finally {
        setLoadingPreferences((prev) => {
          const next = new Set(prev);
          next.delete(preferenceId);
          return next;
        });
      }
    },
    [isManager, selectedPreferenceIds, memberId]
  );

  // Group available preferences by category for easy rendering
  const preferencesByCategory = categories.map((category) => {
    return {
      category,
      preferences: availablePreferences.filter((p) => p.categoryId === category.id),
    };
  });

  return {
    isLoading,
    error,
    categories,
    preferencesByCategory,
    selectedPreferenceIds,
    loadingPreferences,
    targetMember,
    canEdit,
    togglePreference,
    refetch: fetchAllData,
  };
}
