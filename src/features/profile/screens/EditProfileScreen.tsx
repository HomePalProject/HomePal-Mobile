import { useAppDispatch, useAppSelector } from '@/src/store';
import {
  deleteProfileImage,
  saveProfile,
  uploadProfileImage,
} from '@/src/store/slices/profileSlice';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { DatePicker } from '../../../components/ui';
import { SvgIcon } from '../../../components/ui/SvgIcon';
import { Gender } from '../../../types/api';
import { AppBottomSheet } from '@/src/components/ui/bottom-sheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
export default function EditProfileScreen() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);

  const [fullName, setFullName] = useState(profile.fullName);
  const [gender, setGender] = useState<Gender | null>(profile.gender);
  const [birthDate, setBirthDate] = useState<string>(profile.birthDate || '');
  const [governorate, setGovernorate] = useState(profile.governorate);
  const [city, setCity] = useState(profile.city);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(profile.profileImageUri);
  const photoBottomSheetRef = useRef<BottomSheetModal>(null);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { t } = useTranslation('profile');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setPermissionModalVisible(true);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  const handleImageSelection = () => {
    photoBottomSheetRef.current?.present();
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      setErrorMsg(t('edit.validation.fullNameReq'));
      return;
    }
    if (!governorate.trim()) {
      setErrorMsg(t('edit.validation.governorateReq'));
      return;
    }
    if (gender === null || gender === undefined) {
      setErrorMsg(t('edit.validation.genderReq'));
      return;
    }
    if (!city.trim()) {
      setErrorMsg(t('edit.validation.cityReq'));
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
          governorate: governorate.trim(),
          city: city.trim(),
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
          <SvgIcon name="arrow-left" width={16} height={16} fill="#2D2A26" />
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
              <View className="h-12 justify-center rounded-radius-medium border border-surface-border/40 bg-surface-surface px-spacing-16 shadow-sm">
                <TextInput
                  value={governorate}
                  onChangeText={setGovernorate}
                  className="text-body h-full w-full font-cairo text-text-primary"
                  placeholder={t('edit.governoratePlaceholder')}
                  placeholderTextColor="#A8A29B"
                />
              </View>
            </View>

            <View className="w-[48%]">
              <Text className="text-caption mb-spacing-8 ms-spacing-8 font-cairo font-bold text-text-secondary">
                {t('edit.city')}
              </Text>
              <View className="h-12 justify-center rounded-radius-medium border border-surface-border/40 bg-surface-surface px-spacing-16 shadow-sm">
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  className="text-body h-full w-full font-cairo text-text-primary"
                  placeholder={t('edit.cityPlaceholder')}
                  placeholderTextColor="#A8A29B"
                />
              </View>
            </View>
          </View>

          <Pressable className="active:bg-surface-surfaceVariant/40 mt-spacing-8 flex-row items-center justify-between rounded-radius-large border border-surface-border/40 bg-surface-surface p-spacing-16 shadow-sm">
            <View className="flex-row items-center gap-spacing-16">
              <View className="h-10 w-10 items-center justify-center rounded-radius-full bg-brand-primary-container">
                <SvgIcon name="security-shield" width={18} height={20} fill="#356859" />
              </View>
              <View>
                <Text className="text-body font-cairo font-bold text-text-primary">
                  {t('edit.securityTitle')}
                </Text>
                <Text className="text-caption font-cairo text-text-secondary">
                  {t('edit.securityDesc')}
                </Text>
              </View>
            </View>
            <View className="h-3 w-[7.4px] items-center justify-center">
              <SvgIcon name="chevron-right-thick" width={7.4} height={12} fill="#6D6862" />
            </View>
          </Pressable>

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

      <Modal
        animationType="fade"
        transparent={true}
        visible={permissionModalVisible}
        onRequestClose={() => setPermissionModalVisible(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-spacing-24"
          onPress={() => setPermissionModalVisible(false)}>
          <Pressable
            className="w-full max-w-[320px] rounded-radius-large border border-surface-border bg-surface-surface p-spacing-24 shadow-xl"
            onPress={(e) => e.stopPropagation()}>
            <Text className="text-bodyLarge mb-spacing-8 text-center font-cairo font-bold text-text-primary">
              {t('edit.cameraPermission.title')}
            </Text>
            <Text className="text-bodySmall mb-spacing-24 text-center font-cairo leading-[20px] text-text-secondary">
              {t('edit.cameraPermission.message')}
            </Text>

            <Pressable
              onPress={() => setPermissionModalVisible(false)}
              className="h-12 flex-row items-center justify-center rounded-radius-medium bg-brand-primary shadow-sm active:bg-brand-primary-pressed">
              <Text className="text-body font-cairo font-bold text-text-inverse">
                {t('edit.cameraPermission.ok')}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
