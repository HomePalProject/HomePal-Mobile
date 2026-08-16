import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { DatePicker } from '@/src/components/ui/date-picker';
import { Icon } from '@/src/components/ui/icon';
import { ArrowLeft, User, Check } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { saveTempRegistration } from '@/src/store/slices/authSlice';
import { onboardingStep1Schema } from '@/src/utils/validation';
import { Gender } from '@/src/types/api';
import { AnimatedPressable } from '@/src/components/ui/animated-pressable';
import * as Haptics from 'expo-haptics';

export default function OnboardingStep1Screen() {
  const { t } = useTranslation(['common']);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tempRegistration } = useAppSelector((state) => state.auth);

  const [gender, setGender] = useState<Gender | null>(tempRegistration?.gender ?? Gender.Male);
  const [birthDate, setBirthDate] = useState<string>(tempRegistration?.birthDate ?? '2000-01-01');
  const [errors, setErrors] = useState<{ gender?: string; birthDate?: string }>({});

  const handleNext = () => {
    const result = onboardingStep1Schema.safeParse({
      gender,
      birthDate: birthDate.trim(),
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
        gender: gender as Gender,
        birthDate: birthDate.trim(),
      })
    );

    router.push('/(onboarding)/step2');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <View className="flex-1 justify-between">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6 py-4"
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
              Step 1 of 4
            </Text>
            <View className="w-10" />
          </View>

          {/* Progress Bar */}
          <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-surface-variant">
            <View className="h-full w-1/4 rounded-full bg-brand-primary" />
          </View>

          {/* Heading */}
          <View className="mt-8 flex-col gap-1">
            <Text className="font-cairo text-[26px] font-bold leading-[34px] text-text-primary">
              Personal Profile
            </Text>
            <Text className="font-cairo text-[15px] leading-[22px] text-text-secondary">
              Tell us a little about yourself to help tailor your HomePal experience.
            </Text>
          </View>

          {/* Form Content */}
          <View className="mt-8 flex-col gap-6">
            {/* Gender Selector */}
            <View className="flex-col gap-3">
              <Text className="font-cairo text-[15px] font-semibold text-text-primary">
                Select your gender
              </Text>
              <View className="flex-row gap-3">
                {[
                  { label: 'Male', value: Gender.Male },
                  { label: 'Female', value: Gender.Female },
                ].map((item) => {
                  const isSelected = gender === item.value;
                  return (
                    <AnimatedPressable
                      key={item.label}
                      onPress={() => {
                        setGender(item.value);
                        if (errors.gender) setErrors({ ...errors, gender: undefined });
                      }}
                      hapticStyle="medium"
                      className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl border p-4 ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primary-container'
                          : 'border-surface-border bg-surface-surface'
                      }`}>
                      <Icon
                        as={User}
                        size={18}
                        className={isSelected ? 'text-brand-primary' : 'text-text-secondary'}
                      />
                      <Text
                        className={`font-cairo text-[15px] font-bold ${
                          isSelected ? 'text-brand-primary' : 'text-text-secondary'
                        }`}>
                        {item.label}
                      </Text>
                      {isSelected && (
                        <View className="ms-1 h-5 w-5 items-center justify-center rounded-full bg-brand-primary">
                          <Icon as={Check} size={12} className="text-white" />
                        </View>
                      )}
                    </AnimatedPressable>
                  );
                })}
              </View>
              {errors.gender && (
                <Text className="font-cairo text-[12px] text-status-error">{errors.gender}</Text>
              )}
            </View>

            {/* Birth Date Picker */}
            <View className="flex-col gap-2">
              <DatePicker
                label="Birth Date"
                value={birthDate}
                onChange={(val) => {
                  setBirthDate(val);
                  if (errors.birthDate) setErrors({ ...errors, birthDate: undefined });
                }}
                error={errors.birthDate}
              />
              <Text className="px-1 font-cairo text-[12px] text-text-disabled">
                You must be at least 13 years old to use HomePal.
              </Text>
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
    </SafeAreaView>
  );
}
