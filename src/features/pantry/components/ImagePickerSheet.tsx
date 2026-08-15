import React, { forwardRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { AppBottomSheet } from '@/src/components/ui/bottom-sheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

interface ImagePickerSheetProps {
  onClose?: () => void;
  onTakePhoto: () => void;
  onChooseFromGallery: () => void;
}

export const ImagePickerSheet = forwardRef<BottomSheetModal, ImagePickerSheetProps>(
  ({ onClose, onTakePhoto, onChooseFromGallery }, ref) => {
    const bottomSheetRef = ref as React.RefObject<BottomSheetModal>;

    return (
      <AppBottomSheet ref={ref} onDismiss={onClose} enablePanDownToClose snapPoints={['35%']}>
        <View className="px-spacing-24 pb-spacing-32">
          {/* Title */}
          <Text className="mb-spacing-20 text-center font-cairo text-base font-bold text-text-primary">
            Scan Receipt or Items
          </Text>

          {/* Action List */}
          <View className="w-full gap-spacing-8">
            {/* Take photo option */}
            <Pressable
              onPress={() => {
                bottomSheetRef.current?.dismiss();
                onTakePhoto();
              }}
              className="bg-surface-surfaceVariant w-full flex-row items-center gap-spacing-8 rounded-radius-medium p-spacing-16 active:opacity-75"
              accessibilityRole="button"
              accessibilityLabel="Take a Photo">
              <View className="h-10 w-10 items-center justify-center rounded-radius-full bg-brand-primary-container">
                <Icon as={Camera} size={20} className="text-brand-primary" />
              </View>
              <Text className="text-body font-cairo font-bold text-text-primary">Take a Photo</Text>
            </Pressable>

            {/* Choose from gallery option */}
            <Pressable
              onPress={() => {
                bottomSheetRef.current?.dismiss();
                onChooseFromGallery();
              }}
              className="bg-surface-surfaceVariant w-full flex-row items-center gap-spacing-8 rounded-radius-medium p-spacing-16 active:opacity-75"
              accessibilityRole="button"
              accessibilityLabel="Choose from Gallery">
              <View className="h-10 w-10 items-center justify-center rounded-radius-full bg-brand-primary-container">
                <Icon as={ImageIcon} size={20} className="text-brand-primary" />
              </View>
              <Text className="text-body font-cairo font-bold text-text-primary">
                Choose from Gallery
              </Text>
            </Pressable>

            {/* Cancel Button */}
            <Pressable
              onPress={() => bottomSheetRef.current?.dismiss()}
              className="py-spacing-14 mt-spacing-8 h-12 w-full items-center justify-center rounded-radius-full border border-surface-border bg-surface-surface active:opacity-75"
              accessibilityRole="button"
              accessibilityLabel="Cancel photo picker">
              <Text className="text-body font-cairo font-bold text-text-primary">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </AppBottomSheet>
    );
  }
);

ImagePickerSheet.displayName = 'ImagePickerSheet';
