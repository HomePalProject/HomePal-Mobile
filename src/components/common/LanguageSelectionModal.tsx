import React, { forwardRef } from 'react';
import { View, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { useLanguage, LanguageOption } from '@/src/localization';
import { AppBottomSheet } from '@/src/components/ui/bottom-sheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export const LanguageSelectionModal = forwardRef<BottomSheetModal>((_props, ref) => {
  const { t } = useTranslation(['profile', 'common']);
  const { currentLanguage, changeLanguage } = useLanguage();

  const dismiss = () => {
    if (ref && typeof ref === 'object') {
      ref.current?.dismiss();
    }
  };

  const handleSelect = async (option: LanguageOption) => {
    dismiss();
    await changeLanguage(option);
  };

  const renderOption = (option: LanguageOption, label: string) => {
    const isSelected = currentLanguage === option;
    return (
      <Pressable
        key={option}
        onPress={() => handleSelect(option)}
        className="flex-row items-center justify-between border-b border-surface-border py-4 active:opacity-70">
        <Text
          className={`font-cairo text-base ${isSelected ? 'font-bold text-brand-primary' : 'text-text-primary'}`}>
          {label}
        </Text>
        {isSelected && <Icon as={Check} size={20} className="text-brand-primary" />}
      </Pressable>
    );
  };

  return (
    <AppBottomSheet ref={ref} enablePanDownToClose>
      <View className="px-6 pb-6">
        <View className="mb-6 items-center">
          <Text className="font-cairo text-xl font-bold text-text-primary">
            {t('profile:chooseLanguage', 'Choose Language')}
          </Text>
        </View>

        <View className="bg-surface-surfaceVariant overflow-hidden rounded-xl px-4">
          {renderOption('system', t('common:labels.systemDefault', 'System Default'))}
          {renderOption('en', 'English')}
          {renderOption('ar', 'العربية')}
        </View>

        <Pressable
          onPress={dismiss}
          className="mt-6 h-12 flex-row items-center justify-center rounded-radius-medium bg-brand-primary shadow-sm active:opacity-90">
          <Text className="font-cairo text-base font-bold text-white">
            {t('common:buttons.done', 'Done')}
          </Text>
        </Pressable>
      </View>
    </AppBottomSheet>
  );
});

LanguageSelectionModal.displayName = 'LanguageSelectionModal';
