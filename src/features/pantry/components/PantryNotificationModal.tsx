import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Check, AlertTriangle } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface PantryNotificationModalProps {
  visible: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

export function PantryNotificationModal({
  visible,
  type,
  title,
  message,
  onClose,
}: PantryNotificationModalProps) {
  const isSuccess = type === 'success';

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50 px-spacing-24">
        <View className="w-full max-w-[320px] items-center rounded-[24px] bg-surface-surface p-spacing-24 shadow-lg">
          {/* Circular Status Icon Container */}
          <View
            className={[
              'mb-spacing-16 h-14 w-14 items-center justify-center rounded-radius-full',
              isSuccess ? 'bg-brand-primary-container' : 'bg-status-error-container',
            ].join(' ')}>
            <Icon
              as={isSuccess ? Check : AlertTriangle}
              size={24}
              className={isSuccess ? 'text-brand-primary' : 'text-status-error'}
            />
          </View>

          {/* Title */}
          <Text className="text-heading-3 mb-spacing-8 text-center font-cairo font-bold text-text-primary">
            {title}
          </Text>

          {/* Message Content */}
          <Text className="text-body mb-spacing-24 text-center font-cairo leading-[22px] text-text-secondary">
            {message}
          </Text>

          {/* Dismiss Button */}
          <Pressable
            onPress={onClose}
            className={[
              'h-12 w-full items-center justify-center rounded-radius-full active:opacity-85',
              isSuccess ? 'bg-brand-primary' : 'bg-status-error',
            ].join(' ')}
            accessibilityRole="button"
            accessibilityLabel="Close notification">
            <Text className="text-body font-cairo font-bold text-white">OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
