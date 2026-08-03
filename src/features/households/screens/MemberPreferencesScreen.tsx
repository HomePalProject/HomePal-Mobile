import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Icon } from '../../../components/ui/icon';
import { useMemberPreferences } from '../hooks/useMemberPreferences';
import { PreferenceChip } from '../components/PreferenceChip';

export interface MemberPreferencesScreenProps {
  memberId: string;
}

export function MemberPreferencesScreen({ memberId }: MemberPreferencesScreenProps) {
  const {
    isLoading,
    error,
    preferencesByCategory,
    selectedPreferenceIds,
    loadingPreferences,
    targetMember,
    isManager,
    togglePreference,
  } = useMemberPreferences(memberId);

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between p-spacing-16">
        <TouchableOpacity
          onPress={() => router.back()}
          className="shadow-low h-10 w-10 items-center justify-center rounded-radius-full bg-surface-surface">
          <Icon as={ArrowLeft} size={24} className="text-text-primary" />
        </TouchableOpacity>
        <Text className="font-cairo text-xl font-bold text-text-primary">Member Preferences</Text>
        <View className="w-10" />
      </View>

      {/* Loading State */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#356859" />
          <Text className="mt-spacing-8 font-cairo text-base text-text-secondary">
            Loading preferences...
          </Text>
        </View>
      ) : error && !targetMember ? (
        // Error / Not Found State
        <View className="flex-1 items-center justify-center p-spacing-16">
          <Text className="text-error-primary text-center font-cairo text-lg">
            {error || 'Member not found.'}
          </Text>
        </View>
      ) : (
        <>
          <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
            {/* Member Profile Hero */}
            <View className="mb-spacing-32 items-center justify-center">
              <View className="mb-spacing-12 h-24 w-24 items-center justify-center rounded-radius-full bg-brand-primary-container">
                <Text className="font-cairo text-4xl font-bold text-brand-primary">
                  {targetMember?.initial || targetMember?.fullName?.charAt(0)?.toUpperCase()}
                </Text>
              </View>
              <Text className="text-center font-cairo text-xl font-bold text-text-primary">
                {targetMember?.fullName}
              </Text>
              {!isManager ? (
                <Text className="mt-spacing-4 font-cairo text-sm text-text-secondary">
                  View-only mode (Manager required to edit)
                </Text>
              ) : null}
            </View>

            {/* Error Banner */}
            {error ? (
              <View className="bg-error-container p-spacing-12 border-error-primary mb-spacing-16 rounded-radius-medium border">
                <Text className="text-error-primary font-cairo text-base">{error}</Text>
              </View>
            ) : null}

            {/* Empty State for API */}
            {preferencesByCategory.length === 0 ? (
              <View className="items-center justify-center py-spacing-32">
                <Text className="text-center font-cairo text-base text-text-secondary">
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
                  <Text className="mb-spacing-12 font-cairo text-lg font-bold text-text-primary">
                    {category.name}
                  </Text>
                  {category.description ? (
                    <Text className="mb-spacing-12 font-cairo text-base text-text-secondary">
                      {category.description}
                    </Text>
                  ) : null}
                  <View className="-mx-1 flex-row flex-wrap">
                    {preferences.map((pref) => (
                      <PreferenceChip
                        key={pref.id}
                        label={pref.name}
                        selected={selectedPreferenceIds.has(pref.id)}
                        onPress={() => togglePreference(pref.id)}
                        disabled={!isManager || loadingPreferences.has(pref.id)}
                      />
                    ))}
                  </View>
                </View>
              );
            })}

            {/* Extra padding at bottom so scroll content doesn't hide behind CTA */}
            <View className="h-24" />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
