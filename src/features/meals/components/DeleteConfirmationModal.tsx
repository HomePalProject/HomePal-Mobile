import React from 'react';
import { View, Modal, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/src/components/ui/text';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmationModal({
  visible,
  onCancel,
  onConfirm,
  isDeleting,
}: DeleteConfirmationModalProps) {
  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/50 p-6">
        <View className="w-full max-w-sm rounded-2xl bg-surface-background p-6 shadow-lg">
          <Text className="font-cairo text-lg font-bold text-text-primary">Delete Meal Plan</Text>
          <Text className="mt-2 font-cairo text-base font-semibold text-text-secondary">
            Are you sure you want to delete this meal plan? This action cannot be undone.
          </Text>

          <View className="mt-6 flex-row justify-end gap-3">
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                onCancel();
              }}
              disabled={isDeleting}
              className="overflow-hidden rounded-full px-4 py-2"
              android_ripple={{ color: 'rgba(150, 150, 150, 0.2)' }}>
              <Text className="font-cairo text-sm font-bold text-brand-primary">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                onConfirm();
              }}
              disabled={isDeleting}
              className={`overflow-hidden rounded-full bg-status-error px-4 py-2 ${isDeleting ? 'opacity-50' : ''}`}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}>
              <Text className="font-cairo text-sm font-bold text-white">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
