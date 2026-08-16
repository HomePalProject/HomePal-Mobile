import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { DatePicker } from '@/src/components/ui/date-picker';
import { AddOfflineMemberPayload } from '@/src/features/households/hooks/useHouseholdMembers';
import { useTranslation } from 'react-i18next';

export interface AddOfflineMemberFormProps {
  onSubmit: (payload: AddOfflineMemberPayload) => void;
}

export function AddOfflineMemberForm({ onSubmit }: AddOfflineMemberFormProps) {
  const { t } = useTranslation('households');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  const [isGenderPickerOpen, setIsGenderPickerOpen] = useState(false);

  const toggleGenderPicker = () => {
    setIsGenderPickerOpen((prev) => !prev);
  };

  const handleSubmit = () => {
    onSubmit({ fullName, gender, dob });
  };

  return (
    <View
      className="bg-surface-surfaceVariant/40 rounded-2xl border border-surface-border p-4"
      style={{ gap: 14 }}>
      {/* Field 1: Full Name */}
      <View style={{ gap: 6 }}>
        <Text className="font-cairo text-[14px] font-bold text-text-primary">
          {t('membersList.fullName')}
        </Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder={t('membersList.fullNamePlaceholder')}
          placeholderClassName="text-text-disabled"
          className="bg-surface-variant rounded-xl border border-surface-border px-3.5 py-2.5 font-cairo text-[15px] text-text-primary"
        />
      </View>

      {/* Field 2 & 3: Gender & DOB side by side */}
      <View className="flex-row gap-3">
        {/* Gender Select */}
        <View className="flex-1" style={{ gap: 6 }}>
          <Text className="font-cairo text-[14px] font-bold text-text-primary">
            {t('membersList.gender')}
          </Text>
          <Pressable
            onPress={toggleGenderPicker}
            className="bg-surface-variant flex-row items-center justify-between rounded-xl border border-surface-border px-3.5 py-2.5 active:opacity-80">
            <Text
              className={`font-cairo text-[14px] ${gender ? 'text-text-primary' : 'text-text-disabled'}`}>
              {gender
                ? gender === 'Male'
                  ? t('membersList.male')
                  : t('membersList.female')
                : t('membersList.select')}
            </Text>
            <Icon as={ChevronDown} size={18} className="text-text-primary" />
          </Pressable>
        </View>

        {/* DOB Input */}
        <View className="flex-1" style={{ gap: 6 }}>
          <DatePicker
            label={t('membersList.dob')}
            value={dob}
            onChange={setDob}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>

      {/* Inline Gender Picker Options Accordion */}
      {isGenderPickerOpen && (
        <View className="mt-1 w-full rounded-xl border border-surface-border bg-surface-surface p-1 shadow-sm">
          {['Male', 'Female'].map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                setGender(option);
                setIsGenderPickerOpen(false);
              }}
              className="active:bg-surface-surfaceVariant rounded-lg px-4 py-2.5">
              <Text className="font-cairo text-[14px] font-semibold text-text-primary">
                {option === 'Male' ? t('membersList.male') : t('membersList.female')}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Action Button: Save Member */}
      <Pressable
        onPress={handleSubmit}
        className="mt-2 flex-row items-center justify-center rounded-xl bg-brand-primary py-3 active:opacity-90"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}>
        <Text className="font-cairo text-[14px] font-bold text-text-inverse">
          {t('membersList.saveMember')}
        </Text>
      </Pressable>
    </View>
  );
}
