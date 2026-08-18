import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { TextField } from '@/src/components/ui/text-field';
import { Icon } from '@/src/components/ui/icon';
import { ArrowLeft, Sparkles, Heart, AlertTriangle, Check, Bot } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { registerUser, saveOnboardingData, clearError } from '@/src/store/slices/authSlice';
import { onboardingStep4Schema } from '@/src/utils/validation';
import { Gender } from '@/src/types/api';
import { toast } from '@/src/providers/ToastProvider';
import { AnimatedPressable } from '@/src/components/ui/animated-pressable';
import { ErrorBanner } from '@/src/components/common/ErrorBanner';
import * as Haptics from 'expo-haptics';

const LIFESTYLES = [
  'Halal',
  'High-protein',
  'Low-carb',
  'Vegetarian',
  'Vegan',
  'Keto',
  'Pescatarian',
  'Diabetic-friendly',
  'Mediterranean',
  'Paleo',
  'Gluten-free',
];

const ALLERGIES = [
  'Peanuts',
  'Tree nuts',
  'Gluten',
  'Dairy',
  'Shellfish',
  'Eggs',
  'Soy',
  'Fish',
  'Sesame',
  'Wheat',
];

import { useTranslation } from 'react-i18next';

export default function OnboardingStep4Screen() {
  const { t } = useTranslation(['onboarding', 'auth', 'common']);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    tempRegistration,
    onboardingData,
    isLoading,
    error: authError,
  } = useAppSelector((state) => state.auth);

  const [lifestyles, setLifestyles] = useState<string[]>(onboardingData?.lifestyles ?? ['Halal']);
  const [allergies, setAllergies] = useState<string[]>(onboardingData?.allergies ?? []);
  const [aiNote, setAiNote] = useState<string>(onboardingData?.aiNote ?? '');
  const [errors, setErrors] = useState<{ general?: string }>({});

  const toggleLifestyle = (item: string) => {
    if (lifestyles.includes(item)) {
      setLifestyles(lifestyles.filter((i) => i !== item));
    } else {
      setLifestyles([...lifestyles, item]);
    }
  };

  const toggleAllergy = (item: string) => {
    if (allergies.includes(item)) {
      setAllergies(allergies.filter((i) => i !== item));
    } else {
      setAllergies([...allergies, item]);
    }
  };

  const handleFinish = async () => {
    const result = onboardingStep4Schema.safeParse({
      lifestyles,
      allergies,
      aiNote: aiNote.trim(),
    });

    if (!result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrors({ general: result.error.issues[0]?.message || 'Please check your preferences.' });
      return;
    }

    setErrors({});
    if (authError) dispatch(clearError());

    // Save final preferences
    dispatch(saveOnboardingData({ lifestyles, allergies, aiNote: aiNote.trim() }));

    // Check if we have required basic credentials
    if (!tempRegistration?.email || !tempRegistration?.username || !tempRegistration?.password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        t('auth:missingCredentialsTitle', 'Missing Account Information'),
        t(
          'auth:missingCredentialsMsg',
          'Your login credentials expired from temporary session. Please restart registration.'
        ),
        [{ text: t('common:buttons.ok', 'OK'), onPress: () => router.replace('/register') }]
      );
      return;
    }

    try {
      await dispatch(
        registerUser({
          fullName: tempRegistration.fullName || 'User',
          username: tempRegistration.username,
          email: tempRegistration.email,
          password: tempRegistration.password,
          confirmPassword: tempRegistration.confirmPassword || tempRegistration.password,
          gender: tempRegistration.gender ?? Gender.Male,
          birthDate: tempRegistration.birthDate || '2000-01-01',
          governorate: tempRegistration.governorate || 'Cairo',
          city: tempRegistration.city || 'Nasr City',
        })
      ).unwrap();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success(
        t('auth:registrationSuccessful', 'Registration Successful 🎉'),
        t(
          'auth:checkEmailConfirmation',
          'Please check your email for confirmation instructions to activate your account.'
        )
      );
      router.replace('/login');
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      toast.error(
        t('auth:registrationFailed', 'Registration Failed'),
        err.message || t('common:errors.unexpectedError')
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <View className="flex-1 justify-between">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="px-6 py-4"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Header Bar */}
            <View className="flex-row items-center justify-between py-2">
              <AnimatedPressable
                onPress={() => router.back()}
                hapticStyle="light"
                className="h-10 w-10 items-center justify-center rounded-full bg-surface-surface-variant">
                <Icon as={ArrowLeft} directional size={20} className="text-text-primary" />
              </AnimatedPressable>
              <Text className="font-cairo text-[14px] font-bold text-text-secondary">
                Step 4 of 4
              </Text>
              <View className="w-10" />
            </View>

            {/* Progress Bar */}
            <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-surface-variant">
              <View className="h-full w-full rounded-full bg-brand-primary" />
            </View>

            {/* Error Banner */}
            <ErrorBanner error={authError || errors.general} />

            {/* Heading */}
            <View className="mt-6 flex-col gap-1">
              <Text className="font-cairo text-[26px] font-bold leading-[34px] text-text-primary">
                Dietary & AI Profile
              </Text>
              <Text className="font-cairo text-[15px] leading-[22px] text-text-secondary">
                Select lifestyles and allergies so our AI only recommends safe, tailored recipes.
              </Text>
            </View>

            {/* Section 1: Lifestyle */}
            <View className="mt-6 flex-col gap-3">
              <View className="flex-row items-center gap-2">
                <Icon as={Heart} size={18} className="text-brand-primary" />
                <Text className="font-cairo text-[18px] font-bold text-text-primary">
                  Lifestyle Preferences
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {LIFESTYLES.map((item) => {
                  const isSelected = lifestyles.includes(item);
                  return (
                    <AnimatedPressable
                      key={item}
                      onPress={() => toggleLifestyle(item)}
                      hapticStyle="light"
                      className={`flex-row items-center gap-1.5 rounded-full border px-3.5 py-2 ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primary-container'
                          : 'border-surface-border bg-surface-surface'
                      }`}>
                      <Text
                        className={`font-cairo text-[13px] font-bold ${
                          isSelected ? 'text-brand-primary' : 'text-text-secondary'
                        }`}>
                        {item}
                      </Text>
                      {isSelected && <Icon as={Check} size={13} className="text-brand-primary" />}
                    </AnimatedPressable>
                  );
                })}
              </View>
            </View>

            {/* Section 2: Allergies */}
            <View className="mt-6 flex-col gap-3">
              <View className="flex-row items-center gap-2">
                <Icon as={AlertTriangle} size={18} className="text-status-warning" />
                <Text className="font-cairo text-[18px] font-bold text-text-primary">
                  Allergies & Avoidances
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {ALLERGIES.map((item) => {
                  const isSelected = allergies.includes(item);
                  return (
                    <AnimatedPressable
                      key={item}
                      onPress={() => toggleAllergy(item)}
                      hapticStyle="light"
                      className={`flex-row items-center gap-1.5 rounded-full border px-3.5 py-2 ${
                        isSelected
                          ? 'border-status-error bg-brand-error-container'
                          : 'border-surface-border bg-surface-surface'
                      }`}>
                      <Text
                        className={`font-cairo text-[13px] font-bold ${
                          isSelected ? 'text-status-error' : 'text-text-secondary'
                        }`}>
                        {item}
                      </Text>
                      {isSelected && <Icon as={Check} size={13} className="text-status-error" />}
                    </AnimatedPressable>
                  );
                })}
              </View>
            </View>

            {/* Section 3: AI Text Area */}
            <View className="mt-6 flex-col gap-2 pb-6">
              <View className="flex-row items-center gap-2">
                <Icon as={Bot} size={18} className="text-brand-accent" />
                <Text className="font-cairo text-[18px] font-bold text-text-primary">
                  ✨ Anything else? — AI Personalized
                </Text>
              </View>
              <Text className="font-cairo text-[13px] text-text-secondary">
                Tell our AI kitchen assistant any special notes, likes, or dislikes.
              </Text>
              <TextField
                placeholder="e.g. We love spicy food, prefer quick 15-min weekday meals, and no cilantro please..."
                value={aiNote}
                onChangeText={setAiNote}
                multiline
                numberOfLines={4}
                style={{ minHeight: 90, textAlignVertical: 'top', paddingTop: 12 }}
              />
            </View>
          </ScrollView>

          {/* Footer CTA */}
          <View className="border-t border-surface-border bg-surface-surface px-6 py-4">
            <Text className="mb-2 text-center font-cairo text-[12px] text-text-disabled">
              HomePal builds your personalized plan in seconds.
            </Text>
            <Button
              onPress={handleFinish}
              disabled={isLoading}
              isLoading={isLoading}
              hapticStyle="medium"
              className="h-[56px] w-full rounded-full bg-brand-primary">
              <Text className="font-cairo text-[16px] font-bold text-white">
                Finish & Create Account
              </Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
