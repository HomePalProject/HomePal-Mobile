import React from 'react';
import { View, ScrollView, Pressable, TextInput, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Home, MapPin, Building, Trash2, Save } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { useHouseholdSettings } from '@/src/features/households/hooks/useHouseholdSettings';
import { useProfileStore } from '@/src/store/useProfileStore';
import { useDrawerStore } from '@/src/store/useDrawerStore';
import { ProTipCard } from '@/src/components/ui/pro-tip-card';

export default function HouseholdSettingsRoute() {
  const {
    isLoading,
    isUpdating,
    isDeleting,
    name,
    setName,
    address,
    setAddress,
    governorate,
    setGovernorate,
    city,
    setCity,
    onUpdate,
    onDelete,
    onBack,
  } = useHouseholdSettings();

  const { fullName, profileImageUri } = useProfileStore();
  const { openDrawer } = useDrawerStore();

  const userInitials = fullName ? fullName.trim()[0]?.toUpperCase() : 'U';

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="h-16 flex-row items-center justify-between bg-surface-surface px-5 shadow-sm">
        <Pressable
          onPress={onBack}
          className="active:bg-surface-surfaceVariant rounded-full p-2"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Icon as={ArrowLeft} size={24} className="text-on-surface" />
        </Pressable>

        <Text className="text-on-surface font-cairo text-[16px] font-bold">Household Settings</Text>

        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={openDrawer}
            className="h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-primary-container active:opacity-70">
            {profileImageUri ? (
              <Image source={{ uri: profileImageUri }} className="h-full w-full" />
            ) : (
              <Text className="font-cairo text-[15px] font-bold text-brand-primary">
                {userInitials}
              </Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* Body */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#356859" />
          <Text className="mt-3 font-cairo text-[14px] text-text-secondary">
            Loading household settings...
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, gap: 24 }}
          showsVerticalScrollIndicator={false}>
          {/* Section Header */}
          <View style={{ gap: 6 }}>
            <Text className="font-cairo text-[24px] font-bold leading-[32px] text-brand-primary">
              Manage Residence
            </Text>
            <Text className="font-cairo text-[14px] leading-[22px] text-text-secondary">
              Update your household's profile details or manage administrative settings.
            </Text>
          </View>

          {/* Form Card */}
          <View
            className="bg-surface-surfaceVariant/40 rounded-2xl border border-surface-border p-5"
            style={{ gap: 16 }}>
            {/* Field 1: Household Name (Required) */}
            <View style={{ gap: 6 }}>
              <View className="flex-row items-center gap-2">
                <Icon as={Home} size={18} color="#356859" />
                <Text className="text-on-surface font-cairo text-[14px] font-bold">
                  Household Name <Text className="text-red-500">*</Text>
                </Text>
              </View>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g., Al-Amal Family Villa"
                placeholderTextColor="#A8A29B"
                style={{
                  fontFamily: 'Cairo',
                  fontSize: 15,
                  color: '#1e1b17',
                  backgroundColor: '#FAF7F2',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#E4E0DA',
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                }}
              />
            </View>

            {/* Field 2: Address */}
            <View style={{ gap: 6 }}>
              <View className="flex-row items-center gap-2">
                <Icon as={MapPin} size={18} color="#356859" />
                <Text className="text-on-surface font-cairo text-[14px] font-bold">Address</Text>
              </View>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Street address (optional)"
                placeholderTextColor="#A8A29B"
                style={{
                  fontFamily: 'Cairo',
                  fontSize: 15,
                  color: '#1e1b17',
                  backgroundColor: '#FAF7F2',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#E4E0DA',
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                }}
              />
            </View>

            {/* Field 3 & 4: Governorate & City side by side */}
            <View className="flex-row gap-3">
              <View className="flex-1" style={{ gap: 6 }}>
                <View className="flex-row items-center gap-1.5">
                  <Icon as={Building} size={16} color="#356859" />
                  <Text className="text-on-surface font-cairo text-[14px] font-bold">
                    Governorate
                  </Text>
                </View>
                <TextInput
                  value={governorate}
                  onChangeText={setGovernorate}
                  placeholder="e.g., Cairo"
                  placeholderTextColor="#A8A29B"
                  style={{
                    fontFamily: 'Cairo',
                    fontSize: 14,
                    color: '#1e1b17',
                    backgroundColor: '#FAF7F2',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#E4E0DA',
                    paddingHorizontal: 12,
                    paddingVertical: 9,
                  }}
                />
              </View>

              <View className="flex-1" style={{ gap: 6 }}>
                <View className="flex-row items-center gap-1.5">
                  <Icon as={Building} size={16} color="#356859" />
                  <Text className="text-on-surface font-cairo text-[14px] font-bold">City</Text>
                </View>
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="e.g., Maadi"
                  placeholderTextColor="#A8A29B"
                  style={{
                    fontFamily: 'Cairo',
                    fontSize: 14,
                    color: '#1e1b17',
                    backgroundColor: '#FAF7F2',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#E4E0DA',
                    paddingHorizontal: 12,
                    paddingVertical: 9,
                  }}
                />
              </View>
            </View>

            {/* Save Button */}
            <Pressable
              onPress={onUpdate}
              disabled={isUpdating || isDeleting}
              className="mt-2 flex-row items-center justify-center gap-2 rounded-xl bg-brand-primary py-3.5 shadow-sm active:opacity-90">
              {isUpdating ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Icon as={Save} size={18} color="#ffffff" />
                  <Text className="font-cairo text-[15px] font-bold text-white">Save Changes</Text>
                </>
              )}
            </Pressable>
          </View>

          {/* Pro Tip Card */}
          <ProTipCard
            description="Updating your household details reflects across all members' dashboards instantly."
            className="bg-brand-primary-container/15 border-brand-primary-container"
          />

          {/* Danger Zone: Delete Household */}
          <View
            className="mt-4 rounded-2xl border border-red-200 bg-red-50/50 p-5"
            style={{ gap: 12 }}>
            <Text className="font-cairo text-[16px] font-bold text-red-700">Danger Zone</Text>
            <Text className="font-cairo text-[13px] leading-[20px] text-red-600">
              Deleting this household is permanent. All members, inventory, meal plans, and
              invitations associated with this residence will be removed.
            </Text>

            <Pressable
              onPress={onDelete}
              disabled={isUpdating || isDeleting}
              className="flex-row items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 shadow-sm active:opacity-90">
              {isDeleting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Icon as={Trash2} size={18} color="#ffffff" />
                  <Text className="font-cairo text-[15px] font-bold text-white">
                    Delete Household
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
