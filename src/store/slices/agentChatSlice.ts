import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  ChatMessage,
  AgentChatSessionResponse,
  MessageRole,
} from '@/src/features/agent-chat/types';
import { agentChatService } from '@/src/services';

export interface AgentChatState {
  messages: ChatMessage[];
  sessionId: string | null;
  isLoadingHistory: boolean;
  isStreaming: boolean;
  error: string | null;
}

const initialState: AgentChatState = {
  messages: [],
  sessionId: null,
  isLoadingHistory: false,
  isStreaming: false,
  error: null,
};

export const fetchHistoryThunk = createAsyncThunk(
  'agentChat/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await agentChatService.fetchChatHistory();
      return response;
    } catch (error: any) {
      const status = error?.status || error?.response?.status;
      if (status === 403 || status === '403') {
        return rejectWithValue('SUBSCRIPTION_REQUIRED');
      }
      return rejectWithValue(error?.message || 'Failed to fetch chat history');
    }
  }
);

export const clearHistoryThunk = createAsyncThunk(
  'agentChat/clearHistory',
  async (_, { rejectWithValue }) => {
    try {
      await agentChatService.deleteChatHistory();
      return null;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to clear chat history');
    }
  }
);

const agentChatSlice = createSlice({
  name: 'agentChat',
  initialState,
  reducers: {
    addLocalMessage: (state, action: PayloadAction<{ content: string }>) => {
      const userMessage: ChatMessage = {
        id: `local-user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'user',
        content: action.payload.content,
        createdAt: new Date().toISOString(),
        isStreaming: false,
      };
      state.messages.push(userMessage);
      state.error = null;
    },
    addAgentPlaceholder: (state) => {
      const placeholderMessage: ChatMessage = {
        id: `local-agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
        isStreaming: true,
      };
      state.messages.push(placeholderMessage);
      state.error = null;
    },
    appendAgentChunk: (state, action: PayloadAction<string>) => {
      // Find the last assistant message in the array to append the text delta
      const lastAssistant = [...state.messages].reverse().find((m) => m.role === 'assistant');
      if (lastAssistant) {
        lastAssistant.content = (lastAssistant.content || '') + action.payload;
      } else {
        const newAssistant: ChatMessage = {
          id: `local-agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: action.payload,
          createdAt: new Date().toISOString(),
          isStreaming: true,
        };
        state.messages.push(newAssistant);
      }
    },
    addToolCall: (
      state,
      action: PayloadAction<{
        id: string;
        role: 'tool_call' | 'approval_request';
        toolName: string;
        args: any;
      }>
    ) => {
      const toolMessage: ChatMessage = {
        id: action.payload.id,
        role: action.payload.role,
        toolName: action.payload.toolName,
        args: action.payload.args,
        status: 'pending',
        createdAt: new Date().toISOString(),
        toolCallId: action.payload.role === 'approval_request' ? action.payload.id : undefined,
      };
      state.messages.push(toolMessage);
      state.error = null;
    },
    updateToolResult: (state, action: PayloadAction<{ id: string; result: any }>) => {
      const message = state.messages.find((m) => m.id === action.payload.id);
      if (message) {
        message.result = action.payload.result;
        message.status = 'done';
      }
    },
    updateApprovalStatus: (
      state,
      action: PayloadAction<{ toolCallId: string; status: 'approved' | 'rejected' }>
    ) => {
      const message = state.messages.find((m) => m.toolCallId === action.payload.toolCallId);
      if (message) {
        message.status = action.payload.status;
      }
    },
    setStreamingStatus: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
      if (!action.payload) {
        const lastAssistant = state.messages
          .slice()
          .reverse()
          .find((msg) => msg.role === 'assistant');
        if (lastAssistant) {
          lastAssistant.isStreaming = false;
        }
      }
    },
    clearChatError: (state) => {
      state.error = null;
    },
    cleanupPendingTools: (state) => {
      state.messages.forEach((msg) => {
        if (msg.role === 'tool_call' && msg.status === 'pending') {
          msg.status = 'done';
        }
      });
    },
    removeEmptyPlaceholder: (state) => {
      const idx = state.messages.map((m) => m.role).lastIndexOf('assistant');
      if (idx !== -1) {
        const msg = state.messages[idx];
        const isContentEmpty = !msg.content || msg.content.trim() === '';
        const isTextEmpty = !(msg as any).text || (msg as any).text.trim() === '';
        if (isContentEmpty && isTextEmpty) {
          state.messages.splice(idx, 1);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchHistoryThunk
      .addCase(fetchHistoryThunk.pending, (state) => {
        state.isLoadingHistory = true;
        state.error = null;
      })
      .addCase(
        fetchHistoryThunk.fulfilled,
        (state, action: PayloadAction<AgentChatSessionResponse | null>) => {
          state.isLoadingHistory = false;
          state.messages = (action.payload?.messages || []).map((msg) => ({
            ...msg,
            role: msg.role as MessageRole,
          }));
          state.sessionId = action.payload?.id || null;
        }
      )
      .addCase(fetchHistoryThunk.rejected, (state, action) => {
        state.isLoadingHistory = false;
        state.error = action.payload as string;
      })

      // clearHistoryThunk
      .addCase(clearHistoryThunk.pending, (state) => {
        state.isLoadingHistory = true;
        state.error = null;
      })
      .addCase(clearHistoryThunk.fulfilled, (state) => {
        state.isLoadingHistory = false;
        state.messages = [];
        state.sessionId = null;
      })
      .addCase(clearHistoryThunk.rejected, (state, action) => {
        state.isLoadingHistory = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addLocalMessage,
  addAgentPlaceholder,
  appendAgentChunk,
  addToolCall,
  updateToolResult,
  updateApprovalStatus,
  setStreamingStatus,
  clearChatError,
  cleanupPendingTools,
  removeEmptyPlaceholder,
} = agentChatSlice.actions;

export default agentChatSlice.reducer;
