import React from 'react';
import { useDrawerStore } from '@/src/store/useDrawerStore';
import { View, ScrollView, Pressable, TextInput, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Home, MapPin, Building, Trash2, Save } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { useHouseholdSettings } from '@/src/features/households/hooks/useHouseholdSettings';
import { useAppSelector, useAppDispatch } from '@/src/store';
import { ProTipCard } from '@/src/components/ui/pro-tip-card';
import { useTranslation } from 'react-i18next';

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

  const { t } = useTranslation('households');
  const dispatch = useAppDispatch();
  const { fullName, profileImageUri } = useAppSelector((state) => state.profile);
  const handleOpenDrawer = useDrawerStore((state) => state.openDrawer);
  const insets = useSafeAreaInsets();

  const userInitials = fullName ? fullName.trim()[0]?.toUpperCase() : 'U';

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['bottom', 'left', 'right']}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between border-b border-surface-divider bg-surface-surface px-5 pb-3 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 16) + 12 }}>
        <Pressable
          onPress={onBack}
          className="active:bg-surface-surfaceVariant rounded-full p-2"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Icon as={ArrowLeft} directional size={24} className="text-text-primary" />
        </Pressable>

        <Text className="font-cairo text-[16px] font-bold text-text-primary">
          {t('settings.title')}
        </Text>

        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={handleOpenDrawer}
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
            {t('settings.loading')}
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
              {t('settings.manageResidence')}
            </Text>
            <Text className="font-cairo text-[14px] leading-[22px] text-text-secondary">
              {t('settings.manageDesc')}
            </Text>
          </View>

          {/* Form Card */}
          <View
            className="bg-surface-surfaceVariant/40 rounded-2xl border border-surface-border p-5"
            style={{ gap: 16 }}>
            {/* Field 1: Household Name (Required) */}
            <View style={{ gap: 6 }}>
              <View className="flex-row items-center gap-2">
                <Icon as={Home} size={18} className="text-brand-primary" />
                <Text className="font-cairo text-[14px] font-bold text-text-primary">
                  {t('settings.householdName')} <Text className="text-status-error">*</Text>
                </Text>
              </View>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('settings.namePlaceholder')}
                placeholderTextColor="#A8A29B"
                className="bg-surface-surfaceVariant rounded-xl border border-surface-border px-3.5 py-2.5 text-text-primary"
                style={{
                  fontFamily: 'Cairo',
                  fontSize: 15,
                }}
              />
            </View>

            {/* Field 2: Address */}
            <View style={{ gap: 6 }}>
              <View className="flex-row items-center gap-2">
                <Icon as={MapPin} size={18} className="text-brand-primary" />
                <Text className="font-cairo text-[14px] font-bold text-text-primary">
                  {t('settings.address')}
                </Text>
              </View>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder={t('settings.addressPlaceholder')}
                placeholderTextColor="#A8A29B"
                className="bg-surface-surfaceVariant rounded-xl border border-surface-border px-3.5 py-2.5 text-text-primary"
                style={{
                  fontFamily: 'Cairo',
                  fontSize: 15,
                }}
              />
            </View>

            {/* Field 3 & 4: Governorate & City side by side */}
            <View className="flex-row gap-3">
              <View className="flex-1" style={{ gap: 6 }}>
                <View className="flex-row items-center gap-1.5">
                  <Icon as={Building} size={16} className="text-brand-primary" />
                  <Text className="font-cairo text-[14px] font-bold text-text-primary">
                    {t('settings.governorate')}
                  </Text>
                </View>
                <TextInput
                  value={governorate}
                  onChangeText={setGovernorate}
                  placeholder={t('settings.governoratePlaceholder')}
                  placeholderTextColor="#A8A29B"
                  className="bg-surface-surfaceVariant rounded-xl border border-surface-border px-3 py-2 text-text-primary"
                  style={{
                    fontFamily: 'Cairo',
                    fontSize: 14,
                  }}
                />
              </View>

              <View className="flex-1" style={{ gap: 6 }}>
                <View className="flex-row items-center gap-1.5">
                  <Icon as={Building} size={16} className="text-brand-primary" />
                  <Text className="font-cairo text-[14px] font-bold text-text-primary">
                    {t('settings.city')}
                  </Text>
                </View>
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder={t('settings.cityPlaceholder')}
                  placeholderTextColor="#A8A29B"
                  className="bg-surface-surfaceVariant rounded-xl border border-surface-border px-3 py-2 text-text-primary"
                  style={{
                    fontFamily: 'Cairo',
                    fontSize: 14,
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
                  <Text className="font-cairo text-[15px] font-bold text-white">
                    {t('settings.saveChanges')}
                  </Text>
                </>
              )}
            </Pressable>
          </View>

          {/* Pro Tip Card */}
          <ProTipCard
            description={t('settings.proTip')}
            className="border-brand-primary-container bg-brand-primary-container/15"
          />

          {/* Danger Zone: Delete Household */}
          <View
            className="mt-4 rounded-2xl border border-status-error bg-status-error-container/20 p-5"
            style={{ gap: 12 }}>
            <Text className="font-cairo text-[16px] font-bold text-status-error">
              {t('settings.dangerZone')}
            </Text>
            <Text className="font-cairo text-[13px] leading-[20px] text-status-error">
              {t('settings.deleteWarning')}
            </Text>

            <Pressable
              onPress={onDelete}
              disabled={isUpdating || isDeleting}
              className="flex-row items-center justify-center gap-2 rounded-xl bg-status-error py-3.5 shadow-sm active:opacity-90">
              {isDeleting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Icon as={Trash2} size={18} color="#ffffff" />
                  <Text className="font-cairo text-[15px] font-bold text-white">
                    {t('settings.deleteBtn')}
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
