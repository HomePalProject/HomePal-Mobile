import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

interface AIScanActionButtonsProps {
  hasSelections: boolean;
  isSaving: boolean;
  onAddPress: () => void;
  onCancelPress: () => void;
}

export function AIScanActionButtons({
  hasSelections,
  isSaving,
  onAddPress,
  onCancelPress,
}: AIScanActionButtonsProps) {
  const { t } = useTranslation('pantry');
  return (
    <View className="mt-spacing-8 flex-col gap-spacing-16 border-t border-surface-border pt-spacing-16">
      <Pressable
        onPress={onAddPress}
        disabled={isSaving || !hasSelections}
        className={[
          'w-full flex-row items-center justify-center rounded-radius-full py-spacing-16 active:opacity-85',
          isSaving || !hasSelections ? 'bg-brand-primary/50' : 'bg-brand-primary',
        ].join(' ')}
        accessibilityRole="button"
        accessibilityLabel={t('addSelectedItems', 'Add Selected Items')}>
        {isSaving ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text className="text-body font-cairo font-bold text-text-inverse">
            {t('addSelectedItems', 'Add Selected Items')}
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={onCancelPress}
        disabled={isSaving}
        className="w-full items-center justify-center rounded-radius-full border border-surface-border bg-surface-surface py-spacing-16 active:opacity-75 disabled:opacity-50"
        accessibilityRole="button"
        accessibilityLabel={t('cancel', 'Cancel')}>
        <Text className="text-body font-cairo font-bold text-text-primary">
          {t('cancel', 'Cancel')}
        </Text>
      </Pressable>
    </View>
  );
}
