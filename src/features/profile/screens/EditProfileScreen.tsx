import { useAppDispatch, useAppSelector } from '@/src/store';
import {
  deleteProfileImage,
  saveProfile,
  uploadProfileImage,
} from '@/src/store/slices/profileSlice';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { DatePicker } from '../../../components/ui';
import { SvgIcon } from '../../../components/ui/SvgIcon';
import { Icon } from '@/src/components/ui/icon';
import { ArrowLeft } from 'lucide-react-native';
import { Gender } from '../../../types/api';
import { useProfileAvatar } from '../hooks/useProfileAvatar';
import { AppBottomSheet } from '@/src/components/ui/bottom-sheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { LocationSelectorModal } from '@/src/components/ui/LocationSelectorModal';

export default function EditProfileScreen() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);

  const [fullName, setFullName] = useState(profile.fullName);
  const [gender, setGender] = useState<Gender | null>(profile.gender);
  const [birthDate, setBirthDate] = useState<string>(profile.birthDate || '');
  const [governorateId, setGovernorateId] = useState(profile.governorateId);
  const [governorate, setGovernorate] = useState(profile.governorate);
  const [cityId, setCityId] = useState(profile.cityId);
  const [city, setCity] = useState(profile.city);
  const [selectorType, setSelectorType] = useState<'governorate' | 'city'>('governorate');
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);

  useEffect(() => {
    // If we have IDs but no names (e.g. backend doesn't populate the string names in getMe), fetch them.
    const fetchNames = async () => {
      try {
        if (profile.governorateId && !profile.governorate) {
          const { locationsService } = await import('@/src/services/api/locations.service');
          const govs = await locationsService.getGovernorates();
          const foundGov = govs.find((g) => g.id === profile.governorateId);
          if (foundGov) setGovernorate(foundGov.name);
        }
        if (profile.cityId && !profile.city && profile.governorateId) {
          const { locationsService } = await import('@/src/services/api/locations.service');
          const cities = await locationsService.getCities(profile.governorateId);
          const foundCity = cities.find((c) => c.id === profile.cityId);
          if (foundCity) setCity(foundCity.name);
        }
      } catch (err) {
        console.warn('Failed to fetch location names for profile', err);
      }
    };
    fetchNames();
  }, [profile.governorateId, profile.governorate, profile.cityId, profile.city]);

  const {
    profileImageUri,
    setProfileImageUri,
    photoBottomSheetRef,
    permissionModalVisible,
    setPermissionModalVisible,
    pickImage,
    takePhoto,
    handleImageSelection,
  } = useProfileAvatar(profile.profileImageUri);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { t } = useTranslation('profile');

  const handleSave = async () => {
    if (!fullName.trim()) {
      setErrorMsg(t('edit.validation.fullNameReq'));
      return;
    }
    if (!governorateId) {
      setErrorMsg(t('edit.validation.governorateReq', 'Please select a governorate'));
      return;
    }
    if (gender === null || gender === undefined) {
      setErrorMsg(t('edit.validation.genderReq', 'Please select your gender'));
      return;
    }
    if (!cityId) {
      setErrorMsg(t('edit.validation.cityReq', 'Please select a city'));
      return;
    }
    if (!birthDate) {
      setErrorMsg(t('edit.validation.birthDateReq'));
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      // 1. Save general profile information
      await dispatch(
        saveProfile({
          fullName: fullName.trim(),
          gender,
          birthDate: birthDate ? birthDate.split('T')[0] : null,
          governorateId: governorateId!,
          cityId: cityId!,
        })
      ).unwrap();

      // 2. Handle image changes (upload or delete)
      if (profileImageUri !== profile.profileImageUri) {
        if (!profileImageUri) {
          console.log('[EditProfileScreen] Deleting profile picture...');
          await dispatch(deleteProfileImage()).unwrap();
        } else {
          console.log('[EditProfileScreen] Uploading new profile picture...', profileImageUri);
          await dispatch(uploadProfileImage(profileImageUri)).unwrap();
        }
      }

      router.back();
    } catch (err: any) {
      console.error('[EditProfileScreen] Error saving profile:', err, err.errors);
      let msg = err.message || t('edit.validation.saveFailed');
      if (err.errors && typeof err.errors === 'object') {
        // Handle ASP.NET Core ProblemDetails errors object
        const errorDetails = Object.entries(err.errors)
          .map(([field, msgs]) => {
            if (Array.isArray(msgs)) return msgs.join(' ');
            return msgs;
          })
          .join('\n');
        if (errorDetails) {
          msg += '\n' + errorDetails;
        }
      }
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['bottom', 'left', 'right']}>
      <View
        className="flex-row items-center justify-between border-b border-surface-divider bg-surface-surface px-spacing-16 pb-3 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 16) + 12 }}>
        <Pressable
          onPress={() => router.back()}
          className="bg-surface-surfaceVariant/60 h-10 w-10 items-center justify-center rounded-radius-full">
          <Icon as={ArrowLeft} size={20} className="text-text-primary" />
        </Pressable>

        <Text className="text-bodyLarge font-cairo font-bold text-text-primary">
          {t('edit.title')}
        </Text>

        <View className="h-10 w-10 items-center justify-center overflow-hidden rounded-radius-full border border-brand-primary/20 bg-brand-primary-container">
          {profileImageUri ? (
            <Image source={{ uri: profileImageUri }} className="h-full w-full" />
          ) : (
            <Text className="text-body font-cairo font-bold text-brand-primary">
              {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
            </Text>
          )}
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        <View className="relative items-center overflow-hidden border-b border-surface-divider bg-brand-primary-container/10 py-spacing-32">
          <View className="absolute inset-0 items-center justify-center">
            <SvgIcon name="profile-glow-edit" width={390} height={228} />
          </View>

          <View className="relative z-[1] h-32 w-32 items-center justify-center rounded-radius-full border-4 border-surface-surface bg-brand-primary-container shadow-md">
            <View className="h-full w-full items-center justify-center overflow-hidden rounded-radius-full">
              {profileImageUri ? (
                <Image source={{ uri: profileImageUri }} className="h-full w-full" />
              ) : (
                <Text className="text-display font-cairo text-4xl font-bold text-brand-primary">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                </Text>
              )}
            </View>
            <Pressable
              onPress={handleImageSelection}
              className="active:bg-brand-primaryPressed absolute bottom-0 end-0 h-10 w-10 items-center justify-center rounded-radius-full border-2 border-surface-surface bg-brand-primary shadow-lg">
              <SvgIcon name="camera" width={18} height={15} fill="#FAF8F3" />
            </Pressable>
          </View>

          <Pressable
            onPress={handleImageSelection}
            className="z-[1] mt-spacing-16 active:opacity-75">
            <Text className="text-body font-cairo font-bold text-brand-primary">
              {t('edit.changePhoto')}
            </Text>
          </Pressable>
        </View>

        <View className="gap-y-spacing-24 px-spacing-16 pt-spacing-24">
          <View className="w-full">
            <Text className="text-caption mb-spacing-8 ms-spacing-8 font-cairo font-bold text-text-secondary">
              {t('edit.fullName')}
            </Text>
            <View className="h-12 justify-center rounded-radius-medium border border-surface-border/40 bg-surface-surface px-spacing-16 shadow-sm">
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                className="text-body h-full w-full font-cairo text-text-primary"
                placeholder={t('edit.fullNamePlaceholder')}
                placeholderTextColor="#A8A29B"
              />
            </View>
          </View>

          <View className="w-full">
            <Text className="text-caption mb-spacing-8 ms-spacing-8 font-cairo font-bold text-text-secondary">
              {t('edit.gender')}
            </Text>
            <View className="flex-row gap-x-spacing-16">
              <Pressable
                onPress={() => setGender(Gender.Male)}
                className={`h-12 flex-1 flex-row items-center justify-center rounded-radius-medium border ${
                  gender === Gender.Male
                    ? 'border-brand-primary bg-brand-primary-container'
                    : 'border-surface-border/40 bg-surface-surface'
                } shadow-sm active:opacity-90`}>
                <Text
                  className={`text-body font-cairo ${
                    gender === Gender.Male ? 'font-bold text-brand-primary' : 'text-text-secondary'
                  }`}>
                  {t('edit.male')}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setGender(Gender.Female)}
                className={`h-12 flex-1 flex-row items-center justify-center rounded-radius-medium border ${
                  gender === Gender.Female
                    ? 'border-brand-primary bg-brand-primary-container'
                    : 'border-surface-border/40 bg-surface-surface'
                } shadow-sm active:opacity-90`}>
                <Text
                  className={`text-body font-cairo ${
                    gender === Gender.Female
                      ? 'font-bold text-brand-primary'
                      : 'text-text-secondary'
                  }`}>
                  {t('edit.female')}
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="w-full">
            <DatePicker
              label={t('edit.birthDate')}
              value={birthDate}
              onChange={setBirthDate}
              placeholder={t('edit.selectBirthDate')}
            />
          </View>

          <View className="w-full flex-row justify-between">
            <View className="w-[48%]">
              <Text className="text-caption mb-spacing-8 ms-spacing-8 font-cairo font-bold text-text-secondary">
                {t('edit.governorate')}
              </Text>
              <Pressable
                onPress={() => {
                  setSelectorType('governorate');
                  setIsSelectorVisible(true);
                }}
                className="h-12 justify-center rounded-radius-medium border border-surface-border/40 bg-surface-surface px-spacing-16 shadow-sm">
                <Text
                  className={`text-body font-cairo ${governorate ? 'text-text-primary' : 'text-[#A8A29B]'}`}>
                  {governorate || t('edit.governoratePlaceholder', 'Select Governorate')}
                </Text>
              </Pressable>
            </View>

            <View className="w-[48%]">
              <Text className="text-caption mb-spacing-8 ms-spacing-8 font-cairo font-bold text-text-secondary">
                {t('edit.city')}
              </Text>
              <Pressable
                onPress={() => {
                  setSelectorType('city');
                  setIsSelectorVisible(true);
                }}
                className="h-12 justify-center rounded-radius-medium border border-surface-border/40 bg-surface-surface px-spacing-16 shadow-sm">
                <Text
                  className={`text-body font-cairo ${city ? 'text-text-primary' : 'text-[#A8A29B]'}`}>
                  {city || t('edit.cityPlaceholder', 'Select City')}
                </Text>
              </Pressable>
            </View>
          </View>

          {errorMsg && (
            <Text className="mt-spacing-8 text-center font-cairo text-[13px] font-bold text-brand-error">
              {errorMsg}
            </Text>
          )}

          <View className="mt-spacing-24 gap-y-spacing-16">
            <Pressable
              disabled={isSaving}
              className={`active:bg-brand-primaryPressed h-14 items-center justify-center rounded-radius-full bg-brand-primary shadow-md ${
                isSaving ? 'opacity-70' : ''
              }`}
              onPress={handleSave}>
              <Text className="text-bodyLarge font-cairo font-bold text-text-inverse">
                {isSaving ? t('edit.saving') : t('edit.save')}
              </Text>
            </Pressable>

            <Pressable
              disabled={isSaving}
              className={`h-14 items-center justify-center rounded-radius-full bg-brand-accent-container shadow-sm active:bg-brand-accent-container/80 ${
                isSaving ? 'opacity-50' : ''
              }`}
              onPress={() => router.back()}>
              <Text className="text-bodyLarge font-cairo font-bold text-text-primary">
                {t('cancel')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <AppBottomSheet ref={photoBottomSheetRef} enablePanDownToClose>
        <View className="px-spacing-24 pb-spacing-24">
          <Text className="text-bodyLarge mb-spacing-8 text-center font-cairo font-bold text-text-primary">
            {t('edit.photoModal.title')}
          </Text>
          <Text className="text-caption mb-spacing-24 text-center font-cairo text-text-secondary">
            {t('edit.photoModal.subtitle')}
          </Text>

          <View className="gap-y-spacing-16">
            <Pressable
              onPress={() => {
                photoBottomSheetRef.current?.dismiss();
                takePhoto();
              }}
              className="active:bg-brand-primaryPressed h-12 flex-row items-center justify-center rounded-radius-medium bg-brand-primary">
              <Text className="text-body font-cairo font-bold text-text-inverse">
                {t('edit.photoModal.takePhoto')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                photoBottomSheetRef.current?.dismiss();
                pickImage();
              }}
              className="h-12 flex-row items-center justify-center rounded-radius-medium border border-brand-primary/20 bg-brand-primary-container active:opacity-90">
              <Text className="text-body font-cairo font-bold text-brand-primary">
                {t('edit.photoModal.chooseLibrary')}
              </Text>
            </Pressable>

            {profileImageUri && (
              <Pressable
                onPress={() => {
                  photoBottomSheetRef.current?.dismiss();
                  setProfileImageUri(null);
                }}
                className="h-12 flex-row items-center justify-center rounded-radius-medium border border-brand-error/20 bg-brand-error/10 active:opacity-90">
                <Text className="text-body font-cairo font-bold text-brand-error">
                  {t('edit.photoModal.removePhoto')}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => photoBottomSheetRef.current?.dismiss()}
              className="bg-surface-surfaceVariant h-12 flex-row items-center justify-center rounded-radius-medium active:bg-surface-border/40">
              <Text className="text-body font-cairo font-bold text-text-secondary">
                {t('cancel')}
              </Text>
            </Pressable>
          </View>
        </View>
      </AppBottomSheet>

      {/* Permission Modal */}
      <Modal visible={permissionModalVisible} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50 px-spacing-24">
          <View className="w-full rounded-3xl bg-surface-surface p-spacing-24">
            <Text className="mb-spacing-12 text-center font-cairo text-lg font-bold text-text-primary">
              {t('edit.permissionRequired')}
            </Text>
            <Text className="mb-spacing-24 text-center font-cairo text-base text-text-secondary">
              {t('edit.permissionMessage')}
            </Text>
            <Pressable
              onPress={() => setPermissionModalVisible(false)}
              className="py-spacing-12 items-center justify-center rounded-radius-full bg-brand-primary">
              <Text className="font-cairo text-sm font-bold text-text-inverse">{t('edit.ok')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Location Selector Modal */}
      <LocationSelectorModal
        visible={isSelectorVisible}
        onClose={() => setIsSelectorVisible(false)}
        type={selectorType}
        governorateId={governorateId}
        selectedId={selectorType === 'governorate' ? governorateId : cityId}
        onSelect={(id, name) => {
          if (selectorType === 'governorate') {
            setGovernorateId(id);
            setGovernorate(name);
            // Reset city when governorate changes
            if (governorateId !== id) {
              setCityId(null);
              setCity('');
            }
          } else {
            setCityId(id);
            setCity(name);
          }
        }}
      />
    </SafeAreaView>
  );
}
