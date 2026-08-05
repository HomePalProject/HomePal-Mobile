import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SvgIcon } from '../../../components/ui/SvgIcon';
import * as ImagePicker from 'expo-image-picker';
import { useAppSelector, useAppDispatch } from '@/src/store';
import {
  saveProfile,
  uploadProfileImage,
  deleteProfileImage,
} from '@/src/store/slices/profileSlice';
import { DatePicker } from '../../../components/ui';
import { Gender } from '../../../types/api';

export default function EditProfileScreen() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);

  const [fullName, setFullName] = useState(profile.fullName);
  const [gender, setGender] = useState<Gender | null>(profile.gender);
  const [birthDate, setBirthDate] = useState<string>(profile.birthDate || '');
  const [governorate, setGovernorate] = useState(profile.governorate);
  const [city, setCity] = useState(profile.city);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(profile.profileImageUri);
  const [modalVisible, setModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      setErrorMsg('Full Name is required');
      return;
    }
    if (!governorate.trim()) {
      setErrorMsg('Governorate is required');
      return;
    }
    if (gender === null || gender === undefined) {
      setErrorMsg('Gender is required');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('City is required');
      return;
    }
    if (!birthDate) {
      setErrorMsg('Birth Date is required');
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
      let msg = err.message || 'Failed to save changes. Please try again.';
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

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <View className="h-16 flex-row items-center justify-between border-b border-surface-divider bg-surface-surface px-spacing-16 shadow-sm">
        <Pressable
          onPress={() => router.back()}
          className="bg-surface-surfaceVariant/60 h-10 w-10 items-center justify-center rounded-radius-full">
          <SvgIcon name="arrow-left" width={16} height={16} fill="#2D2A26" />
        </Pressable>

        <Text className="text-bodyLarge font-cairo font-bold text-text-primary">
          Account Settings
        </Text>

        <View className="border-brand-primary/20 h-10 w-10 items-center justify-center overflow-hidden rounded-radius-full border bg-brand-primary-container">
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
        <View className="bg-brand-primary-container/10 relative items-center overflow-hidden border-b border-surface-divider py-spacing-32">
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
              className="active:bg-brand-primaryPressed absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-radius-full border-2 border-surface-surface bg-brand-primary shadow-lg">
              <SvgIcon name="camera" width={18} height={15} fill="#FAF8F3" />
            </Pressable>
          </View>

          <Pressable
            onPress={handleImageSelection}
            className="z-[1] mt-spacing-16 active:opacity-75">
            <Text className="text-body font-cairo font-bold text-brand-primary">
              Change Profile Photo
            </Text>
          </Pressable>
        </View>

        <View className="gap-y-spacing-24 px-spacing-16 pt-spacing-24">
          <View className="w-full">
            <Text className="text-caption mb-spacing-8 ml-spacing-8 font-cairo font-bold text-text-secondary">
              Full Name
            </Text>
            <View className="border-surface-border/40 h-12 justify-center rounded-radius-medium border bg-surface-surface px-spacing-16 shadow-sm">
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                className="text-body h-full w-full font-cairo text-text-primary"
                placeholder="Full Name"
                placeholderTextColor="#A8A29B"
              />
            </View>
          </View>

          <View className="w-full">
            <Text className="text-caption mb-spacing-8 ml-spacing-8 font-cairo font-bold text-text-secondary">
              Gender
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
                  Male
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
                  Female
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="w-full">
            <DatePicker
              label="Birth Date"
              value={birthDate}
              onChange={setBirthDate}
              placeholder="Select birth date"
            />
          </View>

          <View className="w-full flex-row justify-between">
            <View className="w-[48%]">
              <Text className="text-caption mb-spacing-8 ml-spacing-8 font-cairo font-bold text-text-secondary">
                Governorate
              </Text>
              <View className="border-surface-border/40 h-12 justify-center rounded-radius-medium border bg-surface-surface px-spacing-16 shadow-sm">
                <TextInput
                  value={governorate}
                  onChangeText={setGovernorate}
                  className="text-body h-full w-full font-cairo text-text-primary"
                  placeholder="Governorate"
                  placeholderTextColor="#A8A29B"
                />
              </View>
            </View>

            <View className="w-[48%]">
              <Text className="text-caption mb-spacing-8 ml-spacing-8 font-cairo font-bold text-text-secondary">
                City
              </Text>
              <View className="border-surface-border/40 h-12 justify-center rounded-radius-medium border bg-surface-surface px-spacing-16 shadow-sm">
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  className="text-body h-full w-full font-cairo text-text-primary"
                  placeholder="City"
                  placeholderTextColor="#A8A29B"
                />
              </View>
            </View>
          </View>

          <Pressable className="active:bg-surface-surfaceVariant/40 border-surface-border/40 mt-spacing-8 flex-row items-center justify-between rounded-radius-large border bg-surface-surface p-spacing-16 shadow-sm">
            <View className="flex-row items-center gap-spacing-16">
              <View className="h-10 w-10 items-center justify-center rounded-radius-full bg-brand-primary-container">
                <SvgIcon name="security-shield" width={18} height={20} fill="#356859" />
              </View>
              <View>
                <Text className="text-body font-cairo font-bold text-text-primary">
                  Account Security
                </Text>
                <Text className="text-caption font-cairo text-text-secondary">
                  Two-factor authentication active
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
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </Text>
            </Pressable>

            <Pressable
              disabled={isSaving}
              className={`active:bg-brand-accent-container/80 h-14 items-center justify-center rounded-radius-full bg-brand-accent-container shadow-sm ${
                isSaving ? 'opacity-50' : ''
              }`}
              onPress={() => router.back()}>
              <Text className="text-bodyLarge font-cairo font-bold text-text-primary">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setModalVisible(false)}>
          <Pressable className="rounded-t-radius-large border-t border-surface-border bg-surface-surface p-spacing-24 shadow-lg">
            <Text className="text-bodyLarge mb-spacing-8 text-center font-cairo font-bold text-text-primary">
              Profile Photo
            </Text>
            <Text className="text-caption mb-spacing-24 text-center font-cairo text-text-secondary">
              Choose an option to update your photo
            </Text>

            <View className="gap-y-spacing-16">
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  takePhoto();
                }}
                className="active:bg-brand-primaryPressed h-12 flex-row items-center justify-center rounded-radius-medium bg-brand-primary">
                <Text className="text-body font-cairo font-bold text-text-inverse">Take Photo</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  pickImage();
                }}
                className="border-brand-primary/20 h-12 flex-row items-center justify-center rounded-radius-medium border bg-brand-primary-container active:opacity-90">
                <Text className="text-body font-cairo font-bold text-brand-primary">
                  Choose from Library
                </Text>
              </Pressable>

              {profileImageUri && (
                <Pressable
                  onPress={() => {
                    setModalVisible(false);
                    setProfileImageUri(null);
                  }}
                  className="h-12 flex-row items-center justify-center rounded-radius-medium border border-brand-error/20 bg-brand-error/10 active:opacity-90">
                  <Text className="text-body font-cairo font-bold text-brand-error">
                    Remove Current Photo
                  </Text>
                </Pressable>
              )}

              <Pressable
                onPress={() => setModalVisible(false)}
                className="bg-surface-surfaceVariant active:bg-surface-border/40 h-12 flex-row items-center justify-center rounded-radius-medium">
                <Text className="text-body font-cairo font-bold text-text-secondary">Cancel</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

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
              Camera Permission Required
            </Text>
            <Text className="text-bodySmall mb-spacing-24 text-center font-cairo leading-[20px] text-text-secondary">
              You need to grant camera permission to take a photo. Please enable camera access in
              your device settings.
            </Text>

            <Pressable
              onPress={() => setPermissionModalVisible(false)}
              className="h-12 flex-row items-center justify-center rounded-radius-medium bg-brand-primary shadow-sm active:bg-brand-primary-pressed">
              <Text className="text-body font-cairo font-bold text-text-inverse">OK</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
