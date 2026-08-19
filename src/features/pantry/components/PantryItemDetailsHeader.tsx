import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { BackButton } from '@/src/components/ui/back-button';
import { useTranslation } from 'react-i18next';

interface PantryItemDetailsHeaderProps {
  onBackPress: () => void;
  onEditPress: () => void;
}

export function PantryItemDetailsHeader({
  onBackPress,
  onEditPress,
}: PantryItemDetailsHeaderProps) {
  const { t } = useTranslation('pantry');
  return (
    <View className="py-spacing-12 flex-row items-center justify-between border-b border-surface-border bg-surface-surface px-spacing-16">
      {/* Back Button */}
      <BackButton onPress={onBackPress} />

      {/* Screen Title */}
      <Text className="font-cairo text-xl font-bold text-text-primary">
        {t('itemDetail', 'Item Detail')}
      </Text>

      {/* Edit (Pencil) Button */}
      <Pressable
        onPress={onEditPress}
        className="bg-surface-surfaceVariant h-10 w-10 items-center justify-center rounded-radius-full active:scale-90 active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel={t('editPantryItem', 'Edit Item')}>
        <Icon as={Pencil} size={20} className="text-text-primary" />
      </Pressable>
    </View>
  );
}
