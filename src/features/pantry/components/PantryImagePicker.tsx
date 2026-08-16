import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Camera, ImageIcon, Pencil } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { useTranslation } from 'react-i18next';

interface PantryImagePickerProps {
  imageUri?: string | null;
  onPickerPress?: () => void;
  onScanPress?: () => void;
}

export function PantryImagePicker({
  imageUri,
  onPickerPress,
  onScanPress,
}: PantryImagePickerProps) {
  const { t } = useTranslation('pantry');
  return (
    <View className="items-center gap-spacing-16 py-spacing-8">
      {/* Image Container */}
      <Pressable
        onPress={onPickerPress}
        className="relative w-full"
        accessibilityRole="button"
        accessibilityLabel="Pick item image">
        {imageUri ? (
          /* Image with floating edit badge */
          <View className="bg-surface-surfaceVariant h-32 w-full overflow-hidden rounded-radius-large border border-surface-border">
            <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="cover" />
            {/* Floating Pencil Edit Badge */}
            {/* <View className="absolute bottom-2 right-2 h-8 w-8 items-center justify-center rounded-radius-full border border-surface-border bg-surface-surface shadow-sm">
              <Icon as={Pencil} size={14} className="text-text-primary" />
            </View> */}
          </View>
        ) : (
          /* Dashed Placeholder Container */
          <View
            className="py-spacing-20 h-32 w-full items-center justify-center rounded-radius-large bg-surface-surface px-spacing-24"
            style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: '#CBD1D8' }}>
            <Icon as={ImageIcon} size={32} className="mb-spacing-8 text-text-disabled" />
            <Text className="text-caption text-center font-cairo text-text-secondary">
              {t('noImageAdded', 'No image added')}
            </Text>
          </View>
        )}
      </Pressable>

      {/* Scan Items Button */}
      <Pressable
        onPress={onScanPress}
        className="flex-row items-center gap-spacing-8 rounded-radius-full border border-surface-border bg-surface-surface px-spacing-24 py-spacing-16 shadow-sm active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel={t('scanItems', 'Scan Items')}>
        <Icon as={Camera} size={16} className="text-text-primary" />
        <Text className="text-body font-cairo font-bold text-text-primary">
          {t('scanItems', 'Scan Items')}
        </Text>
      </Pressable>
    </View>
  );
}
