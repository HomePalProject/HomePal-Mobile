import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { TextField } from '@/src/components/ui/text-field';
import { Icon } from '@/src/components/ui/icon';
import { ArrowLeft, MapPin, Check } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { saveTempRegistration } from '@/src/store/slices/authSlice';
import { onboardingStep2Schema } from '@/src/utils/validation';
import { AnimatedPressable } from '@/src/components/ui/animated-pressable';
import * as Haptics from 'expo-haptics';

const POPULAR_GOVERNORATES = [
  'Cairo',
  'Giza',
  'Alexandria',
  'Dakahlia',
  'Sharqia',
  'Qalyubia',
  'Port Said',
  'Gharbia',
];

export default function OnboardingStep2Screen() {
  const { t } = useTranslation(['common']);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tempRegistration } = useAppSelector((state) => state.auth);

  const [governorate, setGovernorate] = useState<string>(
    tempRegistration?.governorate && tempRegistration.governorate !== 'Unspecified'
      ? tempRegistration.governorate
      : 'Cairo'
  );
  const [customGovernorate, setCustomGovernorate] = useState<string>('');
  const [isCustomGov, setIsCustomGov] = useState<boolean>(
    tempRegistration?.governorate
      ? !POPULAR_GOVERNORATES.includes(tempRegistration.governorate)
      : false
  );
  const [city, setCity] = useState<string>(
    tempRegistration?.city && tempRegistration.city !== 'Unspecified' ? tempRegistration.city : ''
  );
  const [errors, setErrors] = useState<{ governorate?: string; city?: string }>({});

  const handleNext = () => {
    const finalGov = isCustomGov ? customGovernorate.trim() : governorate.trim();
    const result = onboardingStep2Schema.safeParse({
      governorate: finalGov,
      city: city.trim(),
    });

    if (!result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const newErrors: typeof errors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof errors;
        if (!newErrors[field]) {
          newErrors[field] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch(
      saveTempRegistration({
        governorate: finalGov,
        city: city.trim(),
      })
    );

    router.push('/(onboarding)/step3');
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
                Step 2 of 4
              </Text>
              <View className="w-10" />
            </View>

            {/* Progress Bar */}
            <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-surface-variant">
              <View className="h-full w-2/4 rounded-full bg-brand-primary" />
            </View>

            {/* Heading */}
            <View className="mt-8 flex-col gap-1">
              <Text className="font-cairo text-[26px] font-bold leading-[34px] text-text-primary">
                Location & Region
              </Text>
              <Text className="font-cairo text-[15px] leading-[22px] text-text-secondary">
                We use your location to provide accurate grocery pricing and regional food options.
              </Text>
            </View>

            {/* Form Content */}
            <View className="mt-8 flex-col gap-6">
              {/* Governorate Selector */}
              <View className="flex-col gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="font-cairo text-[15px] font-semibold text-text-primary">
                    Select Governorate
                  </Text>
                  <AnimatedPressable
                    onPress={() => setIsCustomGov(!isCustomGov)}
                    hapticStyle="light">
                    <Text className="font-cairo text-[13px] font-bold text-brand-primary">
                      {isCustomGov ? 'Pick from list' : 'Other governorate'}
                    </Text>
                  </AnimatedPressable>
                </View>

                {!isCustomGov ? (
                  <View className="flex-row flex-wrap gap-2.5">
                    {POPULAR_GOVERNORATES.map((gov) => {
                      const isSelected = governorate === gov;
                      return (
                        <AnimatedPressable
                          key={gov}
                          onPress={() => {
                            setGovernorate(gov);
                            if (errors.governorate)
                              setErrors({ ...errors, governorate: undefined });
                          }}
                          hapticStyle="light"
                          className={`flex-row items-center gap-1.5 rounded-full border px-4 py-2.5 ${
                            isSelected
                              ? 'border-brand-primary bg-brand-primary-container'
                              : 'border-surface-border bg-surface-surface'
                          }`}>
                          <Text
                            className={`font-cairo text-[14px] font-bold ${
                              isSelected ? 'text-brand-primary' : 'text-text-secondary'
                            }`}>
                            {gov}
                          </Text>
                          {isSelected && (
                            <Icon as={Check} size={14} className="text-brand-primary" />
                          )}
                        </AnimatedPressable>
                      );
                    })}
                  </View>
                ) : (
                  <TextField
                    label="Enter Governorate Name"
                    placeholder="e.g. Aswan or Red Sea"
                    value={customGovernorate}
                    onChangeText={(val) => {
                      setCustomGovernorate(val);
                      if (errors.governorate) setErrors({ ...errors, governorate: undefined });
                    }}
                    error={errors.governorate}
                  />
                )}
                {errors.governorate && !isCustomGov && (
                  <Text className="font-cairo text-[12px] text-status-error">
                    {errors.governorate}
                  </Text>
                )}
              </View>

              {/* City Input */}
              <View className="flex-col gap-2">
                <TextField
                  label="City / District"
                  placeholder="e.g. Nasr City, Maadi, 6th of October"
                  value={city}
                  onChangeText={(val) => {
                    setCity(val);
                    if (errors.city) setErrors({ ...errors, city: undefined });
                  }}
                  error={errors.city}
                />
                <View className="flex-row items-center gap-1.5 px-1">
                  <Icon as={MapPin} size={14} className="text-text-disabled" />
                  <Text className="font-cairo text-[12px] text-text-disabled">
                    Your neighborhood helps find nearby supermarket deals.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer CTA */}
          <View className="border-t border-surface-border bg-surface-surface px-6 py-4">
            <Button
              onPress={handleNext}
              hapticStyle="medium"
              className="h-[56px] w-full rounded-full bg-brand-primary">
              <Text className="font-cairo text-[16px] font-bold text-white">
                {t('common:buttons.continue', 'Continue')}
              </Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
