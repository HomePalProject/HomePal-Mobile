import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface ImagePickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onChooseFromGallery: () => void;
}

export function ImagePickerSheet({
  visible,
  onClose,
  onTakePhoto,
  onChooseFromGallery,
}: ImagePickerSheetProps) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        {/* Backdrop Dismiss pressable wrapper */}
        <Pressable className="absolute inset-0" onPress={onClose} />

        {/* Bottom Sheet Container */}
        <View className="w-full items-center rounded-t-[32px] bg-surface-surface px-spacing-24 pb-spacing-32 pt-spacing-16 shadow-lg">
          {/* Drag Handle */}
          <View className="mb-spacing-24 h-1.5 w-12 rounded-full bg-surface-border" />

          {/* Title */}
          <Text className="mb-spacing-20 text-center font-cairo text-base font-bold text-text-primary">
            Scan Receipt or Items
          </Text>

          {/* Action List */}
          <View className="w-full gap-spacing-8">
            {/* Take photo option */}
            <Pressable
              onPress={() => {
                onClose();
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
                onClose();
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
              onPress={onClose}
              className="py-spacing-14 mt-spacing-8 h-12 w-full items-center justify-center rounded-radius-full border border-surface-border bg-surface-surface active:opacity-75"
              accessibilityRole="button"
              accessibilityLabel="Cancel photo picker">
              <Text className="text-body font-cairo font-bold text-text-primary">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
