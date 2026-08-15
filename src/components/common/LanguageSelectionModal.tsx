import React from 'react';
import { View, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { useLanguage, LanguageOption } from '@/src/localization';

export interface LanguageSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export function LanguageSelectionModal({ visible, onClose }: LanguageSelectionModalProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation(['profile', 'common']);
  const { currentLanguage, changeLanguage } = useLanguage();

  const handleSelect = async (option: LanguageOption) => {
    onClose();
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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          className="w-full rounded-t-3xl border-t border-surface-border bg-surface-surface px-6 pt-6 shadow-xl"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 24 }}
          onPress={(e) => e.stopPropagation()}>
          <View className="mb-6 items-center">
            <View className="mb-4 h-1.5 w-12 rounded-full bg-surface-border" />
            <Text className="font-cairo text-xl font-bold text-text-primary">
              {t('profile:chooseLanguage', 'Choose Language')}
            </Text>
          </View>

          <View className="overflow-hidden rounded-xl bg-surface-surfaceVariant px-4">
            {renderOption('system', t('common:labels.systemDefault', 'System Default'))}
            {renderOption('en', 'English')}
            {renderOption('ar', 'العربية')}
          </View>

          <Pressable
            onPress={onClose}
            className="mt-6 h-12 flex-row items-center justify-center rounded-radius-medium bg-brand-primary shadow-sm active:opacity-90">
            <Text className="font-cairo text-base font-bold text-white">
              {t('common:buttons.done', 'Done')}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
