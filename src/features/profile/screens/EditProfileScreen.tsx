import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SvgIcon } from '../../../components/ui/SvgIcon';
import * as ImagePicker from 'expo-image-picker';
import { useProfileStore } from '../../../store/useProfileStore';
import { DatePicker } from '../../../components/ui';
import { Gender } from '../../../types/api';

const nouraAvatarLarge = require('../../../assets/images/avatar-noura-large.png');

export default function EditProfileScreen() {
  const profile = useProfileStore();

  const [fullName, setFullName] = useState(profile.fullName);
  const [gender, setGender] = useState<Gender | null>(profile.gender);
  const [birthDate, setBirthDate] = useState<string>(profile.birthDate || '');
  const [governorate, setGovernorate] = useState(profile.governorate);
  const [city, setCity] = useState(profile.city);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(profile.profileImageUri);
  const [modalVisible, setModalVisible] = useState(false);
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
      alert('You need to grant camera permission to take a photo');
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
    if (!city.trim()) {
      setErrorMsg('City is required');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      await profile.saveProfile({
        fullName: fullName.trim(),
        gender,
        birthDate: birthDate || null,
        governorate: governorate.trim(),
        city: city.trim(),
      });

      // Update local profile image URI state if any
      profile.updateProfile({ profileImageUri });
      router.back();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const imageSource = profileImageUri ? { uri: profileImageUri } : nouraAvatarLarge;

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

        <View className="bg-brand-primaryContainer border-brand-primary/20 h-10 w-10 items-center justify-center overflow-hidden rounded-radius-full border">
          <Image source={imageSource} className="h-full w-full" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        <View className="bg-brand-primaryContainer/10 relative items-center overflow-hidden border-b border-surface-divider py-spacing-32">
          <View className="absolute inset-0 items-center justify-center">
            <SvgIcon name="profile-glow-edit" width={390} height={228} />
          </View>

          <View className="bg-surface-surfaceVariant relative z-[1] h-32 w-32 items-center justify-center rounded-radius-full border-4 border-surface-surface shadow-md">
            <View className="h-full w-full overflow-hidden rounded-radius-full">
              <Image source={imageSource} className="h-full w-full" />
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
            <View className="gap-x-spacing-12 flex-row">
              <Pressable
                onPress={() => setGender(Gender.Male)}
                className={`h-12 flex-1 flex-row items-center justify-center rounded-radius-medium border ${
                  gender === Gender.Male
                    ? 'bg-brand-primaryContainer/30 border-brand-primary'
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
                    ? 'bg-brand-primaryContainer/30 border-brand-primary'
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
              <View className="bg-brand-primaryContainer h-10 w-10 items-center justify-center rounded-radius-full">
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

          <View className="gap-y-spacing-12 mt-spacing-24">
            <Pressable
              disabled={isSaving}
              className={`active:bg-brand-primaryPressed mb-3 h-14 items-center justify-center rounded-radius-full bg-brand-primary shadow-md ${
                isSaving ? 'opacity-70' : ''
              }`}
              onPress={handleSave}>
              <Text className="text-bodyLarge font-cairo font-bold text-text-inverse">
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </Text>
            </Pressable>

            <Pressable
              disabled={isSaving}
              className={`h-14 items-center justify-center rounded-radius-full bg-brand-accent-container shadow-sm active:bg-brand-accent-container/80 ${
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

            <View className="gap-y-spacing-12">
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
                className="bg-brand-primaryContainer border-brand-primary/20 h-12 flex-row items-center justify-center rounded-radius-medium border active:opacity-90">
                <Text className="text-body font-cairo font-bold text-brand-primary">
                  Choose from Library
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setModalVisible(false)}
                className="bg-surface-surfaceVariant active:bg-surface-border/40 mt-spacing-8 h-12 flex-row items-center justify-center rounded-radius-medium">
                <Text className="text-body font-cairo font-bold text-text-secondary">Cancel</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
