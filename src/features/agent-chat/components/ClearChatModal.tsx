import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useTranslation } from 'react-i18next';

export interface ClearChatModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
}

export function ClearChatModal({
  visible,
  onClose,
  onConfirm,
  title,
  description,
  cancelText,
  confirmText,
}: ClearChatModalProps) {
  const { theme } = useTheme();
  const { t } = useTranslation('agentChat');

  const modalTitle = title || t('clearModal.title', 'Clear Chat');
  const modalDescription =
    description ||
    t('clearModal.description', 'Are you sure you want to clear your chat session history?');
  const modalCancelText = cancelText || t('clearModal.cancel', 'Cancel');
  const modalConfirmText = confirmText || t('clearModal.confirm', 'Confirm');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-surface-background px-spacing-16">
        {/* Backdrop Pressable */}
        <Pressable className="absolute inset-0" onPress={onClose} />

        {/* Modal Card Content Container */}
        <View className="w-full max-w-[340px] items-center justify-center rounded-radius-large border border-surface-border bg-surface-surface p-spacing-24 shadow-xl">
          {/* Warning Circle Icon */}
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: theme.colors.brand.errorContainer,
            }}
            className="mb-spacing-16 items-center justify-center">
            <AlertTriangle size={28} color={theme.colors.brand.error} />
          </View>

          {/* Heading */}
          <Text className="text-bodyLarge mb-spacing-8 text-center font-cairo font-bold text-text-primary">
            {modalTitle}
          </Text>

          {/* Message Description */}
          <Text className="text-bodySmall mb-spacing-24 text-center font-cairo leading-[20px] text-text-secondary">
            {modalDescription}
          </Text>

          {/* Action Buttons Row */}
          <View className="w-full flex-row items-center justify-between gap-x-spacing-16">
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={modalCancelText}
              className="h-12 flex-1 flex-row items-center justify-center rounded-radius-full border border-surface-border bg-transparent active:bg-surface-border/40">
              <Text className="text-body font-cairo font-bold text-brand-primary">
                {modalCancelText}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                onConfirm();
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel={modalConfirmText}
              className="h-12 flex-1 flex-row items-center justify-center rounded-radius-full bg-brand-error active:bg-brand-error/80">
              <Text className="text-body font-cairo font-bold text-text-inverse">
                {modalConfirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
