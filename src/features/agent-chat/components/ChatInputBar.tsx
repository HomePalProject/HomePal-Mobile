import React from 'react';
import { View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Plus, Send } from 'lucide-react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useTranslation } from 'react-i18next';

export interface ChatInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  onAttachPress?: () => void;
}

export function ChatInputBar({
  value,
  onChangeText,
  onSend,
  isStreaming = false,
  disabled = false,
  onAttachPress,
}: ChatInputBarProps) {
  const { theme } = useTheme();
  const { t } = useTranslation('agentChat');

  return (
    <View className="flex-row items-center gap-spacing-8 border-t border-surface-border bg-surface-background px-spacing-16 py-spacing-8">
      {/* Left: Plus/Attach Button */}
      {/* <Pressable
        onPress={onAttachPress}
        disabled={disabled || isStreaming}
        accessibilityRole="button"
        accessibilityLabel="Attach file"
        style={{ width: 44, height: 44, borderRadius: 22 }}
        className="bg-surface-surfaceVariant/60 items-center justify-center active:opacity-75 disabled:opacity-50">
        <Plus size={22} color={theme.colors.text.secondary} />
      </Pressable> */}

      {/* Middle/Right: Rounded wrapper containing both TextInput and Send Button */}
      <View
        style={{ height: 55 }}
        className="flex-1 flex-row items-center rounded-radius-full border border-surface-border bg-surface-surface pl-spacing-16 pr-spacing-4">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={t('input.placeholder', 'Message Assistant...')}
          placeholderTextColor={theme.colors.text.disabled}
          editable={!disabled && !isStreaming}
          className="h-full flex-1 font-cairo text-base text-text-primary"
          style={{ paddingVertical: 0 }}
        />

        {/* Send / Action Button nested inside the input wrapper */}
        <Pressable
          onPress={onSend}
          disabled={disabled || (!value.trim() && !isStreaming)}
          accessibilityRole="button"
          accessibilityLabel={
            isStreaming
              ? t('input.generating', 'Generating response')
              : t('input.send', 'Send message')
          }
          style={{ width: 40, height: 40, borderRadius: 20 }}
          className="m-1 items-center justify-center bg-brand-primary active:opacity-75 disabled:opacity-50">
          {isStreaming ? (
            <ActivityIndicator size="small" color={theme.colors.text.inverse} />
          ) : (
            <Send size={18} color={theme.colors.text.inverse} />
          )}
        </Pressable>
      </View>
    </View>
  );
}
