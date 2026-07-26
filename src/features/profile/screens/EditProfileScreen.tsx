import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SvgIcon } from '../../../components/ui/SvgIcon';

const nouraAvatarLarge = require('../../../assets/images/avatar-noura-large.png');

export default function EditProfileScreen() {
  const [firstName, setFirstName] = useState('Noura');
  const [lastName, setLastName] = useState('Hassan');
  const [email, setEmail] = useState('noura@example.com');
  const [phoneNumber, setPhoneNumber] = useState('+20 100 000 0000');

  const handleSave = () => {
    console.log('Save profile changes:', { firstName, lastName, email, phoneNumber });
    router.back();
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

        <View className="bg-brand-primaryContainer h-10 w-10 items-center justify-center overflow-hidden rounded-radius-full border border-brand-primary/20">
          <Image source={nouraAvatarLarge} className="h-full w-full" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        <View className="bg-brand-primaryContainer/10 relative items-center overflow-hidden border-b border-surface-divider py-spacing-32">
          <View className="absolute inset-0 items-center justify-center">
            <SvgIcon name="profile-glow-edit" width={390} height={228} />
          </View>

          <View className="bg-surface-surfaceVariant relative z-[1] h-32 w-32 items-center justify-center rounded-radius-full border-4 border-surface-surface shadow-md">
            <View className="h-full w-full overflow-hidden rounded-radius-full">
              <Image source={nouraAvatarLarge} className="h-full w-full" />
            </View>
            <Pressable className="active:bg-brand-primaryPressed absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-radius-full border-2 border-surface-surface bg-brand-primary shadow-lg">
              <SvgIcon name="camera" width={18} height={15} fill="#FAF8F3" />
            </Pressable>
          </View>

          <Pressable className="z-[1] mt-spacing-16 active:opacity-75">
            <Text className="text-body font-cairo font-bold text-brand-primary">
              Change Profile Photo
            </Text>
          </Pressable>
        </View>

        <View className="gap-y-spacing-24 px-spacing-16 pt-spacing-24">
          <View className="w-full flex-row justify-between">
            <View className="w-[48%]">
              <Text className="text-caption mb-spacing-8 ml-spacing-8 font-cairo font-bold text-text-secondary">
                First Name
              </Text>
              <View className="h-12 justify-center rounded-radius-medium border border-surface-border/40 bg-surface-surface px-spacing-16 shadow-sm">
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  className="text-body h-full w-full font-cairo text-text-primary"
                  placeholder="First Name"
                  placeholderTextColor="#A8A29B"
                />
              </View>
            </View>

            <View className="w-[48%]">
              <Text className="text-caption mb-spacing-8 ml-spacing-8 font-cairo font-bold text-text-secondary">
                Last Name
              </Text>
              <View className="h-12 justify-center rounded-radius-medium border border-surface-border/40 bg-surface-surface px-spacing-16 shadow-sm">
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  className="text-body h-full w-full font-cairo text-text-primary"
                  placeholder="Last Name"
                  placeholderTextColor="#A8A29B"
                />
              </View>
            </View>
          </View>

          <View className="w-full">
            <Text className="text-caption mb-spacing-8 ml-spacing-8 font-cairo font-bold text-text-secondary">
              Email Address
            </Text>
            <View className="gap-spacing-12 h-12 flex-row items-center rounded-radius-medium border border-surface-border/40 bg-surface-surface px-spacing-16 shadow-sm">
              <SvgIcon name="input-mail" width={18} height={14} fill="#6D6862" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="text-body h-full flex-1 font-cairo text-text-primary"
                placeholder="Email Address"
                placeholderTextColor="#A8A29B"
              />
            </View>
          </View>

          <View className="w-full">
            <Text className="text-caption mb-spacing-8 ml-spacing-8 font-cairo font-bold text-text-secondary">
              Phone Number
            </Text>
            <View className="gap-spacing-12 h-12 flex-row items-center rounded-radius-medium border border-surface-border/40 bg-surface-surface px-spacing-16 shadow-sm">
              <SvgIcon name="input-phone" width={16} height={16} fill="#6D6862" />
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                className="text-body h-full flex-1 font-cairo text-text-primary"
                placeholder="Phone Number"
                placeholderTextColor="#A8A29B"
              />
            </View>
          </View>

          <Pressable className="active:bg-surface-surfaceVariant/40 mt-spacing-8 flex-row items-center justify-between rounded-radius-large border border-surface-border/40 bg-surface-surface p-spacing-16 shadow-sm">
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

          <View className="gap-y-spacing-12 mt-spacing-24">
            <Pressable
              className="active:bg-brand-primaryPressed mb-3 h-14 items-center justify-center rounded-radius-full bg-brand-primary shadow-md"
              onPress={handleSave}>
              <Text className="text-bodyLarge font-cairo font-bold text-text-inverse">
                Save Changes
              </Text>
            </Pressable>

            <Pressable
              className="h-14 items-center justify-center rounded-radius-full bg-brand-accent-container shadow-sm active:bg-brand-accent-container/80"
              onPress={() => router.back()}>
              <Text className="text-bodyLarge font-cairo font-bold text-text-primary">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
