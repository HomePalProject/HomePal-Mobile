import React, { useState } from 'react';
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
import { LocationSelectorModal } from '@/src/components/ui/LocationSelectorModal';

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
          'h-[52px] w-full rounded-xl border bg-surface-surface-variant px-4 font-cairo text-[16px] text-text-primary',
          error ? 'border-brand-error' : 'border-surface-border/60',
          !editable && 'opacity-50'
        )}
      />
      {error && <Text className="mt-1 font-cairo text-[12px] text-brand-error">{error}</Text>}
    </View>
  );
}

interface PressableFieldProps {
  label: string;
  required?: boolean;
  placeholder: string;
  value: string;
  onPress: () => void;
  error?: string;
  editable?: boolean;
}

function PressableField({
  label,
  required,
  placeholder,
  value,
  onPress,
  error,
  editable = true,
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
      <Pressable
        onPress={editable ? onPress : undefined}
        className={cn(
          'h-[52px] w-full justify-center rounded-xl border bg-surface-surface-variant px-4',
          error ? 'border-brand-error' : 'border-surface-border/60',
          !editable && 'opacity-50'
        )}>
        <Text
          className={cn('font-cairo text-[16px]', value ? 'text-text-primary' : 'text-[#A8A29B]')}>
          {value || placeholder}
        </Text>
      </Pressable>
      {error && <Text className="mt-1 font-cairo text-[12px] text-brand-error">{error}</Text>}
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
  const [selectorType, setSelectorType] = useState<'governorate' | 'city'>('governorate');
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);

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
        <View className="h-10 w-10 overflow-hidden rounded-full border-2 border-brand-primary/10 bg-brand-primary-container">
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
        <View className="bg-surface-surfaceVariant h-48 w-full overflow-hidden rounded-2xl border border-surface-border/30 shadow-sm">
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
          <PressableField
            label={t('create.governorateLabel')}
            placeholder={t('create.governoratePlaceholder')}
            value={formData.governorate}
            onPress={() => {
              setSelectorType('governorate');
              setIsSelectorVisible(true);
            }}
            error={errors.governorate}
            editable={!isLoading}
          />

          {/* City */}
          <PressableField
            label={t('create.cityLabel')}
            placeholder={t('create.cityPlaceholder')}
            value={formData.city}
            onPress={() => {
              setSelectorType('city');
              setIsSelectorVisible(true);
            }}
            error={errors.city}
            editable={!isLoading}
          />

          {/* ── Info Tip ── */}
          <View className="mt-2 flex-row items-start gap-3 rounded-xl border border-brand-primary/10 bg-brand-primary-container/40 p-4">
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
      <View className="w-full bg-surface-surface/80 px-6 py-4">
        <Button
          onPress={onSubmit}
          isLoading={isLoading}
          className="h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-brand-primary shadow-lg active:bg-brand-primary-pressed">
          <Text className="font-cairo text-[20px] font-semibold leading-[28px] text-white">
            {t('create.saveBtn')}
          </Text>
          {!isLoading && (
            <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
              <Icon as={ArrowRight} directional size={22} className="text-white" />
            </View>
          )}
        </Button>
      </View>

      <LocationSelectorModal
        visible={isSelectorVisible}
        onClose={() => setIsSelectorVisible(false)}
        type={selectorType}
        governorateId={formData.governorateId}
        selectedId={selectorType === 'governorate' ? formData.governorateId : formData.cityId}
        onSelect={(id, name) => {
          if (selectorType === 'governorate') {
            onChangeField('governorateId' as keyof CreateHouseholdForm, id);
            onChangeField('governorate' as keyof CreateHouseholdForm, name);
            if (formData.governorateId !== id) {
              onChangeField('cityId' as keyof CreateHouseholdForm, '');
              onChangeField('city' as keyof CreateHouseholdForm, '');
            }
          } else {
            onChangeField('cityId' as keyof CreateHouseholdForm, id);
            onChangeField('city' as keyof CreateHouseholdForm, name);
          }
        }}
      />
    </SafeAreaView>
  );
}
