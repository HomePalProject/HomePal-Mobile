import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useMemberPreferences } from '../hooks/useMemberPreferences';
import { PreferenceChip } from '../components/PreferenceChip';

export interface MemberPreferencesScreenProps {
  memberId: string;
}

export function MemberPreferencesScreen({ memberId }: MemberPreferencesScreenProps) {
  const {
    isLoading,
    isSaving,
    error,
    preferencesByCategory,
    selectedPreferenceIds,
    targetMember,
    isManager,
    togglePreference,
    savePreferences,
  } = useMemberPreferences(memberId);

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between p-spacing-16">
        <TouchableOpacity
          onPress={() => router.back()}
          className="shadow-low h-10 w-10 items-center justify-center rounded-radius-full bg-surface-surface">
          <ArrowLeft size={24} color="#002819" />
        </TouchableOpacity>
        <Text className="text-titleLarge font-cairo font-bold text-text-primary">
          Member Preferences
        </Text>
        <View className="w-10" /> {/* Placeholder to balance header */}
      </View>

      {/* Loading State */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#356859" />
          <Text className="text-body mt-spacing-8 font-cairo text-text-secondary">
            Loading preferences...
          </Text>
        </View>
      ) : error && !targetMember ? (
        // Error / Not Found State
        <View className="flex-1 items-center justify-center p-spacing-16">
          <Text className="text-bodyLarge text-error-primary text-center font-cairo">
            {error || 'Member not found.'}
          </Text>
        </View>
      ) : (
        <>
          <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
            {/* Member Profile Hero */}
            <View className="mb-spacing-32 items-center justify-center">
              <View className="bg-brand-primaryContainer mb-spacing-12 h-24 w-24 items-center justify-center rounded-radius-full">
                <Text className="text-displaySmall font-cairo font-bold text-brand-primary">
                  {targetMember?.initial || targetMember?.fullName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text className="text-titleLarge text-center font-cairo font-bold text-text-primary">
                {targetMember?.fullName}
              </Text>
              {!isManager && (
                <Text className="text-labelLarge mt-spacing-4 font-cairo text-text-secondary">
                  View-only mode (Manager required to edit)
                </Text>
              )}
            </View>

            {/* Error Banner */}
            {error && (
              <View className="bg-error-container p-spacing-12 border-error-primary mb-spacing-16 rounded-radius-medium border">
                <Text className="text-body text-error-primary font-cairo">{error}</Text>
              </View>
            )}

            {/* Empty State for API */}
            {preferencesByCategory.length === 0 ? (
              <View className="items-center justify-center py-spacing-32">
                <Text className="text-body text-center font-cairo text-text-secondary">
                  No preference categories available from the server.
                </Text>
              </View>
            ) : null}

            {/* Dynamic Categories */}
            {preferencesByCategory.map(({ category, preferences }) => {
              if (preferences.length === 0) return null;

              return (
                <View
                  key={category.id}
                  className="shadow-low mb-spacing-16 rounded-radius-medium bg-surface-surface p-spacing-16">
                  <Text className="mb-spacing-12 text-titleMedium font-cairo font-bold text-text-primary">
                    {category.name}
                  </Text>
                  {category.description && (
                    <Text className="mb-spacing-12 text-body font-cairo text-text-secondary">
                      {category.description}
                    </Text>
                  )}
                  <View className="-mx-1 flex-row flex-wrap">
                    {preferences.map((pref) => (
                      <PreferenceChip
                        key={pref.id}
                        label={pref.name}
                        selected={selectedPreferenceIds.has(pref.id)}
                        onPress={() => togglePreference(pref.id)}
                        disabled={!isManager || isSaving}
                      />
                    ))}
                  </View>
                </View>
              );
            })}

            {/* Extra padding at bottom so scroll content doesn't hide behind CTA */}
            <View className="h-24" />
          </ScrollView>

          {/* Sticky Footer */}
          {isManager && (
            <View className="border-t border-surface-border bg-surface-background p-spacing-16">
              <TouchableOpacity
                onPress={savePreferences}
                disabled={isSaving}
                className={`py-spacing-12 flex-row items-center justify-center rounded-radius-full ${
                  isSaving ? 'bg-brand-primary/50' : 'bg-brand-primary'
                }`}>
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-labelLarge font-cairo font-bold text-text-inverse">
                    Save Preferences
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}
