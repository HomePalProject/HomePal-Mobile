import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  visible,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteConfirmationModalProps) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/50 px-spacing-24">
        <View className="w-full max-w-[320px] items-center rounded-[24px] bg-surface-surface p-spacing-24 shadow-lg">
          {/* Circular Red Warning Icon */}
          <View className="mb-spacing-16 h-14 w-14 items-center justify-center rounded-radius-full bg-status-error-container">
            <Icon as={Trash2} size={24} className="text-status-error" />
          </View>

          {/* Title */}
          <Text className="text-heading-3 mb-spacing-8 text-center font-cairo font-bold text-text-primary">
            Remove Item?
          </Text>

          {/* Description Text */}
          <Text className="text-body mb-spacing-24 text-center font-cairo leading-[22px] text-text-secondary">
            Are you sure you want to remove this item from your pantry? This action cannot be
            undone.
          </Text>

          {/* Action Buttons Column */}
          <View className="w-full gap-y-spacing-16">
            {/* Remove Confirm Button */}
            <Pressable
              onPress={onConfirm}
              disabled={isLoading}
              className={`py-spacing-12 h-8 w-full items-center justify-center rounded-radius-full bg-status-error active:scale-95 active:opacity-85 ${
                isLoading ? 'opacity-55' : ''
              }`}
              accessibilityRole="button"
              accessibilityLabel="Confirm removal">
              <Text className="text-body font-cairo font-bold text-white">
                {isLoading ? 'Removing...' : 'Remove'}
              </Text>
            </Pressable>

            {/* Cancel Dismissal Button */}
            <Pressable
              onPress={onCancel}
              disabled={isLoading}
              className="py-spacing-12 h-8 w-full items-center justify-center rounded-radius-full border border-surface-border bg-surface-surface active:scale-95 active:opacity-75"
              accessibilityRole="button"
              accessibilityLabel="Cancel removal">
              <Text className="text-body font-cairo font-bold text-text-primary">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
