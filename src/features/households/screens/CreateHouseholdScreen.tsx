import React from 'react';
import { View, ScrollView, Pressable, Image, TextInput, I18nManager } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Info } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { Icon } from '@/src/components/ui/icon';
import { BackButton } from '@/src/components/ui/back-button';
import { cn } from '@/src/utils';
import { CreateHouseholdForm } from '../hooks/useCreateHousehold';
import { useTranslation } from 'react-i18next';

export interface CreateHouseholdScreenProps {
  formData: CreateHouseholdForm;
  errors: Partial<Record<keyof CreateHouseholdForm, string>>;
  isLoading: boolean;
  onChangeField: (field: keyof CreateHouseholdForm, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  userAvatarUri: string | null;
  userInitials: string;
}

// Inline field component styled for a professional look
interface FieldProps {
  label: string;
  required?: boolean;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  returnKeyType?: 'next' | 'done' | 'go' | 'search' | 'send';
  editable?: boolean;
}

function FormField({
  label,
  required,
  placeholder,
  value,
  onChangeText,
  error,
  autoCapitalize = 'sentences',
  autoCorrect = false,
  returnKeyType = 'next',
  editable = true,
}: FieldProps) {
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
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A8A29B"
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        returnKeyType={returnKeyType}
        editable={editable}
        className={cn(
          'bg-surface-variant h-[52px] w-full rounded-xl border px-4 font-cairo text-[16px] text-text-primary',
          error ? 'border-brand-error' : 'border-surface-border/60',
          'focus:border-2 focus:border-brand-primary'
        )}
      />

      {/* Error message */}
      {error ? (
        <Text className="font-cairo text-[12px] font-medium text-brand-error">{error}</Text>
      ) : null}
    </View>
  );
}

export function CreateHouseholdScreen({
  formData,
  errors,
  isLoading,
  onChangeField,
  onSubmit,
  onBack,
  userAvatarUri,
  userInitials,
}: CreateHouseholdScreenProps) {
  const { t } = useTranslation('households');
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['bottom', 'left', 'right']}>
      {/* ── Header ── white bg with subtle shadow, matching reference */}
      <View
        className="z-10 w-full flex-row items-center justify-between bg-surface-surface px-6 pb-3 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 16) + 12 }}>
        <View className="flex-row items-center gap-4">
          <BackButton onPress={onBack} />
          <Text className="font-cairo text-[20px] font-bold text-text-primary">
            {t('create.title')}
          </Text>
        </View>

        {/* Avatar */}
        <View className="border-brand-primary/10 h-10 w-10 overflow-hidden rounded-full border-2 bg-brand-primary-container">
          {userAvatarUri ? (
            <Image source={{ uri: userAvatarUri }} className="h-full w-full" resizeMode="cover" />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="font-cairo text-[15px] font-bold text-brand-primary">
                {userInitials}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 32, gap: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Welcome Section */}
        <View style={{ gap: 8 }}>
          <Text className="font-cairo text-[24px] font-bold leading-[32px] text-text-primary">
            {t('create.welcome')}
          </Text>
          <Text className="font-cairo text-[16px] leading-[24px] text-text-secondary">
            {t('create.subtitle')}
          </Text>
        </View>

        {/* ── Image Phase Banner ── */}
        <View className="bg-surface-surfaceVariant border-surface-border/30 h-48 w-full overflow-hidden rounded-2xl border shadow-sm">
          <Image
            source={require('../../../assets/images/household_creation_banner.jpg')}
            className="absolute h-full w-full opacity-90"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(27, 80, 66, 0.85)']}
            start={{ x: 0.5, y: 0.2 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1, justifyContent: 'flex-end', padding: 20 }}>
            {/* <Text className="font-cairo text-[13px] font-bold uppercase tracking-[0.05em] text-brand-primary-container/90 mb-1">
              Phase 1
            </Text> */}
            <Text className="font-cairo text-[22px] font-bold text-white">
              {t('create.identityPhase')}
            </Text>
          </LinearGradient>
        </View>

        {/* ── Form Card ── pure white, subtle shadow */}
        <View
          className="rounded-2xl border border-surface-border bg-surface-surface p-6 shadow-sm"
          style={{ gap: 20 }}>
          {/* Household Name */}
          <FormField
            label={t('create.nameLabel')}
            required
            placeholder={t('create.namePlaceholder')}
            value={formData.name}
            onChangeText={(t) => onChangeField('name', t)}
            error={errors.name}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            editable={!isLoading}
          />

          {/* Address */}
          <FormField
            label={t('create.addressLabel')}
            placeholder={t('create.addressPlaceholder')}
            value={formData.address}
            onChangeText={(t) => onChangeField('address', t)}
            error={errors.address}
            autoCapitalize="sentences"
            returnKeyType="next"
            editable={!isLoading}
          />

          {/* Governorate */}
          <FormField
            label={t('create.governorateLabel')}
            placeholder={t('create.governoratePlaceholder')}
            value={formData.governorate}
            onChangeText={(t) => onChangeField('governorate', t)}
            error={errors.governorate}
            autoCapitalize="words"
            returnKeyType="next"
            editable={!isLoading}
          />

          {/* City */}
          <FormField
            label={t('create.cityLabel')}
            placeholder={t('create.cityPlaceholder')}
            value={formData.city}
            onChangeText={(t) => onChangeField('city', t)}
            error={errors.city}
            autoCapitalize="words"
            returnKeyType="done"
            editable={!isLoading}
          />

          {/* ── Info Tip ── */}
          <View className="border-brand-primary/10 bg-brand-primary-container/40 mt-2 flex-row items-start gap-3 rounded-xl border p-4">
            <View className="mt-0.5">
              <Icon as={Info} size={20} className="text-brand-primary" />
            </View>
            <Text className="flex-1 font-cairo text-[13px] font-medium leading-[20px] text-text-secondary">
              {t('create.locationTip')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky Footer — white/translucent bg, rounded-xl button matching reference ── */}
      <View className="bg-surface-surface/80 w-full px-6 py-4">
        <Button
          onPress={onSubmit}
          isLoading={isLoading}
          className="h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-brand-primary shadow-lg active:bg-brand-primary-pressed">
          <Text className="font-cairo text-[20px] font-semibold leading-[28px] text-white">
            {t('create.saveBtn')}
          </Text>
          {!isLoading && (
            <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
              <Icon as={ArrowRight} size={22} className="text-white" />
            </View>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
}
