import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '@/src/hooks/useTheme';
import { useAppSelector } from '@/src/store';
import { ChatMessage } from '../types';
import { useTranslation } from 'react-i18next';

export interface ChatMessageItemProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const { theme } = useTheme();
  const { t } = useTranslation('agentChat');
  const { profileImageUri, fullName } = useAppSelector((state) => state.profile);
  const isUser = message.role === 'user';

  // Memoize markdown styling using variables from our useTheme hook to support dynamic theming
  const markdownStyles = useMemo(
    () => ({
      body: {
        fontFamily: 'Cairo',
        fontSize: 14,
        color: theme.colors.text.primary,
        lineHeight: 22,
      },
      paragraph: {
        fontFamily: 'Cairo',
        fontSize: 14,
        color: theme.colors.text.primary,
        lineHeight: 22,
        marginBottom: 8,
        marginTop: 0,
      },
      strong: {
        fontWeight: 'bold' as const,
      },
      bullet_list: {
        marginVertical: 8,
      },
      list_item: {
        fontFamily: 'Cairo',
        fontSize: 14,
        color: theme.colors.text.primary,
        lineHeight: 22,
        marginVertical: 2,
      },
      table: {
        borderWidth: 1,
        borderColor: theme.colors.surface.border,
        borderRadius: 8,
        overflow: 'hidden' as const,
        marginVertical: 8,
      },
      thead: {
        backgroundColor: theme.colors.brand.primary,
      },
      th: {
        fontFamily: 'Cairo',
        color: theme.colors.text.inverse,
        fontWeight: 'bold' as const,
        padding: 10,
        textAlign: 'left' as const,
      },
      td: {
        fontFamily: 'Cairo',
        padding: 10,
        borderTopWidth: 1,
        borderColor: theme.colors.surface.border,
        color: theme.colors.text.primary,
      },
    }),
    [theme]
  );

  if (isUser) {
    const userInitial = fullName ? fullName.trim()[0]?.toUpperCase() : 'U';

    return (
      <View className="mb-spacing-24 me-spacing-16 ms-spacing-32 flex-row items-start justify-end">
        <View className="max-w-[80%] rounded-radius-large rounded-br-radius-small bg-brand-primary px-spacing-16 py-spacing-16 shadow-sm">
          <Text className="text-bodySmall font-cairo text-text-inverse">{message.content}</Text>
        </View>

        {/* User Profile Avatar */}
        {profileImageUri ? (
          <Image
            source={{ uri: profileImageUri }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            className="ms-spacing-8"
            resizeMode="cover"
          />
        ) : (
          <View
            style={{ width: 40, height: 40, borderRadius: 20 }}
            className="ms-spacing-8 items-center justify-center border border-surface-border bg-brand-primary-container">
            <Text className="text-bodySmall font-cairo font-bold text-brand-primary">
              {userInitial}
            </Text>
          </View>
        )}
      </View>
    );
  }

  // Assistant message rendering
  const showTypingIndicator = message.isStreaming && !message.content?.trim();

  return (
    <View className="mb-spacing-24 me-spacing-32 ms-spacing-16 flex-row items-start">
      {/* Small Bot Avatar Image */}
      <Image
        source={require('@/src/assets/images/ai-avatar.png')}
        style={{ width: 40, height: 40, borderRadius: 16 }}
        className="me-spacing-8 mt-spacing-4"
        resizeMode="contain"
      />

      {/* Assistant Bubble with strictly a left border orange line indicator */}
      <View className="flex-1 rounded-radius-large rounded-bl-radius-small border-l-4 border-brand-accent bg-surface-surface px-spacing-16 py-spacing-16 shadow-sm">
        {showTypingIndicator ? (
          <View className="flex-row items-center gap-spacing-8">
            <ActivityIndicator size="small" color={theme.colors.brand.primary} />
            <Text className="text-caption font-cairo italic text-text-secondary">
              {t('messages.typing', 'HomePal is typing...')}
            </Text>
          </View>
        ) : (
          <Markdown style={markdownStyles}>{message.content || ''}</Markdown>
        )}
      </View>
    </View>
  );
}
