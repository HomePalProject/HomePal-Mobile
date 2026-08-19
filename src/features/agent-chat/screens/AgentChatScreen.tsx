import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  FlatList,
  Platform,
  View,
  Text,
  Pressable,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock } from 'lucide-react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useAgentChat } from '../hooks/useAgentChat';
import {
  ChatHeader,
  ChatInputBar,
  EmptyChatView,
  ChatMessageItem,
  ToolActionCard,
  ClearChatModal,
} from '../components';
import { ChatMessage } from '../types';

const QUICK_ACTION_CHIPS = [
  { label: '💡 Weekly Meal Plan', query: 'Weekly Meal Plan' },
  { label: '🥫 Pantry Inventory', query: 'Pantry Inventory' },
  { label: '⚠️ Expiring Items', query: 'Expiring Items' },
  { label: '💰 Budget Summary', query: 'Budget Summary' },
  { label: '🛒 Grocery Deals', query: 'Grocery Deals' },
];

export function AgentChatScreen() {
  const { theme, resolvedMode } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState('');
  const [isClearModalVisible, setIsClearModalVisible] = useState(false);

  const {
    messages,
    isLoadingHistory,
    isStreaming,
    error,
    sendMessage,
    approveToolCall,
    loadHistory,
    clearHistory,
  } = useAgentChat();

  // Filter messages to hide completed internal tool calls
  const visibleMessages = useMemo(() => {
    return messages.filter((msg) => !(msg.role === 'tool_call' && msg.status === 'done'));
  }, [messages]);

  // Load chat history session on component mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    sendMessage(text);
    setInputText('');
  };

  const handleSuggestionPress = (suggestion: string) => {
    sendMessage(suggestion);
  };

  // Paywall View for unsubscribed accounts
  if (error === 'SUBSCRIPTION_REQUIRED') {
    return (
      <SafeAreaView className="flex-1 bg-surface-background">
        <StatusBar
          backgroundColor={theme.colors.surface.surface}
          barStyle={resolvedMode === 'dark' ? 'light-content' : 'dark-content'}
        />
        <View className="flex-1 items-center justify-center p-spacing-24">
          <View
            style={{ width: 80, height: 80, borderRadius: 40 }}
            className="mb-spacing-16 items-center justify-center border-2 border-brand-primary bg-brand-primary-container">
            <Lock size={36} color={theme.colors.brand.primary} />
          </View>
          <Text className="mb-spacing-8 text-center font-cairo text-xl font-bold text-brand-primary">
            AI Assistant Subscription
          </Text>
          <Text className="text-bodySmall mb-spacing-24 px-spacing-32 text-center font-cairo text-text-secondary">
            Unlock personalized meal plans, pantry scans & AI assistant.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Subscribe to AI assistant"
            className="py-spacing-12 rounded-radius-full bg-brand-primary px-spacing-24 active:opacity-75">
            <Text className="text-bodySmall font-cairo font-bold text-text-inverse">
              Subscribe Now
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <StatusBar
        backgroundColor={theme.colors.surface.surface}
        barStyle={resolvedMode === 'dark' ? 'light-content' : 'dark-content'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        {/* Header Navigation */}
        <ChatHeader />

        {/* Online Indicator & History Clear Bar */}
        {messages.length > 0 && (
          <View className="flex-row items-center justify-between border-b border-surface-border bg-surface-surface px-spacing-16 py-spacing-8">
            <View className="flex-row items-center gap-spacing-8">
              <View style={{ width: 8, height: 8, borderRadius: 4 }} className="bg-brand-success" />
              <Text className="font-cairo text-base font-semibold text-text-secondary">
                HomePal Assistant • Online
              </Text>
            </View>
            <Pressable
              onPress={() => setIsClearModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Clear chat history"
              className="active:opacity-75">
              <Text className="font-cairo text-base font-bold text-brand-error">Clear</Text>
            </Pressable>
          </View>
        )}

        {/* Persistent Quick Action Chips */}
        <View className="py-spacing-8">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            className="mb-spacing-8 max-h-14">
            {QUICK_ACTION_CHIPS.map((chip, index) => (
              <Pressable
                key={index}
                onPress={() => sendMessage(chip.query)}
                accessibilityRole="button"
                accessibilityLabel={`Quick action: ${chip.label}`}
                className="bg-surface-surfaceVariant flex-row items-center rounded-radius-full border border-surface-border px-spacing-16 py-spacing-8 active:opacity-75">
                <Text className="font-cairo text-sm font-semibold text-text-primary">
                  {chip.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Message List / Welcome View / Loading Indicator */}
        {isLoadingHistory ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#1b5042" />
          </View>
        ) : visibleMessages.length === 0 && !isStreaming ? (
          <EmptyChatView onSuggestionPress={handleSuggestionPress} />
        ) : (
          <FlatList
            ref={flatListRef}
            data={visibleMessages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 16 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => {
              const isTool = item.role === 'tool_call' || item.role === 'approval_request';
              if (isTool) {
                return (
                  <ToolActionCard
                    message={item}
                    onApprove={(approved) => approveToolCall(item.toolCallId || item.id, approved)}
                  />
                );
              }
              return <ChatMessageItem message={item} />;
            }}
          />
        )}

        {/* Bottom Input Controls */}
        <ChatInputBar
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          isStreaming={isStreaming}
          disabled={isStreaming || isLoadingHistory}
        />
      </KeyboardAvoidingView>

      <ClearChatModal
        visible={isClearModalVisible}
        onClose={() => setIsClearModalVisible(false)}
        onConfirm={clearHistory}
      />
    </SafeAreaView>
  );
}
