Searched for "chat"
Searched for "chat"
Viewed household-management.html:1-800
Searched for "chat"
Viewed household-management.html:8400-9048
Viewed household-management.html:8000-8410
Viewed AgentChatController.cs:1-59

Here is the extracted chat handling logic from [household-management.html](file:///c:/Users/ysfah/OneDrive/Desktop/HomePal/HomePal.Api/wwwroot/household-management.html) and a comprehensive, simplified implementation guide tailored for **React Native**.

---

# 📖 React Native AI Chat Integration Documentation

## 1. Overview & API Endpoints

HomePal AI Chat interacts with [AgentChatController](file:///c:/Users/ysfah/OneDrive/Desktop/HomePal/HomePal.Api/Controllers/AgentChatController.cs). It uses **Server-Sent Events (SSE)** streaming for real-time tokens and tool execution cards.

| Action                            | HTTP Method | Endpoint              | Headers                                                           | Body / Query                                                                |
| :-------------------------------- | :---------- | :-------------------- | :---------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| **Get Session History**           | `GET`       | `/api/agent-chat`     | `Authorization: Bearer <token>`                                   | None                                                                        |
| **Clear History**                 | `DELETE`    | `/api/agent-chat`     | `Authorization: Bearer <token>`                                   | None                                                                        |
| **Send Message / Approve Action** | `POST`      | `/api/agent-chat/run` | `Authorization: Bearer <token>`, `Content-Type: application/json` | `{ "message": "..." }` or `{ "toolCallId": "...", "approved": true/false }` |

> [!NOTE]
> All endpoints require an active subscription (returns `403 Forbidden` if not subscribed).

---

## 2. Event Types & Stream Protocol

The POST `/api/agent-chat/run` stream sends `data: { ... }\n\n` SSE chunks with the following event schema:

| Event `type`           | Payload Fields                                        | Purpose / Description                                                               |
| :--------------------- | :---------------------------------------------------- | :---------------------------------------------------------------------------------- |
| `TEXT_MESSAGE_CONTENT` | `delta: string`                                       | Token chunk to append to the active assistant bubble.                               |
| `TOOL_CALL_START`      | `toolCallId: string`, `toolName: string`, `args: any` | Agent started running an internal tool (e.g. searching pantry, calculating budget). |
| `TOOL_CALL_REQUEST`    | `toolCallId: string`, `toolName: string`, `args: any` | Requires user confirmation (Approve / Reject).                                      |
| `TOOL_CALL_RESULT`     | `toolCallId: string`, `result: any`                   | Completed tool output.                                                              |
| `ERROR`                | `message: string`                                     | Stream error description.                                                           |

---

## 3. React Native Architecture & Implementation

### A. TypeScript Models

```typescript
// types/chat.ts
export type MessageRole = 'user' | 'assistant' | 'tool_call' | 'approval_request';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text?: string;
  toolCallId?: string;
  toolName?: string;
  args?: any;
  result?: any;
  status?: 'pending' | 'approved' | 'rejected' | 'done';
  timestamp: Date;
}
```

### B. SSE Streaming Client (using `react-native-sse` or `fetch` stream)

Install: `npm install react-native-sse react-native-markdown-display`

```typescript
// services/chatService.ts
import EventSource from 'react-native-sse';

const BASE_URL = 'https://your-api-domain.com';

export const fetchChatHistory = async (token: string) => {
  const res = await fetch(`${BASE_URL}/api/agent-chat`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 403) throw new Error('SUBSCRIPTION_REQUIRED');
  return res.json();
};

export const clearChatHistory = async (token: string) => {
  return fetch(`${BASE_URL}/api/agent-chat`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const streamAgentChat = (
  token: string,
  payload: { message?: string; toolCallId?: string; approved?: boolean },
  callbacks: {
    onToken: (delta: string) => void;
    onToolStart: (toolCallId: string, toolName: string, args: any) => void;
    onToolRequest: (toolCallId: string, toolName: string, args: any) => void;
    onToolResult: (toolCallId: string, result: any) => void;
    onError: (err: any) => void;
    onComplete: () => void;
  }
) => {
  const es = new EventSource(`${BASE_URL}/api/agent-chat/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  es.addEventListener('message', (event: any) => {
    if (!event.data) return;
    try {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'TEXT_MESSAGE_CONTENT':
          callbacks.onToken(data.delta);
          break;
        case 'TOOL_CALL_START':
          callbacks.onToolStart(data.toolCallId, data.toolName, data.args);
          break;
        case 'TOOL_CALL_REQUEST':
          callbacks.onToolRequest(data.toolCallId, data.toolName, data.args);
          break;
        case 'TOOL_CALL_RESULT':
          callbacks.onToolResult(data.toolCallId, data.result);
          break;
        case 'ERROR':
          callbacks.onError(data.message);
          break;
      }
    } catch (e) {
      console.warn('SSE Parse error', e);
    }
  });

  es.addEventListener('error', (err: any) => {
    callbacks.onError(err);
    es.close();
  });

  es.addEventListener('close', () => {
    callbacks.onComplete();
  });

  return es;
};
```

---

### C. React Native Chat Screen Component

```tsx
// screens/AgentChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { fetchChatHistory, clearChatHistory, streamAgentChat } from '../services/chatService';
import { ChatMessage } from '../types/chat';

export const AgentChatScreen = ({
  token,
  onNavigateToSubscription,
}: {
  token: string;
  onNavigateToSubscription: () => void;
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPaywall, setIsPaywall] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetchChatHistory(token);
      if (res.data?.messages) {
        const mapped = res.data.messages.map((m: any, idx: number) => ({
          id: idx.toString(),
          role: m.role,
          text: m.content,
          timestamp: new Date(),
        }));
        setMessages(mapped);
      }
    } catch (e: any) {
      if (e.message === 'SUBSCRIPTION_REQUIRED') setIsPaywall(true);
    }
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsStreaming(true);

    const assistantMsgId = (Date.now() + 1).toString();
    let currentAssistantText = '';

    streamAgentChat(
      token,
      { message: query },
      {
        onToken: (delta) => {
          currentAssistantText += delta;
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === assistantMsgId);
            if (!exists) {
              return [
                ...prev,
                {
                  id: assistantMsgId,
                  role: 'assistant',
                  text: currentAssistantText,
                  timestamp: new Date(),
                },
              ];
            }
            return prev.map((m) =>
              m.id === assistantMsgId ? { ...m, text: currentAssistantText } : m
            );
          });
        },
        onToolStart: (id, name, args) => {
          setMessages((prev) => [
            ...prev,
            {
              id,
              role: 'tool_call',
              toolName: name,
              args,
              status: 'pending',
              timestamp: new Date(),
            },
          ]);
        },
        onToolRequest: (id, name, args) => {
          setMessages((prev) => [
            ...prev,
            {
              id,
              role: 'approval_request',
              toolCallId: id,
              toolName: name,
              args,
              status: 'pending',
              timestamp: new Date(),
            },
          ]);
        },
        onToolResult: (id, result) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, result, status: 'done' } : m))
          );
        },
        onError: (err) => {
          console.error(err);
          setIsStreaming(false);
        },
        onComplete: () => {
          setIsStreaming(false);
        },
      }
    );
  };

  const handleApproval = (toolCallId: string, approved: boolean) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.toolCallId === toolCallId ? { ...m, status: approved ? 'approved' : 'rejected' } : m
      )
    );
    setIsStreaming(true);
    streamAgentChat(
      token,
      { toolCallId, approved },
      {
        onToken: (delta) => {
          /* append tokens as normal */
        },
        onToolStart: () => {},
        onToolRequest: () => {},
        onToolResult: () => {},
        onError: () => setIsStreaming(false),
        onComplete: () => setIsStreaming(false),
      }
    );
  };

  if (isPaywall) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.title}>AI Assistant Subscription</Text>
        <Text style={styles.subtitle}>
          Unlock personalized meal plans, pantry scans & AI assistant.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={onNavigateToSubscription}>
          <Text style={styles.primaryBtnText}>✨ Subscribe Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Household Assistant</Text>
          <TouchableOpacity onPress={() => clearChatHistory(token).then(() => setMessages([]))}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Suggestion Chips */}
        <View style={styles.suggestionsContainer}>
          {['🍲 Meal Plan', '🥫 Check Pantry', '💰 Budget Review'].map((prompt, i) => (
            <TouchableOpacity key={i} style={styles.chip} onPress={() => handleSend(prompt)}>
              <Text style={styles.chipText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Messages Feed */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            if (item.role === 'user') {
              return (
                <View style={[styles.msgRow, styles.userRow]}>
                  <View style={styles.userBubble}>
                    <Text style={styles.userMsgText}>{item.text}</Text>
                  </View>
                </View>
              );
            }

            if (item.role === 'approval_request') {
              return (
                <View style={styles.approvalCard}>
                  <Text style={styles.approvalTitle}>
                    ⚠️ Confirmation Required: {item.toolName}
                  </Text>
                  <Text style={styles.approvalDesc}>{JSON.stringify(item.args)}</Text>
                  {item.status === 'pending' ? (
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={[styles.btnAction, styles.btnApprove]}
                        onPress={() => handleApproval(item.toolCallId!, true)}>
                        <Text style={styles.btnText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.btnAction, styles.btnReject]}
                        onPress={() => handleApproval(item.toolCallId!, false)}>
                        <Text style={styles.btnText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={{ fontWeight: 'bold', marginTop: 8 }}>
                      Status: {item.status?.toUpperCase()}
                    </Text>
                  )}
                </View>
              );
            }

            if (item.role === 'tool_call') {
              return (
                <View style={styles.toolCard}>
                  <Text style={styles.toolText}>⚡ Executing {item.toolName}...</Text>
                  {item.status === 'done' && <Text style={styles.toolDone}>✓ Completed</Text>}
                </View>
              );
            }

            return (
              <View style={[styles.msgRow, styles.assistantRow]}>
                <View style={styles.assistantBubble}>
                  <Markdown>{item.text || ''}</Markdown>
                </View>
              </View>
            );
          }}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask HomePal AI..."
            editable={!isStreaming}
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => handleSend()}
            disabled={isStreaming || !inputText.trim()}>
            {isStreaming ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendBtnText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fbf9f4' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  lockIcon: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#1b5042', marginBottom: 8 },
  subtitle: { textAlign: 'center', color: '#404945', marginBottom: 20 },
  primaryBtn: {
    backgroundColor: '#1b5042',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  primaryBtnText: { color: '#ffffff', fontWeight: 'bold' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e4e2dd',
  },
  headerTitle: { fontWeight: '800', fontSize: 16, color: '#1b5042' },
  clearText: { color: '#ba1a1a', fontWeight: '600' },
  suggestionsContainer: { flexDirection: 'row', padding: 8, backgroundColor: '#fff', gap: 8 },
  chip: { backgroundColor: '#f0eee9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  chipText: { fontSize: 12, fontWeight: '600', color: '#1b5042' },
  msgRow: { marginVertical: 6, marginHorizontal: 12, flexDirection: 'row' },
  userRow: { justifyContent: 'flex-end' },
  assistantRow: { justifyContent: 'flex-start' },
  userBubble: {
    backgroundColor: '#1b5042',
    padding: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
  },
  userMsgText: { color: '#ffffff', fontSize: 14 },
  assistantBubble: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: '85%',
    borderWidth: 1,
    borderColor: '#e4e2dd',
  },
  approvalCard: {
    margin: 12,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#fdba5a',
  },
  approvalTitle: { fontWeight: '800', color: '#835500', marginBottom: 4 },
  approvalDesc: {
    fontSize: 12,
    color: '#52625e',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btnAction: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  btnApprove: { backgroundColor: '#1b5042' },
  btnReject: { backgroundColor: '#ba1a1a' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  toolCard: {
    marginHorizontal: 12,
    marginVertical: 4,
    padding: 8,
    backgroundColor: '#f0eee9',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toolText: { fontSize: 12, color: '#52625e' },
  toolDone: { fontSize: 12, color: '#2e7d32', fontWeight: 'bold' },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e4e2dd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#f5f3ee',
    borderRadius: 22,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  sendBtn: {
    width: 64,
    height: 44,
    backgroundColor: '#1b5042',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: { color: '#ffffff', fontWeight: 'bold' },
});
```
