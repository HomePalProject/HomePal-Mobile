import React from 'react';
import { View, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { Icon } from '@/src/components/ui/icon';
import { cn } from '@/src/utils';
import { CreateHouseholdForm } from '../hooks/useCreateHousehold';

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

// Inline field component styled to match the reference exactly
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
          'text-on-surface font-cairo text-[14px] font-semibold leading-[20px] tracking-[0.01em]',
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
          'bg-surface-variant text-on-surface h-[52px] w-full rounded-xl border border-transparent px-4 font-cairo text-[16px] leading-[24px]',
          'focus:border-2 focus:border-brand-primary',
          error && 'border-brand-error'
        )}
      />

      {/* Error message */}
      {error ? (
        <Text className="font-cairo text-[12px] font-medium leading-[16px] text-brand-error">
          {error}
        </Text>
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
  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['top', 'bottom']}>
      {/* ── Header ── white bg with subtle shadow, matching reference */}
      <View className="h-16 w-full flex-row items-center justify-between bg-surface-surface px-6 shadow-sm">
        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={onBack}
            className="active:bg-surface-surfaceVariant rounded-full p-1.5"
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Icon as={ArrowLeft} size={26} className="text-on-surface" />
          </Pressable>
          <Text className="font-cairo text-[22px] font-bold leading-[30px] text-brand-primary">
            Create Household
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
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 12, gap: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Welcome Section — large bold green headline matching reference h2 */}
        <View style={{ gap: 8 }}>
          <Text className="font-cairo text-[22px] font-bold leading-[30px] text-brand-primary">
            Welcome to HomePal
          </Text>
          <Text className="font-cairo text-[16px] leading-[24px] text-text-secondary">
            Set up your household to start managing your pantry, recipes, and budget together with
            your family.
          </Text>
        </View>

        {/* ── Gradient Phase Banner ── h-48, neutral sage base, top-transparent → primary/40 bottom */}
        <View
          className="h-48 w-full overflow-hidden rounded-2xl"
          style={{ backgroundColor: '#C8D5D0' }}>
          <LinearGradient
            colors={['transparent', 'rgba(27, 80, 66, 0.55)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1, justifyContent: 'flex-end', padding: 24 }}>
            <Text className="font-cairo text-[12px] font-semibold leading-[16px] tracking-[0.02em] text-white/80">
              Phase 1
            </Text>
            <Text className="font-cairo text-[20px] font-semibold leading-[28px] text-white">
              Identity &amp; Location
            </Text>
          </LinearGradient>
        </View>

        {/* ── Form Card ── pure white, subtle shadow matching reference */}
        <View
          className="bg-surface-card rounded-2xl border border-r-2"
          style={{
            padding: 24,
            gap: 16,
          }}>
          {/* Household Name */}
          <FormField
            label="Household Name"
            required
            placeholder="e.g., My Lovely Home"
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
            label="Address"
            placeholder="123 Street Name"
            value={formData.address}
            onChangeText={(t) => onChangeField('address', t)}
            error={errors.address}
            autoCapitalize="sentences"
            returnKeyType="next"
            editable={!isLoading}
          />

          {/* Governorate */}
          <FormField
            label="Governorate"
            placeholder="e.g., Cairo"
            value={formData.governorate}
            onChangeText={(t) => onChangeField('governorate', t)}
            error={errors.governorate}
            autoCapitalize="words"
            returnKeyType="next"
            editable={!isLoading}
          />

          {/* City */}
          <FormField
            label="City"
            placeholder="e.g., Maadi"
            value={formData.city}
            onChangeText={(t) => onChangeField('city', t)}
            error={errors.city}
            autoCapitalize="words"
            returnKeyType="done"
            editable={!isLoading}
          />

          {/* ── Info Tip ── bg-primary-container/30 matching reference */}
          <View
            className="border-brand-primary/10 bg-brand-primary-container/30 flex-row items-start gap-3 rounded-xl border"
            style={{ marginTop: 8, padding: 16 }}>
            <View className="mt-0.5">
              <Icon as={Info} size={20} className="text-brand-primary" />
            </View>
            <Text className="flex-1 font-cairo text-[14px] leading-[20px] text-text-secondary">
              Providing your location helps us suggest local recipes and optimize your grocery
              budget based on regional market prices.
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
            Save &amp; Register Household
          </Text>
          {!isLoading && <Icon as={ArrowRight} size={22} className="text-white" />}
        </Button>
      </View>
    </SafeAreaView>
  );
}
