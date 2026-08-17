import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { Icon } from '@/src/components/ui/icon';
import { ArrowLeft, MapPin, Building } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { saveTempRegistration } from '@/src/store/slices/authSlice';
import { onboardingStep2Schema } from '@/src/utils/validation';
import { AnimatedPressable } from '@/src/components/ui/animated-pressable';
import * as Haptics from 'expo-haptics';
import { LocationSelectorModal } from '@/src/components/ui/LocationSelectorModal';
import { cn } from '@/src/utils';

interface PressableFieldProps {
  label: string;
  required?: boolean;
  placeholder: string;
  value: string;
  onPress: () => void;
  error?: string;
}

function PressableField({
  label,
  required,
  placeholder,
  value,
  onPress,
  error,
}: PressableFieldProps) {
  return (
    <View style={{ gap: 6 }}>
      {/* Label */}
      <Text
        className={cn(
          'font-cairo text-[14px] font-semibold text-text-primary',
          error && 'text-brand-error'
        )}>
        {label}
        {required && <Text className="text-brand-error"> *</Text>}
      </Text>

      {/* Input */}
      <AnimatedPressable
        onPress={onPress}
        hapticStyle="light"
        className={cn(
          'h-[52px] w-full justify-center rounded-xl border bg-surface-surface-variant px-4',
          error ? 'border-brand-error' : 'border-surface-border/60'
        )}>
        <Text
          className={cn('font-cairo text-[16px]', value ? 'text-text-primary' : 'text-[#A8A29B]')}>
          {value || placeholder}
        </Text>
      </AnimatedPressable>
      {error && <Text className="mt-1 font-cairo text-[12px] text-brand-error">{error}</Text>}
    </View>
  );
}

export default function OnboardingStep2Screen() {
  const { t } = useTranslation(['common']);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tempRegistration } = useAppSelector((state) => state.auth);

  const [governorateId, setGovernorateId] = useState<string | null>(
    tempRegistration?.governorateId || null
  );
  const [governorateName, setGovernorateName] = useState<string>(
    tempRegistration?.governorateName || ''
  );

  const [cityId, setCityId] = useState<string | null>(tempRegistration?.cityId || null);
  const [cityName, setCityName] = useState<string>(tempRegistration?.cityName || '');

  const [errors, setErrors] = useState<{ governorateId?: string; cityId?: string }>({});

  const [selectorType, setSelectorType] = useState<'governorate' | 'city'>('governorate');
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);

  const handleNext = () => {
    const result = onboardingStep2Schema.safeParse({
      governorateId: governorateId,
      cityId: cityId,
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
        governorateId: governorateId!,
        cityId: cityId!,
        governorateName,
        cityName,
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
              {/* Governorate Input */}
              <PressableField
                label="Select Governorate"
                placeholder="e.g. Cairo"
                value={governorateName}
                onPress={() => {
                  setSelectorType('governorate');
                  setIsSelectorVisible(true);
                  if (errors.governorateId) setErrors({ ...errors, governorateId: undefined });
                }}
                error={errors.governorateId}
              />

              {/* City Input */}
              <View className="flex-col gap-2">
                <PressableField
                  label="City / District"
                  placeholder="e.g. Nasr City, Maadi, 6th of October"
                  value={cityName}
                  onPress={() => {
                    setSelectorType('city');
                    setIsSelectorVisible(true);
                    if (errors.cityId) setErrors({ ...errors, cityId: undefined });
                  }}
                  error={errors.cityId}
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

      <LocationSelectorModal
        visible={isSelectorVisible}
        onClose={() => setIsSelectorVisible(false)}
        type={selectorType}
        governorateId={governorateId}
        selectedId={selectorType === 'governorate' ? governorateId : cityId}
        onSelect={(id, name) => {
          if (selectorType === 'governorate') {
            setGovernorateId(id);
            setGovernorateName(name);
            if (governorateId !== id) {
              setCityId(null);
              setCityName('');
            }
          } else {
            setCityId(id);
            setCityName(name);
          }
        }}
      />
    </SafeAreaView>
  );
}
