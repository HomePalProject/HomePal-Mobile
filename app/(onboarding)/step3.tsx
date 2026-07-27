import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { TextField } from '@/src/components/ui/text-field';
import { Icon } from '@/src/components/ui/icon';
import { ArrowLeft, Users, Wallet, Check } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { saveOnboardingData } from '@/src/store/slices/authSlice';
import { onboardingStep3Schema } from '@/src/utils/validation';
import { AnimatedPressable } from '@/src/components/ui/animated-pressable';
import * as Haptics from 'expo-haptics';

const MEMBER_OPTIONS = [1, 2, 3, 4, 5];
const BUDGET_CHIPS = ['Under 3,000 EGP', '3,000–6,000 EGP', '6,000–10,000 EGP', '10,000+ EGP'];

export default function OnboardingStep3Screen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { onboardingData } = useAppSelector((state) => state.auth);

  const [memberCount, setMemberCount] = useState<number>(onboardingData?.memberCount ?? 3);
  const [monthlyBudget, setMonthlyBudget] = useState<string>(
    onboardingData?.monthlyBudget && BUDGET_CHIPS.includes(onboardingData.monthlyBudget)
      ? onboardingData.monthlyBudget
      : '3,000–6,000 EGP'
  );
  const [customBudget, setCustomBudget] = useState<string>('');
  const [isCustomBudget, setIsCustomBudget] = useState<boolean>(
    onboardingData?.monthlyBudget ? !BUDGET_CHIPS.includes(onboardingData.monthlyBudget) : false
  );
  const [errors, setErrors] = useState<{ memberCount?: string; monthlyBudget?: string }>({});

  const handleNext = () => {
    const finalBudget = isCustomBudget ? `${customBudget.trim()} EGP` : monthlyBudget;

    const result = onboardingStep3Schema.safeParse({
      memberCount,
      monthlyBudget: finalBudget,
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
      saveOnboardingData({
        memberCount,
        monthlyBudget: finalBudget,
      })
    );

    router.push('/(onboarding)/step4');
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
                <Icon as={ArrowLeft} size={20} className="text-text-primary" />
              </AnimatedPressable>
              <Text className="font-cairo text-[14px] font-bold text-text-secondary">
                Step 3 of 4
              </Text>
              <View className="w-10" />
            </View>

            {/* Progress Bar */}
            <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-surface-variant">
              <View className="h-full w-3/4 rounded-full bg-brand-primary" />
            </View>

            {/* Section 1: Member Count */}
            <View className="mt-8 flex-col gap-3">
              <View className="flex-row items-center gap-2">
                <Icon as={Users} size={20} className="text-brand-primary" />
                <Text className="font-cairo text-[22px] font-bold leading-[28px] text-text-primary">
                  How many people are we planning for?
                </Text>
              </View>
              <Text className="font-cairo text-[14px] leading-[20px] text-text-secondary">
                This helps us calculate portion sizes and grocery quantities.
              </Text>

              {/* Interactive Number Tiles */}
              <View className="mt-2 flex-row justify-between gap-2.5">
                {MEMBER_OPTIONS.map((num) => {
                  const isSelected = memberCount === num;
                  const label = num === 5 ? '5+' : `${num}`;
                  return (
                    <AnimatedPressable
                      key={num}
                      onPress={() => {
                        setMemberCount(num);
                        if (errors.memberCount) setErrors({ ...errors, memberCount: undefined });
                      }}
                      hapticStyle="medium"
                      className={`h-[60px] flex-1 items-center justify-center rounded-2xl border ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primary'
                          : 'border-surface-border bg-surface-surface'
                      }`}>
                      <Text
                        className={`font-cairo text-[18px] font-bold ${
                          isSelected ? 'text-white' : 'text-text-primary'
                        }`}>
                        {label}
                      </Text>
                    </AnimatedPressable>
                  );
                })}
              </View>
              {errors.memberCount && (
                <Text className="font-cairo text-[12px] text-status-error">
                  {errors.memberCount}
                </Text>
              )}
            </View>

            {/* Divider */}
            <View className="my-6 h-[1px] w-full bg-surface-border" />

            {/* Section 2: Monthly Budget */}
            <View className="flex-col gap-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 flex-row items-center gap-2">
                  <Icon as={Wallet} size={20} className="text-brand-primary" />
                  <Text className="font-cairo text-[22px] font-bold leading-[28px] text-text-primary">
                    Monthly grocery budget
                  </Text>
                </View>
                <AnimatedPressable
                  onPress={() => setIsCustomBudget(!isCustomBudget)}
                  hapticStyle="light">
                  <Text className="font-cairo text-[13px] font-bold text-brand-primary">
                    {isCustomBudget ? 'Pick from list' : 'Exact amount'}
                  </Text>
                </AnimatedPressable>
              </View>
              <Text className="font-cairo text-[14px] leading-[20px] text-text-secondary">
                We'll suggest meals and pantry bargains that respect your financial goal.
              </Text>

              {!isCustomBudget ? (
                <View className="mt-2 flex-col gap-2.5">
                  {BUDGET_CHIPS.map((chip) => {
                    const isSelected = monthlyBudget === chip;
                    return (
                      <AnimatedPressable
                        key={chip}
                        onPress={() => {
                          setMonthlyBudget(chip);
                          if (errors.monthlyBudget)
                            setErrors({ ...errors, monthlyBudget: undefined });
                        }}
                        hapticStyle="light"
                        className={`flex-row items-center justify-between rounded-2xl border p-4 ${
                          isSelected
                            ? 'border-brand-primary bg-brand-primary-container'
                            : 'border-surface-border bg-surface-surface'
                        }`}>
                        <Text
                          className={`font-cairo text-[15px] font-bold ${
                            isSelected ? 'text-brand-primary' : 'text-text-primary'
                          }`}>
                          {chip}
                        </Text>
                        {isSelected && (
                          <View className="h-6 w-6 items-center justify-center rounded-full bg-brand-primary">
                            <Icon as={Check} size={14} className="text-white" />
                          </View>
                        )}
                      </AnimatedPressable>
                    );
                  })}
                </View>
              ) : (
                <View className="mt-2 flex-col gap-2">
                  <TextField
                    label="Enter Custom Budget (EGP)"
                    placeholder="e.g. 7500"
                    value={customBudget}
                    onChangeText={(val) => {
                      setCustomBudget(val);
                      if (errors.monthlyBudget) setErrors({ ...errors, monthlyBudget: undefined });
                    }}
                    error={errors.monthlyBudget}
                    keyboardType="numeric"
                  />
                </View>
              )}
              {errors.monthlyBudget && !isCustomBudget && (
                <Text className="font-cairo text-[12px] text-status-error">
                  {errors.monthlyBudget}
                </Text>
              )}
            </View>
          </ScrollView>

          {/* Footer CTA */}
          <View className="border-t border-surface-border bg-surface-surface px-6 py-4">
            <Button
              onPress={handleNext}
              hapticStyle="medium"
              className="h-[56px] w-full rounded-full bg-brand-primary">
              <Text className="font-cairo text-[16px] font-bold text-white">Continue</Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
